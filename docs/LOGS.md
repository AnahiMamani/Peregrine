# LOGS
## ERROS
eu
## DUVIDAS
### SCRIPT E ARQUIVOS CSS SERAO INJETADAS DIRETAMENTE NA MAIN.HANDLEBARS?
Minha pagina tendo mais de 5 telas fica o meu questinamento sobre o carregamento da tela, ja que se linkarmos 10 arquivos con configuraçoes diferentes no main.handlebars não o deixara lento? Eu poderia atribuir a cada page o seus devidos links e scripts? de que forma? 
### PORQUE QUANDO EU CRIO UMA TABELA PELO SEQUELIZE ELE ACRESCENTA UM S NO NOME DA TABELA?
Apos criarmos uma tabela identificamos que o campo que nomeamos como o nome da tabela ao ser iniciado com o node dados.js lhe é acrecentado um 's' no final
### Banco de dados e verificação de tipo de dado.
o javascript antes de enviar os dados para o banco de dados deve fazer todas as verificações de dados? 
Caso observado: ao declarar o atributo "celular" como do tipo int dentro do banco, ao fazer a inserção desse campo no cadastroPage com uma palavra, o banco ignora e nao registra nada.

## SOLUÇÃO ENCONTRADA
### CUSTOMIZAÇÃO DE BOOTSTAP COM CSS
o link a custom.css deve vir apos o link do bootstrap para que o arquivo css reescreva o que o bootstrap implementar, o arquivo css podera entao implementar customizações sem medo de perder a responsividade.(não mexer nos tamanhos)
### SCRIPT PARA ESTILIZAÇÃO
Error ma utilização de indexPage.js para main.handlebars caminho correto mas não injeta function
Tela nao aceita a adição de parametro chamado patch proveniente do node, ao utilizalo tela insistem em ficar em modo Quirks Mode mesmo estando com o codigo '<!DOCTYPE html>' na primeira linha do main.handlebars.
https://pt.stackoverflow.com/questions/370741/abrir-javascript-no-handlebars