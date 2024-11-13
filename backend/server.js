// Importações de pacotes
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

// Inicialização da aplicação
const app = express();
const exphbs = require("express-handlebars").engine;

// Configurações de Rotas
const indexRoutes = require("./Routes/Routes");              // Rotas das views
const indexController = require("./Routes/RoutesController"); // Rotas para as funções

// Configuração da sessão
app.use(session({
    secret: 'seuSegredoAqui', // Troque por uma chave secreta adequada
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Setar como false para ambiente de desenvolvimento
}));

// Configuração para parsing do corpo da requisição
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração do Handlebars como engine de template
app.engine("handlebars", exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    extname: ".handlebars"
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Definição das rotas
app.use("/", indexRoutes);            // Rotas das views principais
app.use("/control", indexController); // Rotas de controle para funções

// Inicialização do servidor
const PORT = 8021;
app.listen(PORT, () => {
    console.log(`Servidor ativo na porta ${PORT}!`);
});
