const Usuario = require('../models/Usuario_01');
const Viajante = require('../models/Viajante_02');
const Viagem = require('../models/Viagem_03');
require('dotenv').config(); // Para usar variáveis de ambiente do arquivo .env
const sequelize = require('../config/bd');

module.exports = {
    cadastrarViagem: async (req, res) => {
        const {descricaoViagem, tituloViagem,subtituloViagem,origemViagem,destinoViagem,vagasViagem,custoViagem,localIdaViagem, dataIdaViagem, horaIdaViagem, localVoltaViagem, dataVoltaViagem, horaVoltaViagem} = req.body;
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
                A03_HORA_IDA:horaIdaViagem,  
                A03_LOCAL_VOLTA:localVoltaViagem,  
                A03_DATA_VOLTA:dataVoltaViagem,  
                A03_HORA_VOLTA:horaVoltaViagem,  
                A03_CUSTO: custoViagem,
                A03_VAGAS: vagasViagem,
                A02_ID_ORGANIZADORA: viajanteId,
                A03_STATUS: 'Planejada', // Status inicial
            },{ transaction });

            await transaction.commit();

            res.redirect('/viagem/criada'); // Redireciona para a página de listagem
        } catch (error) {
            console.error('Erro ao cadastrar viagem:', error);
            res.status(500).send('Erro ao cadastrar viagem');
        }
    },
}