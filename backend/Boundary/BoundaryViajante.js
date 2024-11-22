const Viajante = require('../models/Viajante_02');
const Viagem = require('../models/Viagem_03');
const Usuario = require('../models/Usuario_01');
const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

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
    renderPesquisaViagemResultados: async (req, res) => {
        try {
            // Busca todas as viagens cadastradas com status "Planejada"
            const viagens = await Viagem.findAll({
                where: {
                    A03_STATUS: 'Planejada'
                }
            });

            // Formata os dados das viagens
            const viagensFormatadas = viagens.map(viagem => ({
                id: viagem.A03_ID,
                A03_TITULO: viagem.A03_TITULO || 'Título não informado',
                A03_DESTINO: viagem.A03_DESTINO || 'Destino não informado',
                A03_ORIGEM: viagem.A03_ORIGEM || 'Origem não informada',
                A03_VAGAS: viagem.A03_VAGAS || 0,
                A03_DATA_IDA: formatarData(viagem.A03_DATA_IDA),
                A03_DATA_VOLTA: formatarData(viagem.A03_DATA_VOLTA),
                A03_CUSTO: formatarMoeda(viagem.A03_CUSTO)
            }));

            // Renderiza a view com os dados
            res.render('pages/pesquisa-viagem/pesquisaViagemResultados', {
                title: 'Resultados da pesquisa de viagem',
                logoPath: '/images/logo.ico',
                user: req.session.user,
                viagens: viagensFormatadas // Passa os dados das viagens para a view
            });
        } catch (error) {
            console.error('Erro ao buscar viagens:', error);
            res.status(500).send('Erro ao buscar viagens');
        }
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
        console.log('Estado da sessão:', req.session.user);
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
    renderViagemDetalhes: async (req, res) => {
        const viagemId = req.params.id; // Obter o ID da URL
        try {
            // Busca a viagem com base no ID
            const viagem = await Viagem.findOne({ where: { A03_ID: viagemId }, raw: true });
    
            if (!viagem) {
                return res.status(404).send('Viagem não encontrada');
            }
    
            // Utiliza o A03_ORGANIZADORA da viagem para buscar a organizadora
            const organizadora = await Viajante.findOne({ where: { A02_ID: viagem.A02_ID_ORGANIZADORA }, raw: true });
    
            // Renderiza a página com os dados
            res.render('pages/pesquisa-viagem/pesquisaViagemDetalhes', {
                title: 'Detalhes da viagem',
                logoPath: '/images/logo.ico',
                user: req.session.user,
                viagem: {
                    A03_TITULO: viagem.A03_TITULO,
                    A03_SUBTITULO: viagem.A03_SUBTITULO,
                    A03_DESCRICAO: viagem.A03_DESCRICAO,
                    A03_ORIGEM: viagem.A03_ORIGEM,
                    A03_DESTINO: viagem.A03_DESTINO,
                    A03_LOCAL_IDA: viagem.A03_LOCAL_IDA,
                    A03_DATA_IDA: formatarData(viagem.A03_DATA_IDA),
                    A03_HORA_IDA: viagem.A03_HORA_IDA,
                    A03_LOCAL_VOLTA: viagem.A03_LOCAL_VOLTA,
                    A03_DATA_VOLTA: formatarData(viagem.A03_DATA_VOLTA),
                    A03_HORA_VOLTA: viagem.A03_HORA_VOLTA,
                    A03_CUSTO: formatarMoeda(viagem.A03_CUSTO),
                    A03_LINK: viagem.A03_LINK,
                    A03_VAGAS: viagem.A03_VAGAS,
                    A03_ORGANIZADORA: viagem.A02_ID_ORGANIZADORA,
                    A02_NOME: organizadora?.A02_NOME || 'Nome não disponível',
                    A02_DESCRICAO: organizadora?.A02_DESCRICAO || 'Descrição não disponível'
                }
            });
        } catch (error) {
            console.error('Erro ao buscar detalhes da viagem:', error);
            res.status(500).send('Erro no servidor');
        }
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
    },
    renderAlterarViagem: (req, res) => {
        res.render('pages/viajante/alterarViagem', {
            title: 'Alterar viagem',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    }
    
}