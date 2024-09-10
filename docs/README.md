# Sobre Peregrine

# Estrutura do Projeto

Este projeto é uma aplicação web desenvolvida por uma equipe de 6 pessoas, composta por designers, desenvolvedores de front-end e back-end. Para facilitar o compreendimento, abaixo está a descrição detalhada da estrutura de arquivos do projeto:

## Estrutura de Diretórios

```
/project-root                # Diretório raiz do projeto
│
├── /design                  # Diretório para os designers
│   ├── /assets              # Imagens, ícones, fontes, etc.
│   └── /prototypes          # Protótipos e wireframes dos layouts
│
├── /backend                 # Código do servidor e banco de dados
│   ├── /controllers         # Lógica de negócio e controle de rotas
│   ├── /models              # Modelos de dados e conexão com MySQL
│   ├── /routes              # Definição das rotas da aplicação
│   ├── /views               # Templates Handlebars (layouts e páginas)
│   │   ├── /layouts         # Layouts principais (ex: main.hbs)
│   │   ├── /partials        # Partials reutilizáveis (ex: header, footer)
│   │   └── /pages           # Páginas específicas (ex: home, about)
│   └── server.js            # Arquivo principal do servidor Node.js
│
├── /frontend                # Código da interface do usuário
│   ├── /styles              # Estilos (CSS, Bootstrap)
│   ├── /scripts             # Scripts JavaScript do front-end
│   ├── /public              # Arquivos públicos (imagens, etc.)
│   │   ├── /images          # Imagens usadas no site
│   │   ├── index.html       # Página HTML principal (ex: se for usado sem Handlebars) 
│   │   └── favicon.ico      # Ícone do site
│   └── App.js               # Arquivo principal da aplicação de front-end
│
├── /config                  # Configurações gerais
│   └── db.js                # Configuração do banco de dados MySQL
│
├── /docs                    # Documentação do projeto
│   └── README.md            # Instruções e informações sobre o projeto
│
├── package.json             # Configuração do Node.js com as dependências
└── .gitignore               # Arquivos a serem ignorados pelo Git
```

### Explicação Detalhada dos Diretórios e Arquivos

#### `/design`
- **Propósito**: Armazena todos os recursos criados pela equipe de design, como imagens, protótipos e ícones, que serão usados no desenvolvimento do front-end.
  - `/assets`: Contém imagens, ícones, fontes e outros recursos visuais.
  - `/prototypes`: Guarda protótipos e wireframes criados em ferramentas como Figma ou Adobe XD.

#### `/backend`
- **Propósito**: Contém todo o código do lado do servidor, incluindo lógica de negócio, rotas, modelos de dados e configuração do servidor Node.js.
  - `/controllers`: Lida com a lógica de negócio e controle das rotas da aplicação.
  - `/models`: Define os modelos de dados e gerencia a conexão com o MySQL.
  - `/routes`: Define as rotas da aplicação, mapeando URLs para controladores específicos.
  - `/views`: Armazena templates Handlebars para renderização de páginas dinâmicas.
    - `/layouts`: Layouts principais da aplicação, como `main.hbs`.
    - `/partials`: Partes reutilizáveis das páginas, como cabeçalhos e rodapés.
    - `/pages`: Páginas específicas da aplicação, como `home.hbs`.
  - `server.js`: Arquivo principal que configura o servidor Express, rotas, e conexão com o banco de dados.

#### `/frontend`
- **Propósito**: Gerencia o código que lida com a interface do usuário, incluindo HTML, CSS, JavaScript, e recursos públicos.
  - `/styles`: Contém os arquivos de estilo CSS, incluindo Bootstrap.
  - `/scripts`: Scripts JavaScript que controlam interações no front-end.
  - `/public`: Arquivos acessíveis diretamente pelo navegador.
    - `/images`: Imagens utilizadas na interface do usuário.
    - `index.html`: Página HTML principal se Handlebars não estiver sendo usado.
    - `favicon.ico`: Ícone do site exibido na aba do navegador.
  - `App.js`: Arquivo principal que controla a lógica da aplicação no front-end.

#### `/config`
- **Propósito**: Contém arquivos de configuração necessários para o funcionamento do projeto.
  - `db.js`: Arquivo que configura a conexão com o banco de dados MySQL.

#### `/docs`
- **Propósito**: Armazena a documentação do projeto, com instruções e informações importantes.
  - `README.md`: Documento principal com detalhes sobre como instalar, configurar e rodar o projeto.

#### Arquivos na Raiz
- **`package.json`**: Contém as dependências do projeto e scripts de execução.
- **`.gitignore`**: Lista de arquivos e pastas que devem ser ignorados pelo Git, como `node_modules`.
---

### Como Rodar o Projeto

**Atenção não é necessario criar um novo arquivo para o repositorio.**
**Atenção para fazer o manuseio do projeto necesario installar o xammp, npm e git**

1. **Abra o prompt de comando e tenha certeza que esta dentro de c:\xampp\htdocs> e faça o clone** :
   ```bash
   git clone https://github.com/Debora-Carvalho/Peregrine.git
   ```

2. **Entre dentro da pasta Peregrine**:
   ```bash
   cd Peregrine
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Inicie o servidor**:
   ```bash
   node backend/server.js
   ```

3. Acesse a aplicação pelo navegador em `http://localhost:8021`.
   
---


