const { Op } = require('sequelize');  // Importa o operador `Op` do Sequelize
const Usuario = require('../models/Usuario_01'); // Ajuste o caminho conforme necessário
const Viajante = require('../models/Viajante_02'); // Ajuste o caminho conforme necessário
const formatarData = (data) => {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
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
                            required: true // Inclui apenas os viajantes que têm usuários associados
                        }
                    ],
                    where: {
                        [Op.or]: [
                            { A02_NOME: { [Op.like]: `%${query}%` } }, // Filtra pelo nome do viajante
                            { '$Usuario.A01_EMAIL$': { [Op.like]: `%${query}%` } } // Filtra pelo email do usuário
                        ]
                    }
                });
            } else {
                // Se não houver busca, busca todos os viajantes
                viajantes = await Viajante.findAll({
                    include: {
                        model: Usuario,
                        attributes: ['A01_EMAIL'] // Campos que você deseja obter
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
    renderDenuncias: (req, res) => {
        res.render('pages/admin/viajantes/denuncias/index', {
            title: 'Usuários - Viajantes',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    denunciaIndividual: (req, res) => {
        res.render('pages/admin/viajantes/denuncias/individual', {
            title: 'Administrador - Página Inicial',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
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
                        A01_PERFIL: 1  // Adiciona a condição de filtro para A02_PERFIL igual a 1
                    }
                });
            } else {
                // Se o campo de busca estiver vazio, exibe todos os registros com A02_PERFIL igual a 1
                usuarios = await Usuario.findAll({
                    where: {
                        A01_PERFIL: 1  // Condição para filtrar apenas usuários com A02_PERFIL igual a 1
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