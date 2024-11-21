const Viajante = require('../models/Viajante_02'); // Ajuste o caminho conforme necessário

module.exports = {
    renderPerfil: async (req, res) => {
        try {
            const userId = req.session.user?.id;
    
            if (!userId) {
                return res.redirect('/login'); // Redireciona para o login se o usuário não estiver logado
            }
    
            // Busca os dados da viajante
            const viajante = await Viajante.findOne({
                where: { A01_ID: userId }
            });
    
            if (!viajante) {
                return res.redirect('/cadastrar'); // Caso não exista viajante, redireciona para cadastro
            }
    
            res.render('pages/viajante/perfil', {
                title: 'Perfil',
                logoPath: '/images/logo.ico',
                user: {
                    nome: viajante.A02_NOME,
                    apelido: viajante.A02_APELIDO,
                    celular: viajante.A02_CELULAR,
                    descricao: viajante.A02_DESCRICAO || 'Nenhuma descrção adicionada',
                    nota: viajante.A02_NOTA || 'N/A',
                    aprovacao: viajante.A02_APROVADA,
                }
            });
        } catch (error) {
            console.error('Erro ao renderizar perfil:', error);
            res.status(500).send('Erro ao carregar a página de perfil.');
        }
    },
    renderPesquisaViagem: (req, res) => {
        res.render('pages/pesquisa-viagem/pesquisaViagem', {
            title: 'Pesquisa de viagem',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderPesquisaViagemResultados: (req, res) => {
        res.render('pages/pesquisa-viagem/pesquisaViagemResultados', {
            title: 'Resultados da pesquisa de viagem',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderMinhasViagens: (req, res) => {
        res.render('pages/viajante/minhasViagens', {
            title: 'Minhas viagens',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderUsuarioAlterarEmail: (req, res) => {
        res.render('pages/viajante/perfilUsuarioAlterarEmail', {
            title: 'Perfil - Alterar email',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderUsuarioAlterarSenha: (req, res) => {
        res.render('pages/viajante/perfilUsuarioAlterarSenha', {
            title: 'Perfil - Alterar senha',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderUsuarioEditar: (req, res) => {
        res.render('pages/viajante/perfilUsuarioEditar', {
            title: 'Editar perfil',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderUsuarioExcluir: (req, res) => {
        res.render('pages/viajante/perfilUsuarioExcluir', {
            title: 'Excluir perfil',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderInscricaoConcluida: (req, res) => {
        res.render('pages/pesquisa-viagem/pesquisaInscricaoConcluida', {
            title: 'Inscrição concluída',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderViagemDetalhes: (req, res) => {
        res.render('pages/pesquisa-viagem/pesquisaViagemDetalhes', {
            title: 'Detalhes da viagem',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderPlanejarViagem: (req, res) => {
        res.render('pages/planejar-viagem/planejarViagem', {
            title: 'Planejar viagem',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderPlanejamentoConcluido: (req, res) => {
        res.render('pages/planejar-viagem/planejarViagemConcluido', {
            title: 'Viagem criada',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    }
    
}