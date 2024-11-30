const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario_01');
const Viajante = require('../models/Viajante_02');
const Viagem = require('../models/Viagem_03');

const SALT_ROUNDS = 10;
require('dotenv').config(); // Para usar variáveis de ambiente do arquivo .env
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sequelize = require('../config/bd');

// Configurar armazenamento de arquivos com multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Cria a pasta uploads se não existir
        const uploadsDir = path.join(__dirname, '../../uploads/viajantes');
        fs.mkdirSync(uploadsDir, { recursive: true });
        cb(null, uploadsDir); // Pasta onde os arquivos serão armazenados
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Nomeia o arquivo com um identificador único
    }
});
const upload = multer({ storage: storage });

module.exports = {
    cadastroViajante: async (req, res) => {
        const { nome, email, senha, confirmSenha, cpf, dataNascimento, celular, termos } = req.body;

        if (!nome || !email || !senha || !confirmSenha || !cpf || !dataNascimento || !celular || !termos) {
            return res.render('pages/cadastro/index', { error: 'Todos os campos são obrigatórios.' });
        }

        if (senha !== confirmSenha) {
            return res.render('pages/cadastro/index', { error: 'As senhas não coincidem. Tente novamente.' });
        }

        try {
            const emailExists = await Usuario.findOne({ where: { A01_EMAIL: email } });
            const cpfExists = await Viajante.findOne({ where: { A02_CPF: cpf } });

            if (emailExists || cpfExists) {
                return res.render('pages/cadastro/index', { error: 'CPF ou Email já cadastrados. Tente novamente.' });
            }

            const transaction = await sequelize.transaction();

            try {
                const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

                const usuario = await Usuario.create({
                    A01_EMAIL: email,
                    A01_SENHA: hashedPassword,
                    A01_PERFIL: 0,
                    A01_STATUS: 'ATIVO'
                }, { transaction });

                await Viajante.create({
                    A01_ID: usuario.A01_ID,
                    A02_NOME: nome,
                    A02_CPF: cpf,
                    A02_DATA_NACSI: dataNascimento,
                    A02_CELULAR: celular,
                    A01_APROVADA: 0,
                    A01_DOCUMENTACAO: 0
                }, { transaction });

                await transaction.commit();

                const transport = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },

                    tls: {
                        rejectUnauthorized: false,  // Desabilita a verificação de certificado
                    }
                });

                await transport.sendMail({
                    from: 'Peregrine<peregrine.planoviagem@gmail.com>',
                    to: email,
                    subject: 'Confirmação de cadastro',
                    html: '<h1 style="color: #99067E; text-align: center;">Bem-vinda à Peregrine!</h1><p>Olá Peregrina! Estamos muito felizes em ter você a bordo...</p>',
                    text: 'Olá, se não funcionar o HTML, envie esta mensagem.',
                });

                req.session.userId = usuario.A01_ID;
                res.redirect('/cadastro/documentacao');

            } catch (error) {
                if (!transaction.finished) await transaction.rollback();
                console.error("Erro ao gravar os dados:", error);
                res.render('pages/cadastro/index', { error: 'Erro ao cadastrar. Tente novamente mais tarde.' });
            }

        } catch (error) {
            console.log("Erro ao verificar o cadastro:", error);
            res.render('pages/cadastro/index', { error: 'Erro ao cadastrar. Tente novamente mais tarde.' });
        }
    },

    uploadDocumentos: async (req, res) => {
        try {
            // Obtenha o ID do usuário logado
            const userId = req.session.userId; // ID do usuário da sessão
            if (!userId) {
                return res.status(400).send("Usuário não está logado.");
            }

            // Busque o viajante associado ao usuário
            const viajante = await Viajante.findOne({ where: { A01_ID: userId } });
            if (!viajante) {
                return res.status(404).send("Viajante não encontrado.");
            }

            const viajanteId = viajante.A02_ID; // ID do viajante

            // Diretório principal do viajante
            const viajanteDir = path.join(__dirname, '../../uploads/viajantes/', viajanteId.toString());
            const profileDir = path.join(viajanteDir, 'perfil');
            const tripDir = path.join(viajanteDir, 'viagem');
            const docDir = path.join(viajanteDir, 'documentacao');

            // Criar as pastas necessárias
            fs.mkdir(viajanteDir, { recursive: true }, (err) => {
                if (err) {
                    console.log("Erro ao criar diretório principal:", err);
                    return res.status(500).send("Erro ao criar diretório principal.");
                }

                // Criar subpastas
                fs.mkdir(profileDir, { recursive: true }, (err) => {
                    if (err) console.log("Erro ao criar pasta 'perfil':", err);
                });
                fs.mkdir(tripDir, { recursive: true }, (err) => {
                    if (err) console.log("Erro ao criar pasta 'viagem':", err);
                });
                fs.mkdir(docDir, { recursive: true }, (err) => {
                    if (err) {
                        console.log("Erro ao criar pasta 'documentacao':", err);
                        return res.status(500).send("Erro ao criar pasta 'documentacao'.");
                    }

                    // Continuar com o upload dentro de 'documentacao'
                    upload.fields([{ name: 'frenteDoc', maxCount: 1 }, { name: 'versoDoc', maxCount: 1 }, { name: 'selfieDoc', maxCount: 1 }])(req, res, (err) => {
                        if (err) {
                            console.log("Erro no upload:", err);
                            return res.status(500).send("Erro ao fazer upload.");
                        }

                        const frontDoc = req.files['frenteDoc'] ? req.files['frenteDoc'][0] : null;
                        const backDoc = req.files['versoDoc'] ? req.files['versoDoc'][0] : null;
                        const selfieDoc = req.files['selfieDoc'] ? req.files['selfieDoc'][0] : null;

                        if (!frontDoc || !backDoc || !selfieDoc) {
                            return res.status(400).send("Documentos não enviados.");
                        }

                        // Renomear e mover os arquivos para a pasta 'documentacao'
                        const frontDocPath = path.join(docDir, `frontDoc_${viajanteId}${path.extname(frontDoc.originalname)}`);
                        const backDocPath = path.join(docDir, `backDoc_${viajanteId}${path.extname(backDoc.originalname)}`);
                        const selfieDocPath = path.join(docDir, `selfie_${viajanteId}${path.extname(selfieDoc.originalname)}`);

                        fs.rename(frontDoc.path, frontDocPath, (err) => {
                            if (err) {
                                console.log("Erro ao mover o documento da frente:", err);
                                return res.status(500).send("Erro ao mover o documento da frente.");
                            }

                            fs.rename(backDoc.path, backDocPath, (err) => {
                                if (err) {
                                    console.log("Erro ao mover o documento do verso:", err);
                                    return res.status(500).send("Erro ao mover o documento do verso.");
                                }

                                fs.rename(selfieDoc.path, selfieDocPath, async (err) => {
                                    if (err) {
                                        console.log("Erro ao mover o documento de selfie:", err);
                                        return res.status(500).send("Erro ao mover o documento de selfie.");
                                    }

                                    try {
                                        // Atualiza o campo A02_DOCUMENTACAO_ENVIADA no banco de dados
                                        await Viajante.update(
                                            { A02_DOCUMENTACAO: true },
                                            { where: { A02_ID: viajanteId } }
                                        );

                                        console.log("Documentação enviada e banco de dados atualizado com sucesso!");
                                        res.redirect('/cadastro/documentacao/concluido');
                                    } catch (dbError) {
                                        console.log("Erro ao atualizar o banco de dados:", dbError);
                                        return res.status(500).send("Erro ao atualizar o banco de dados.");
                                    }
                                });
                            });
                        });
                    });
                });
            });
        } catch (err) {
            console.log("Erro no processo:", err);
            res.status(500).send("Erro no processamento do upload.");
        }
    },
    editarPerfil: async (req, res) => {
        const { apelido, celular, descricao } = req.body;
        const viajante = req.session.user.viajanteId;

        try {
            // Objeto de atualização dinâmico
            const updates = {};
            if (apelido) updates.A02_APELIDO = apelido;
            if (celular) updates.A02_CELULAR = celular;
            if (descricao) updates.A02_DESCRICAO = descricao;

            // Verifica se há um arquivo para upload
            if (req.file) {
                console.log(`Foto do perfil atualizada para o usuário ${viajante}`);
            }

            if (Object.keys(updates).length > 0) {
                await Viajante.update(updates, { where: { A02_ID: viajante } });
            }

            res.redirect('/perfil');
        } catch (error) {
            console.error("Erro ao editar perfil:", error);
            res.redirect('/perfil/editar-perfil');
        }
    },
    atualizarSenhaPerfil: async (req, res) => {
        const { novaSenha, confirmarSenha } = req.body;

        // Recupera o ID do usuário da sessão
        const usuarioId = req.session.user?.id; // Garante que o ID está acessando o campo correto

        if (!usuarioId) {
            return res.redirect('/login'); // Redireciona para o login se o usuário não estiver autenticado
        }

        // Verifica se os campos de senha foram preenchidos
        if (!novaSenha || !confirmarSenha) {
            return res.render('pages/viajante/perfilUsuarioAlterarSenha', {
                senhaError: 'Preencha todos os campos.',
                user: req.session.user
            });
        }

        // Verifica se as senhas coincidem
        if (novaSenha !== confirmarSenha) {
            return res.render('pages/viajante/perfilUsuarioAlterarSenha', {
                senhaError: 'As senhas não coincidem.',
                user: req.session.user
            });
        }

        try {
            // Criptografa a nova senha
            const hashedPassword = await bcrypt.hash(novaSenha, SALT_ROUNDS);

            // Atualiza a senha no banco de dados
            await Usuario.update(
                { A01_SENHA: hashedPassword },
                { where: { A01_ID: usuarioId } } // Garante que está utilizando o campo correto no banco
            );

            // Renderiza a página de perfil com a mensagem de sucesso
            return res.render('pages/viajante/perfil', {
                senhaSuccess: 'Senha atualizada com sucesso!',
                user: req.session.user
            });
        } catch (error) {
            console.error('Erro ao atualizar a senha:', error);

            // Renderiza a página de alterar senha com a mensagem de erro
            return res.render('pages/viajante/perfilUsuarioAlterarSenha', {
                senhaError: 'Erro ao atualizar a senha. Tente novamente.',
                user: req.session.user
            });
        }
    },

    atualizarEmail: async (req, res) => {
        const { novoEmail } = req.body;

        // Recupera o ID do usuário da sessão
        const usuarioId = req.session.user?.id;

        if (!usuarioId) {
            return res.redirect('/login'); // Redireciona para o login se o usuário não estiver autenticado
        }

        // Verifica se o e-mail foi fornecido
        if (!novoEmail) {
            return res.render('pages/viajante/perfilUsuarioAlterarEmail', {
                emailError: 'Por favor, informe o novo e-mail.',
                user: req.session.user
            });
        }

        try {
            // Verifica se o novo e-mail já está cadastrado
            const emailExistente = await Usuario.findOne({ where: { A01_EMAIL: novoEmail } });
            if (emailExistente) {
                return res.render('pages/viajante/perfilUsuarioAlterarEmail', {
                    emailError: 'Este e-mail já está em uso.',
                    user: req.session.user
                });
            }

            // Atualiza o e-mail no banco de dados
            await Usuario.update(
                { A01_EMAIL: novoEmail },
                { where: { A01_ID: usuarioId } }
            );

            // Atualiza o e-mail na sessão do usuário
            req.session.user.email = novoEmail;

            // Renderiza a página de perfil com a mensagem de sucesso
            return res.render('pages/viajante/perfil', {
                emailSuccess: 'E-mail atualizado com sucesso!',
                user: req.session.user
            });
        } catch (error) {
            console.error('Erro ao atualizar o e-mail:', error);

            // Renderiza a página de alterar e-mail com a mensagem de erro
            return res.render('pages/viajante/perfilUsuarioAlterarEmail', {
                emailError: 'Erro ao atualizar o e-mail. Tente novamente.',
                user: req.session.user
            });
        }
    },
    deleteViajante: async (req, res) => {
        console.log('Sessão atual:', req.session);

        // Obtém o ID do usuário logado a partir da sessão
        const userId = req.session?.user?.id;

        if (!userId) {
            console.error('ID do usuário não encontrado na sessão.');
            return res.status(400).send('Erro: usuário não identificado.');
        }

        try {
            // Buscar o viajante relacionado ao usuário
            const viajante = await Viajante.findOne({
                where: { A01_ID: userId }, // O campo correto é A01_ID
                include: { model: Usuario, attributes: ['A01_ID'] },
            });

            if (!viajante) {
                console.error('Viajante não encontrado para o ID do usuário:', userId);
                return res.status(404).send('Viajante não encontrado.');
            }

            const viajanteId = viajante.A02_ID;

            // mudando status da conta para INATIVO
            await Usuario.update(
                { A01_STATUS: 'INATIVO' },
                { where: { A01_ID: userId } }
            );
            // Destruir a sessão do usuário
            req.session.destroy((err) => {
                if (err) {
                    console.error('Erro ao destruir a sessão:', err);
                    return res.status(500).send('Erro ao deslogar o usuário.');
                }
                res.redirect('/');
            });
        } catch (error) {
            console.error('Erro ao excluir viajante ou usuário:', error);
            res.status(500).send('Erro no servidor.');
        }
    },
    updateAvaliacao: async (req, res) => {
        const avaliadorId = req.session?.user?.id;
        const { organizadoraId, nota } = req.body;

        try {
            // Validação da nota
            if (nota < 1 || nota > 5) {
                return res.status(400).json({ error: 'Nota inválida. Deve estar entre 1 e 5.' });
            }

            // Verifica se o avaliado existe
            const avaliado = await Viajante.findOne({ where: { A02_ID: organizadoraId } });
            if (!avaliado) {
                return res.status(404).json({ error: 'Viajante avaliado não encontrado.' });
            }

            // Verifica se o avaliador existe
            const avaliador = await Viajante.findOne({ where: { A02_ID: avaliadorId } });
            if (!avaliador) {
                return res.status(404).json({ error: 'Viajante avaliador não encontrado.' });
            }

            // Busca avaliação existente
            const avaliacaoExistente = await Avaliacao.findOne({
                where: { A02_ID: organizadoraId, Avaliador_ID: avaliadorId }
            });

            if (avaliacaoExistente) {
                // Atualiza a nota existente
                avaliacaoExistente.A06_NOTA = nota;
                await avaliacaoExistente.save();
            } else {
                // Cria nova avaliação
                await Avaliacao.create({
                    A02_ID: organizadoraId,
                    Avaliador_ID: avaliadorId,
                    A06_NOTA: nota
                });
            }

            // Recalcula a média
            const avaliacoes = await Avaliacao.findAll({
                where: { A02_ID: organizadoraId },
                attributes: [[sequelize.fn('AVG', sequelize.col('A06_NOTA')), 'media']],
                raw: true
            });

            const novaNotaMedia = parseFloat(avaliacoes[0].media) || 0;

            // Atualiza o viajante avaliado
            await avaliado.update({
                A02_NOTA: novaNotaMedia
            });

            res.status(200).json({ message: 'Avaliação registrada com sucesso!' });
        } catch (error) {
            console.error('Erro ao atualizar a avaliação:', error);
            res.status(500).json({ error: 'Erro ao registrar a avaliação. Tente novamente mais tarde.' });
        }
    },

    alterarViagem: async (req, res) => {
        const {
            linkgrupo,
            descricaoViagem,
            tituloViagem,
            subtituloViagem,
            origemViagem,
            destinoViagem,
            vagasViagem,
            custoViagem,
            localIdaViagem,
            dataIdaViagem,
            horaIdaViagem,
            localVoltaViagem,
            dataVoltaViagem,
            horaVoltaViagem
        } = req.body;

        // Valida o ID da viagem
        const viagemId = parseInt(req.params.id, 10); // Converte para número
        console.log('Viagem ID:', viagemId);

        if (!viagemId || isNaN(viagemId)) {
            console.error('Erro: ID inválido.');
            return res.status(400).send('ID da viagem inválido.');
        }

        try {
            // Monta o objeto de atualização
            const updates = {};
            if (linkgrupo) updates.A03_LINK = linkgrupo;
            if (descricaoViagem) updates.A03_DESCRICAO = descricaoViagem;
            if (tituloViagem) updates.A03_TITULO = tituloViagem;
            if (subtituloViagem) updates.A03_SUBTITULO = subtituloViagem;
            if (origemViagem) updates.A03_ORIGEM = origemViagem;
            if (destinoViagem) updates.A03_DESTINO = destinoViagem;
            if (vagasViagem) updates.A03_VAGAS = parseInt(vagasViagem, 10);
            if (custoViagem) updates.A03_CUSTO = parseFloat(custoViagem);
            if (localIdaViagem) updates.A03_LOCAL_IDA = localIdaViagem;
            if (dataIdaViagem) updates.A03_DATA_IDA = dataIdaViagem;
            if (horaIdaViagem) updates.A03_HORA_IDA = horaIdaViagem;
            if (localVoltaViagem) updates.A03_LOCAL_VOLTA = localVoltaViagem;
            if (dataVoltaViagem) updates.A03_DATA_VOLTA = dataVoltaViagem;
            if (horaVoltaViagem) updates.A03_HORA_VOLTA = horaVoltaViagem;

            console.log('Updates:', updates);

            // Executa a atualização se houver algo a atualizar
            if (Object.keys(updates).length > 0) {
                await Viagem.update(updates, { where: { A03_ID: viagemId } });
            }

            res.redirect('/viagem/alteracao-concluida');
        } catch (error) {
            console.error('Erro ao alterar viagem:', error);
            res.redirect('/perfil/minhas-viagens-criadas');
        }
    },
    deleteViagem: async (req, res) => {
        const viagemId = parseInt(req.params.id, 10); // Converte para número

        try {
            // Busca a viagem pelo ID
            const viagem = await Viagem.findOne({ where: { A03_ID: viagemId } });
            if (!viagem) {
                return res.status(404).send('Viagem não encontrada');
            }

            // Remove a viagem
            const result = await Viagem.destroy({ where: { A03_ID: viagemId } });
            res.redirect('/viagem/exclusao-concluida'); // Redireciona após a exclusão
        } catch (error) {
            console.error('Erro ao deletar viagem:', error);
        }
    },
    toggleViagemStatus: async (req, res) => {
        const { id } = req.params;
        const { novoStatus } = req.body;

        try {
            const viagem = await Viagem.findByPk(id);

            if (!viagem) {
                return res.status(404).json({ error: "Viagem não encontrada." });
            }

            // Atualiza o status da viagem
            viagem.A03_STATUS = novoStatus;
            await viagem.save();

            res.json({ message: "Status atualizado com sucesso!", novoStatus });
        } catch (error) {
            console.error("Erro ao atualizar status da viagem:", error);
            res.status(500).json({ error: "Erro ao atualizar status da viagem." });
        }
    }

}