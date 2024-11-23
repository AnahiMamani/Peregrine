const { Op } = require('sequelize');  // Importa o operador `Op` do Sequelize
const Viajante = require('../models/Viajante_02');
const Viagem = require('../models/Viagem_03');
const ViagemViajante = require('../models/ViajanteViagem_04');
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
    renderPesquisaViagemResultados: async (req, res) => {
        try {
            let viagens;
            let buscaRealizada = false;
            const query = req.query.query ? req.query.query.trim() : '';  // Captura o termo de busca, ou define como string vazia
            if (query) {
                buscaRealizada = true;

                viagens = await Viagem.findAll({
                    where: {
                        [Op.or]:[
                            { A03_TITULO: { [Op.like]: `%${query}%` } }, // Busca no título
                            { A03_ORIGEM: { [Op.like]: `%${query}%` } }, // Busca na origem
                            { A03_DESTINO: { [Op.like]: `%${query}%` } } // Busca no destino
                        ],
                        A03_STATUS: 'ATIVADA'
                    }
                });
                } else {
                // Busca todas as viagens cadastradas com status "Planejada"
                viagens = await Viagem.findAll({
                    where: {
                        A03_STATUS: 'ATIVADA'
                    }
                });
            }

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
                viagens: viagensFormatadas, // Passa os dados das viagens para a view
                buscaRealizada, query
            });
        } catch (error) {
            console.error('Erro ao buscar viagens:', error);
            res.status(500).send('Erro ao buscar viagens');
        }
    },
    renderViagensConcluidas: async (req, res) => {
        try {
            const userId = req.session.user?.id;

            if (!userId) {
                return res.redirect('/login'); // Redireciona para o login se o usuário não estiver logado
            }

            // Passo 1: Busca os dados do viajante
            const viajante = await Viajante.findOne({
                where: { A01_ID: userId }
            });

            if (!viajante) {
                return res.redirect('/login'); // Redireciona se o viajante não for encontrado
            }

            // Passo 2: Busca na tabela intermediária (ViagemViajante) os registros do usuário com status 'em_andamento'
            const viagensRelacionadas = await ViagemViajante.findAll({
                where: {
                    A02_ID: viajante.A02_ID,
                },
                attributes: ['A03_ID'],
                raw: true,
            });

            // Verifica se há viagens relacionadas
            if (!viagensRelacionadas.length) {
                return res.render('pages/viajante/minhasViagensConcluidas', {
                    title: 'Minhas viagens - concluídas',
                    logoPath: '/images/logo.ico',
                    user: req.session.user,
                    viagensInscritas: [], // Nenhuma viagem encontrada
                });
            }

            // Passo 3: Extrai os IDs das viagens relacionadas
            const viagemIds = viagensRelacionadas.map(vr => vr.A03_ID);

            // Passo 4: Busca os títulos das viagens com o status 'em_andamento' diretamente
            const viagens = await Viagem.findAll({
                where: {
                    A03_ID: viagemIds,
                    A03_STATUS: 'CONCLUIDA' // Adiciona a condição de status na consulta
                },
                attributes: ['A03_ID', 'A03_TITULO'],
                raw: true,
            });

            // Passo 5: Mapeia os dados das viagens para serem usados na view
            const viagensInscritas = viagens.map(viagem => ({
                id: viagem.A03_ID,
                titulo: viagem.A03_TITULO,
            }));

            // Renderiza a view com as viagens em andamento
            res.render('pages/viajante/minhasViagensConcluidas', {
                title: 'Minhas viagens - concluídas',
                logoPath: '/images/logo.ico',
                user: req.session.user,
                viagensInscritas, // Passa as viagens para a view
            });
        } catch (error) {
            console.error('Erro ao buscar viagens:', error);
            res.status(500).send('Erro ao buscar viagens');
        }
    },
    renderViagensCriadas: async (req, res) => {
        try {
            const userId = req.session.user?.id;

            if (!userId) {
                return res.redirect('/login'); // Redireciona para o login se o usuário não estiver logado
            }

            // Passo 1: Busca os dados do viajante
            const viajante = await Viajante.findOne({
                where: { A01_ID: userId }
            });

            if (!viajante) {
                return res.redirect('/login'); // Redireciona se o viajante não for encontrado
            }

            // Passo 2: Busca na tabela intermediária (ViagemViajante) os registros do usuário com status 'em_andamento'
            const viagensRelacionadas = await Viagem.findAll({
                where: {
                    A02_ID_ORGANIZADORA: viajante.A02_ID,
                },
                attributes: ['A03_ID'],
                raw: true,
            });

            // Verifica se há viagens relacionadas
            if (!viagensRelacionadas.length) {
                return res.render('pages/viajante/minhasViagensCriadas', {
                    title: 'Minhas Viagens',
                    logoPath: '/images/logo.ico',
                    user: req.session.user,
                    viagensInscritas: [], // Nenhuma viagem encontrada
                });
            }

            // Passo 3: Extrai os IDs das viagens relacionadas
            const viagemIds = viagensRelacionadas.map(vr => vr.A03_ID);

            // Passo 4: Busca os títulos das viagens com o status 'em_andamento' diretamente
            const viagens = await Viagem.findAll({
                where: {
                    A03_ID: viagemIds,
                    A02_ID_ORGANIZADORA: viajante.A02_ID // Adiciona a condição de status na consulta
                },
                attributes: ['A03_ID', 'A03_TITULO'],
                raw: true,
            });

            // Passo 5: Mapeia os dados das viagens para serem usados na view
            const viagensInscritas = viagens.map(viagem => ({
                id: viagem.A03_ID,
                titulo: viagem.A03_TITULO,
            }));

            // Renderiza a view com as viagens em andamento
            res.render('pages/viajante/minhasViagensCriadas', {
                title: 'Minhas Viagens',
                logoPath: '/images/logo.ico',
                user: req.session.user,
                viagensInscritas, // Passa as viagens para a view
            });
        } catch (error) {
            console.error('Erro ao buscar viagens:', error);
            res.status(500).send('Erro ao buscar viagens');
        }
    },
    renderViagensInscritas: async (req, res) => {
        try {
            const userId = req.session.user?.id;

            if (!userId) {
                return res.redirect('/login'); // Redireciona para o login se o usuário não estiver logado
            }

            // Passo 1: Busca os dados do viajante
            const viajante = await Viajante.findOne({
                where: { A01_ID: userId }
            });

            if (!viajante) {
                return res.redirect('/login'); // Redireciona se o viajante não for encontrado
            }

            // Passo 2: Busca na tabela intermediária (ViagemViajante) os registros do usuário com status 'em_andamento'
            const viagensRelacionadas = await ViagemViajante.findAll({
                where: {
                    A02_ID: viajante.A02_ID,
                },
                attributes: ['A03_ID'],
                raw: true,
            });

            // Verifica se há viagens relacionadas
            if (!viagensRelacionadas.length) {
                return res.render('pages/viajante/minhasViagensInscritas', {
                    title: 'Minhas Viagens em Andamento',
                    logoPath: '/images/logo.ico',
                    user: req.session.user,
                    viagensInscritas: [], // Nenhuma viagem encontrada
                });
            }

            // Passo 3: Extrai os IDs das viagens relacionadas
            const viagemIds = viagensRelacionadas.map(vr => vr.A03_ID);

            // Passo 4: Busca os títulos das viagens com o status 'em_andamento' diretamente
            const viagens = await Viagem.findAll({
                where: {
                    A03_ID: viagemIds,
                    A03_STATUS: 'ATIVADA' // Adiciona a condição de status na consulta
                },
                attributes: ['A03_ID', 'A03_TITULO'],
                raw: true,
            });

            // Passo 5: Mapeia os dados das viagens para serem usados na view
            const viagensInscritas = viagens.map(viagem => ({
                id: viagem.A03_ID,
                titulo: viagem.A03_TITULO,
            }));

            // Renderiza a view com as viagens em andamento
            res.render('pages/viajante/minhasViagensInscritas', {
                title: 'Minhas Viagens em Andamento',
                logoPath: '/images/logo.ico',
                user: req.session.user,
                viagensInscritas, // Passa as viagens para a view
            });
        } catch (error) {
            console.error('Erro ao buscar viagens:', error);
            res.status(500).send('Erro ao buscar viagens');
        }
    },
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
    renderSelecaoConcluidas: async (req, res) => {
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
            res.render('pages/viajante/minhasViagensConcluidasSelecao', {
                title: 'Perfil - Viagem Concluidas',
                logoPath: '/images/logo.ico',
                user: req.session.user,
                viagem: {
                    A03_ID: viagem.A03_ID,
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
                    A02_DESCRICAO: organizadora?.A02_DESCRICAO || 'Descrição não disponível',
                    A02_NOTA: organizadora?.A02_NOTA || 'N/A',
                    A02_APELIDO: organizadora?.A02_APELIDO
                }
            });
        } catch (error) {
            console.error('Erro ao buscar detalhes da viagem:', error);
            res.status(500).send('Erro no servidor');
        }
    },
    renderPesquisaViagem: (req, res) => {
        res.render('pages/pesquisa-viagem/pesquisaViagem', {
            title: 'Pesquisa de viagem',
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
    renderInscricaoConcluida: async (req, res) => {
        try {
            // Busca a primeira viagem com status "Planejada"
            const viagem = await Viagem.findOne({
                where: {
                    A03_STATUS: 'Planejada'
                }
            });

            // Renderiza a view com os dados
            res.render('pages/pesquisa-viagem/pesquisaInscricaoConcluida', {
                title: 'Inscrição concluída',
                logoPath: '/images/logo.ico',
                user: req.session.user,
                linkGrupo: viagem ? viagem.A03_LINK : null // Envia apenas o link do grupo
            });
        } catch (error) {
            console.error('Erro ao buscar viagem:', error);
            res.status(500).send('Erro ao buscar viagem');
        }
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
                    A03_ID: viagem.A03_ID,
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
                    A02_DESCRICAO: organizadora?.A02_DESCRICAO || 'Descrição não disponível',
                    A02_NOTA: organizadora?.A02_NOTA || 'N/A',
                    A02_APELIDO: organizadora?.A02_APELIDO
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
    },
    renderExcluirViagemConcluido: (req, res) => {
        res.render('pages/viajante/excluirViagemConcluido', {
            title: 'Viagem excluída',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderAlterarViagemConcluido: (req, res) => {
        res.render('pages/viajante/alterarViagemConcluido', {
            title: 'Viagem alterada',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderAvaliacao: async (req, res) => {
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
            res.render('pages/viajante/Denúncias/avaliacaoViagem', {
                title: 'Avaliação',
                logoPath: '/images/logo.ico',
                user: req.session.user,
                viagem: {
                    A03_ORGANIZADORA: viagem.A02_ID_ORGANIZADORA,
                    A02_NOME: organizadora?.A02_NOME || 'Nome não disponível',
                }
            });
        } catch (error) {
            console.error('Erro ao buscar detalhes da oraganizadora:', error);
            res.status(500).send('Erro no servidor');
        }
    },
    renderDenuncia: (req, res) => {
        res.render('pages/viajante/Denúncias/denunciaViagem', {
            title: 'Denúncia',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderDenunciaConcluida: (req, res) => {
        res.render('pages/viajante/Denúncias/denunciaConcluida', {
            title: 'Denúncia concluída',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderAvaliacaoConcluida: (req, res) => {
        res.render('pages/viajante/Denúncias/avaliacaoViagemConcluida', {
            title: 'Denúncia concluída',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },
    renderAnuncio: (req, res) => {
        res.render('pages/viajante/anuncioViagem', {
            title: 'Pausar anúncio da viagem',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },


}