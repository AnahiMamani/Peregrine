const { Op } = require('sequelize');  // Importa o operador `Op` do Sequelize
const Usuario = require('../models/Usuario_01'); // Ajuste o caminho conforme necessário
const Viajante = require('../models/Viajante_02'); // Ajuste o caminho conforme necessário
const Denuncia = require('../models/Denuncia_05'); // Ajuste o caminho conforme necessário
const Viagem = require('../models/Viagem_03');

const formatarData = (data) => {
    const dataAjustada = new Date(data);
    // Ajusta a data para o fuso horário local sem alterar o valor original
    dataAjustada.setMinutes(dataAjustada.getMinutes() + dataAjustada.getTimezoneOffset());
    return dataAjustada.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
module.exports = {
    renderIndexAdmin: (req, res) => {
        res.render('pages/admin/index', {
            title: 'Administrador - Página Inicial',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    //RELATORIOS
    renderRelatorio: (req, res) => {
        res.render('pages/admin/relatorios/index', {
            title: 'Relatório',
            user: req.session.user
        });
    },

    renderRelatorioConcluido: (req, res) => {
        res.render('pages/admin/relatorios/relatorio-concluido', {
            title: 'Relatório',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    //VIAJANTES
    renderViajantes: (req, res) => {
        res.render('pages/admin/viajantes/index', {
            title: 'Usuários - Viajantes',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    listarViajantes: async (req, res) => {
        try {
            let viajantes;
            let buscaRealizada = false;
            const query = req.query.query ? req.query.query.trim() : ''; // Captura o termo de busca, ou define como string vazia

            if (query) {
                buscaRealizada = true;

                // Realiza a busca pelo nome do viajante ou email do usuário associado
                viajantes = await Viajante.findAll({
                    include: [
                        {
                            model: Usuario,
                            attributes: ['A01_EMAIL'], // Campos do usuário que queremos incluir
                            required: true, // Inclui apenas os viajantes que têm usuários associados
                            where: {
                                A01_STATUS: 'ATIVO' // Filtra apenas usuários com status ativo
                            }
                        }
                    ],
                    where: {
                        [Op.or]: [
                            { A02_NOME: { [Op.like]: `%${query}%` } }, // Filtra pelo nome do viajante
                            { '$Usuario.A01_EMAIL$': { [Op.like]: `%${query}%` } } // Filtra pelo email do usuário
                        ],
                        A01_STATUS: 'ATIVO'
                    }
                });
            } else {
                // Se não houver busca, busca todos os viajantes
                viajantes = await Viajante.findAll({
                    include: {
                        model: Usuario,
                        attributes: ['A01_EMAIL'], // Campos que você deseja obter
                        where: {
                            A01_STATUS: 'ATIVO' // Filtra apenas usuários com status ativo
                        }
                    }
                });
            }

            // Log para verificar os dados retornados
            console.log(JSON.stringify(viajantes, null, 2));

            // Formata os dados
            const viajantesFormatados = viajantes.map(viajante => ({
                ...viajante.dataValues,
                A02_DATA_NACSI: formatarData(viajante.A02_DATA_NACSI), // Converte a data para um formato legível
                A01_EMAIL: viajante.Usuario?.A01_EMAIL || 'N/A' // Inclui o email associado ou 'N/A' se não existir
            }));

            // Renderiza a view com os dados
            res.render('pages/admin/viajantes/gerenciar/index', {
                title: 'Usuários - Viajantes',
                logoPath: '/images/logo.ico',
                user: req.session.user,
                viajantes: viajantesFormatados,
                buscaRealizada,
                query // Passa informações sobre a busca para a view
            });
        } catch (error) {
            console.error('Erro ao buscar viajantes:', error);
            res.status(500).send('Erro ao buscar viajantes');
        }
    },

    banirViajante: (req, res) => {
        res.render('pages/admin/viajantes/gerenciar/banirViajante-concluido', {
            title: 'Usuários - Viajantes',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },


    aprovarViajantes: (req, res) => {
        res.render('pages/admin/viajantes/aprovar/index', {
            title: 'Usuários - Viajantes',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    concluirAprovacao: (req, res) => {
        res.render('pages/admin/viajantes/aprovar/aprovar-concluido', {
            title: 'Usuários - Viajantes',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    //DENUNCIA
    renderDenuncias: async (req, res) => {
        try {
            const query = req.query.query ? req.query.query.trim() : ''; // Termo de busca
            let denuncias = [];
            let buscaRealizada = false;

            if (query) {
                buscaRealizada = true;

                // Busca as denúncias pelo ID ou Título
                denuncias = await Denuncia.findAll({
                    include: [
                        {
                            model: Viajante,
                            as: 'Denunciado', // Defina o alias para o relacionamento 'Denunciado'
                            attributes: ['A02_NOME'], // Campos do usuário que queremos incluir
                            required: true // Inclui apenas os viajantes que têm usuários associados
                        },
                        {
                            model: Viajante,
                            as: 'Denunciante', // Defina o alias para o relacionamento 'Denunciante'
                            attributes: ['A02_NOME'], // Campos do usuário que queremos incluir
                            required: true // Inclui apenas os viajantes que têm usuários associados
                        }
                    ],
                    where: {
                        [Op.or]: [
                            { A05_ID: query },
                            { A05_TITULO: { [Op.like]: `%${query}%` } }
                        ],
                        A05_STATUS: 'PENDENTE'
                    }
                });
            } else {
                // Se não houver busca, pega todas as denúncias
                denuncias = await Denuncia.findAll({
                    include: [
                        {
                            model: Viajante,
                            as: 'Denunciado', // Defina o alias para o relacionamento 'Denunciado'
                            attributes: ['A02_NOME'], // Campos do usuário que queremos incluir
                            required: true // Inclui apenas os viajantes que têm usuários associados
                        },
                        {
                            model: Viajante,
                            as: 'Denunciante', // Defina o alias para o relacionamento 'Denunciante'
                            attributes: ['A02_NOME'], // Campos do usuário que queremos incluir
                            required: true // Inclui apenas os viajantes que têm usuários associados
                        }
                    ],
                    where: { A05_STATUS: 'PENDENTE' }
                });
            }

            // Formata as denúncias, buscando o nome do denunciado
            const denunciasFormatadas = denuncias.map(denuncia => ({
                ...denuncia.dataValues,
                A05_DATA: formatarData(denuncia.A05_DATA),
                A02_NOME_DENUNCIADO: denuncia.Denunciado?.A02_NOME || 'Nome não disponível', // Nome do denunciado
                A02_NOME_DENUNCIANTE: denuncia.Denunciante?.A02_NOME || 'Nome não disponível' // Nome do denunciante
            }));

            // Renderiza a página com os dados das denúncias
            res.render('pages/admin/viajantes/denuncias/index', {
                title: 'Usuários - Viajantes',
                logoPath: '/images/logo.ico',
                user: req.session.user,
                usuarios: denunciasFormatadas, // Passa as denúncias já com os nomes
                buscaRealizada, query
            });
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).send('Erro ao buscar usuários');
        }
    },


    denunciaIndividual: async (req, res) => {
        const viagemId = req.params.id; // Obter o ID da URL
        try {
            // Busca a viagem com base no ID
            const denuncia = await Denuncia.findOne({ where: { A05_ID: viagemId }, raw: true });

            if (!denuncia) {
                return res.status(404).send('Viagem não encontrada');
            }

            // Utiliza o A03_ORGANIZADORA da viagem para buscar a organizadora
            const denunciado = await Viajante.findOne({ where: { A02_ID: denuncia.A02_ID_DENUNCIADO }, raw: true });
            const denunciante = await Viajante.findOne({ where: { A02_ID: denuncia.A02_ID_DENUNCIANTE }, raw: true });
            const viagem = await Viagem.findOne({ where: { A03_ID: denuncia.A03_ID }, raw: true });


            // Renderiza a página com os dados
            res.render('pages/admin/viajantes/denuncias/individual', {
                title: 'Administrador - Página Inicial',
                logoPath: '/images/logo.ico',
                user: req.session.user,
                denuncia: {
                    A05_ID: denuncia.A05_ID,
                    A05_TITULO: denuncia.A05_TITULO,
                    A05_DESCRICAO: denuncia.A05_DESCRICAO,
                    A05_DATA: formatarData(denuncia.A05_DATA),
                    A02_NOME_DENUNCIADO: denunciado?.A02_NOME || 'Nome não disponível',
                    A02_ID_DENUNCIADO: denunciado?.A02_ID || 'Nome não disponível',
                    A02_ID_DENUNCIANTE: denunciante?.A02_ID|| 'Nome não disponível',
                    A02_NOME_DENUNCIANTE: denunciante?.A02_NOME || 'Nome não disponível',
                    A03_TITULO: viagem?.A03_TITULO,
                    A03_DATA_IDA: formatarData(viagem?.A03_DATA_IDA),
                    A03_DATA_VOLTA: formatarData(viagem?.A03_DATA_VOLTA)

                }
            });
        } catch (error) {
            console.error('Erro ao buscar detalhes da viagem:', error);
            res.status(500).send('Erro no servidor');
        }
    },

    cancelarDenuncia: (req, res) => {
        res.render('pages/admin/viajantes/denuncias/cancelada', {
            title: 'Administrador - Página Inicial',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    banirDenuncia: (req, res) => {
        res.render('pages/admin/viajantes/denuncias/banida', {
            title: 'Administrador - Página Inicial',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    //ADMINISTRADORES
    renderAdminUsuarios: async (req, res) => {
        try {
            let usuarios;
            let buscaRealizada = false;
            const query = req.query.query ? req.query.query.trim() : '';  // Captura o termo de busca, ou define como string vazia

            if (query) {
                buscaRealizada = true;

                // Busca pelo ID ou Email usando a query, mas somente exibe usuários com A02_PERFIL igual a 1
                usuarios = await Usuario.findAll({
                    where: {
                        [Op.or]: [
                            { A01_ID: query },
                            { A01_EMAIL: { [Op.like]: `%${query}%` } }
                        ],
                        A01_PERFIL: 1,  // Adiciona a condição de filtro para A02_PERFIL igual a 1
                        A01_STATUS: 'ATIVO'
                    }
                });
            } else {
                // Se o campo de busca estiver vazio, exibe todos os registros com A02_PERFIL igual a 1
                usuarios = await Usuario.findAll({
                    where: {
                        A01_PERFIL: 1,  // Condição para filtrar apenas usuários com A02_PERFIL igual a 1
                        A01_STATUS: 'ATIVO'
                    }
                });
            }

            const usuariosData = usuarios.map(usuario => usuario.get({ plain: true }));

            // Renderiza a página com os dados dos usuários filtrados
            res.render('pages/admin/administradores/index', {
                title: 'Usuários Administradores',
                logoPath: '/images/logo.ico',
                user: req.session.user,
                usuarios: usuariosData, // Passando os registros dos usuários para a view
                buscaRealizada, query
            });
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).send('Erro ao buscar usuários');
        }
    },


    criarAdmin: (req, res) => {
        res.render('pages/admin/administradores/criar', {
            title: 'Criar Administrador',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    criarAdminConcluido: (req, res) => {
        res.render('pages/admin/administradores/criar-concluido', {
            title: 'Criar Administrador',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    banirAdmin: (req, res) => {
        res.render('pages/admin/administradores/banidaAdmin-concluido', {
            title: 'Administrador - Página Inicial',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
}