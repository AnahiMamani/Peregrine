const express = require("express")
const app = express()
const exphbs  = require("express-handlebars").engine
const bodyParser = require("body-parser") 
const indexRoutes = require("./routes/indexRoutes"); // Importando as rotas

// Middleware para parsing do corpo da requisição
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Configuração do Handlebars como engine de template
app.engine("handlebars", exphbs ({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.set("views", __dirname + "/views");

// ** Configuração para servir arquivos estáticos **
app.use(express.static('../frontend'))

// Configuração das rotas
app.use("/", indexRoutes);

// Inicialização do servidor na porta 8021
app.listen(8021, function () {
    console.log("Servidor ativo na porta 8021!");
});

// Verificação da atividade do banco de dados
app.indexRoutes("/cadastro", function(req,res) {
    indexRoutes.create({
        nome: req.body.nome
    }).then(function(){
        console.log("Dados cadastrados com sucesso!")
        res.send("Dados cadastrados com sucesso!")
    }).catch(function(){
        console.log("Erro ao gravar os dados na entidade")
    })
})
