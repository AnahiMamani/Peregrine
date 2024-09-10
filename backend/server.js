const express = require("express")
const app = express()
//const path = require("path"); // Importa o módulo path para trabalhar com caminhos de arquivos
const exphbs  = require("express-handlebars").engine
const bodyParser = require("body-parser") //Middleware para parsing de dados do corpo da requisição (faz a ponte entre o backend e o front end)
const indexRoutes = require("./routes/indexRoutes"); // Importando as rotas

// Middleware para parsing do corpo da requisição
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Configuração do Handlebars como engine de template
app.engine("handlebars", exphbs ({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.set("views", __dirname + "/views");

app.use(express.static('../frontend'))

// ** Configuração para servir arquivos estáticos **
// app.use(express.static(path.join(__dirname, "../frontend/public"))); // Servindo arquivos da pasta public
// app.use('/scripts', express.static(path.join(__dirname, '../frontend/scripts'))); // Servindo scripts da pasta scripts

// Configuração das rotas
app.use("/", indexRoutes);

// Inicialização do servidor na porta 8021
app.listen(8021, function () {
    console.log("Servidor ativo na porta 8021!");
});