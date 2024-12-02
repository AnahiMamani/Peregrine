const Viajante = require('../models/Viajante_02');
const Avaliacao = require('../models/Avaliacao_06');
const sequelize = require('../config/bd');

// Função para atualizar a nota média do viajante
const atualizarNotaViajante = async (organizadoraId) => {
    try {
        const resultados = await Avaliacao.findAll({
            where: { A02_ID_AVALIADO: organizadoraId },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('A06_NOTA')), 'media'],
                [sequelize.fn('COUNT', sequelize.col('A06_ID')), 'quantidade']
            ],
            raw: true
        });

        const novaMedia = parseFloat(resultados[0].media) || 0;
        const novaQuantidade = parseInt(resultados[0].quantidade, 10) || 0;

        await Viajante.update(
            {
                A02_NOTA: novaMedia,
                A02_TOTAL_AVALIACOES: novaQuantidade
            },
            { where: { A02_ID: organizadoraId } }
        );

        console.log('Nota média e quantidade de avaliações atualizadas com sucesso.');
    } catch (error) {
        console.error('Erro ao atualizar a nota do viajante:', error);
    }
};

// Função para criar ou atualizar uma avaliação
const criarOuAtualizarAvaliacao = async (req, res) => {
    const { organizadoraId, nota } = req.body;
    const userId = req.session?.user?.id;

    try {

        const avaliador = await Viajante.findOne({
            where: { A01_ID: userId } // O campo correto é A01_ID
        });

        const avaliadorId = avaliador.A02_ID;

        if (nota < 1 || nota > 5) {
            return res.status(400).json({ error: 'Nota inválida. Deve estar entre 1 e 5.' });
        }

        // Verifica se a avaliação já existe
        const avaliacaoExistente = await Avaliacao.findOne({
            where: {
                A02_ID_AVALIADOR: avaliadorId,
                A02_ID_AVALIADO: organizadoraId
            }
        });

        if (avaliacaoExistente) {
            // Atualiza a avaliação existente
            await avaliacaoExistente.update({ A06_NOTA: nota });
        } else {
            // Cria uma nova avaliação
            await Avaliacao.create({
                A02_ID_AVALIADOR: avaliadorId,
                A02_ID_AVALIADO: organizadoraId,
                A06_NOTA: nota
            });
        }

        // Recalcula a nota média do avaliado
        await atualizarNotaViajante(organizadoraId);

        res.status(200).json({ message: 'Avaliação registrada ou atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar ou atualizar a avaliação:', error);
        res.status(500).json({ error: 'Erro ao registrar a avaliação. Tente novamente mais tarde.' });
    }
};

module.exports = { criarOuAtualizarAvaliacao };
