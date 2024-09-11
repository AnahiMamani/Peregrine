# LOGS
## ERROS
### SCRIPT PARA ESTILIZAÇÃO
- FRONTEND
Error ma utilização de indexPage.js para main.handlebars caminho correto mas não injeta function
- BACKEND 
Tela nao aceita a adição de parametro chamado patch proveniente do node, ao utilizalo tela insistem em ficar em modo Quirks Mode mesmo estando com o codigo '<!DOCTYPE html>' na primeira linha do main.handlebars.
https://pt.stackoverflow.com/questions/370741/abrir-javascript-no-handlebars

## DUVIDAS
### SCRIPT E ARQUIVOS CSS SERAO INJETADAS DIRETAMENTE NA MAIN.HANDLEBARS?
Minha pagina tendo mais de 5 telas fica o meu questinamento sobre o carregamento da tela, ja que se linkarmos 10 arquivos con configuraçoes diferentes no main.handlebars não o deixara lento? Eu poderia atribuir a cada page o seus devidos links e scripts? de que forma? 
### PORQUE QUANDO EU CRIO UMA TABELA PELO SEQUELIZE ELE ACRESCENTA UM S NO NOME DA TABELA?
Apos criarmos uma tabela identificamos que o campo que nomeamos como o nome da tabela ao ser iniciado com o node dados.js lhe é acrecentado um 's' no final

## SOLUÇÃO ENCONTRADA
### CUSTOMIZAÇÃO DE BOOTSTAP COM CSS
o link a custom.css deve vir apos o link do bootstrap para que o arquivo css reescreva o que o bootstrap implementar, o arquivo css podera entao implementar customizações sem medo de perder a responsividade.(não mexer nos tamanhos)
