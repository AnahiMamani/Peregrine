const Usuario = require('../models/Usuario_01');
const Viajante = require('../models/Viajante_02');
const ViajanteViagem = require('../models/ViajanteViagem_04');
const Viagem = require('../models/Viagem_03');
require('dotenv').config(); // Para usar variáveis de ambiente do arquivo .env
const sequelize = require('../config/bd');
const Denuncia = require("../models/Denuncia_05");


module.exports = {
    cadastrarViagem: async (req, res) => {
        const { linkgrupo, descricaoViagem, tituloViagem, subtituloViagem, origemViagem, destinoViagem, vagasViagem, custoViagem, localIdaViagem, dataIdaViagem, horaIdaViagem, localVoltaViagem, dataVoltaViagem, horaVoltaViagem } = req.body;
        const transaction = await sequelize.transaction();

        try {

            const userId = req.session?.user?.id;

            const viajante = await Viajante.findOne({
                where: { A01_ID: userId }, // O campo correto é A01_ID
                include: { model: Usuario, attributes: ['A01_ID'] },
            });

            const viajanteId = viajante.A02_ID;

            // Salva a nova viagem
            await Viagem.create({
                A03_TITULO: tituloViagem,
                A03_SUBTITULO: subtituloViagem,
                A03_DESCRICAO: descricaoViagem,
                A03_ORIGEM: origemViagem,
                A03_DESTINO: destinoViagem,
                A03_LOCAL_IDA: localIdaViagem,
                A03_DATA_IDA: dataIdaViagem,
                A03_HORA_IDA: horaIdaViagem,
                A03_LOCAL_VOLTA: localVoltaViagem,
                A03_DATA_VOLTA: dataVoltaViagem,
                A03_HORA_VOLTA: horaVoltaViagem,
                A03_CUSTO: custoViagem,
                A03_LINK: linkgrupo,
                A03_VAGAS: vagasViagem,
                A02_ID_ORGANIZADORA: viajanteId,
                A03_STATUS: 'ATIVADA', // Status inicial
            }, { transaction });

            await transaction.commit();

            res.redirect('/'); // Redireciona para a página de listagem
        } catch (error) {
            console.error('Erro ao cadastrar viagem:', error);
            res.status(500).send('Erro ao cadastrar viagem');
        }
    },
    adicionarViagem: async (req, res) => {
        const transaction = await sequelize.transaction(); // Inicia a transação
        try {
            const viagemId = req.params.id; // Obter o ID da URL
            const userId = req.session?.user?.id; // Obter o ID do usuário da sessão
            console.log('User ID:', userId); // Verificar se o ID do usuário é recuperado corretamente
    
            const viagem = await Viagem.findOne({
                where: { A03_ID: viagemId }, // Buscar a viagem pelo ID
            });
    
            if (!viagem) {
                return res.status(404).json({ message: 'Viagem não encontrada' });
            }
    
            // Verificar se o usuário é a organizadora
            if (viagem.A02_ID_ORGANIZADORA === userId) {
                return res.status(400).json({ message: 'Você já é a organizadora da viagem. Edite sua viagem em "Minhas viagens" no seu perfil.' });
            }
    
            const viajante = await Viajante.findOne({
                where: { A01_ID: userId }, // O campo correto é A01_ID
                include: { model: Usuario, attributes: ['A01_ID'] },
            });
    
            if (!viajante) {
                console.log('Viajante não encontrado'); // Depuração
                return res.status(404).json({ message: 'Viajante não encontrado' });
            }
    
            const viajanteId = viajante.A02_ID;
            console.log('Viajante ID:', viajanteId); // Verificar o ID do viajante
    
            // Adiciona o registro na tabela ViajanteViagem
            await ViajanteViagem.create({
                A02_ID: viajanteId,
                A03_ID: viagemId,
            }, { transaction });
    
            await transaction.commit(); // Confirma a transação
            res.status(200).json({ message: 'Inscrição realizada com sucesso!' });
        } catch (error) {
            await transaction.rollback(); // Reverte a transação em caso de erro
            console.error('Erro ao adicionar viagem:', error);
            res.status(500).json({ message: 'Erro ao realizar inscrição na viagem' });
        }
    }
    ,
    denuncia: async (req, res) => {
        const { tituloDenuncia, descricaoDenuncia, idPessoaDenunciada } = req.body;
        const viagemId = req.params.id;
        const userId = req.session?.user?.id;

        try {
            const denunciarte = await Viajante.findOne({
                where: { A01_ID: userId } // O campo correto é A01_ID
            });
    
            const denuncianteID = denunciarte.A02_ID;
            // Criação da denúncia no banco de dados
            await Denuncia.create({
                A05_TITULO: tituloDenuncia,
                A05_DESCRICAO: descricaoDenuncia,
                A02_ID_DENUNCIADO: idPessoaDenunciada,
                A02_ID_DENUNCIANTE: denuncianteID, // ID do denunciante
                A03_ID: viagemId,  // ID da viagem
                A05_DATA: new Date(), // Data atual
                A05_STATUS: 'PENDENTE'
            });

            // Redirecionar para a página de "denúncia concluída"
            res.redirect('/perfil/denuncia/concluida');
        } catch (erro) {
            console.error('Erro ao cadastrar denúncia:', erro);
            res.status(500).send('Erro ao cadastrar denúncia');
        }
    }
}