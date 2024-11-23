const PdfMake = require('pdfmake'); // Importa a biblioteca pdfmake
const Viagem = require('../models/Viagem_03'); 
const sequelize = require('sequelize');

// Definindo as fontes necessárias para o pdfmake
const pdfMakePrinter = require('pdfmake/src/printer');
const fs = require('fs');
const path = require('path');

// Função para gerar o relatório de destinos
async function gerarRelatorioViagens() {
    try {
        // Consulta os destinos mais visitados (contagem de viagens por destino)
        const destinosRanking = await Viagem.findAll({
            attributes: [
                'A03_DESTINO',
                [sequelize.fn('COUNT', sequelize.col('A03_DESTINO')), 'quantidade']
            ],
            group: ['A03_DESTINO'],
            order: [[sequelize.fn('COUNT', sequelize.col('A03_DESTINO')), 'DESC']],
            raw: true
        });

        // Definindo o conteúdo do PDF
        const docDefinition = {
            content: [
                { text: 'Ranking de Destinos Mais Visitados', style: 'header' },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['*', 'auto'],
                        body: [
                            ['Destino', 'Quantidade de Visitas'], // Cabeçalho
                            ...destinosRanking.map(item => [item.A03_DESTINO, item.quantidade])
                        ]
                    }
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 20, 0, 20]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                }
            }
        };

        // Carregando as fontes do pdfmake
        const fonts = {
            Roboto: {
                normal: 'C:/xampp/htdocs/Peregrine/backend/fonts/Roboto-Regular.ttf',
                bold: 'C:/xampp/htdocs/Peregrine/backend/fonts/Roboto-Medium.ttf',
                italics: 'C:/xampp/htdocs/Peregrine/backend/fonts/Roboto-Italic.ttf',
                bolditalics: 'C:/xampp/htdocs/Peregrine/backend/fonts/Roboto-MediumItalic.ttf'
            }
        };
        

        const printer = new pdfMakePrinter(fonts); // Inicializa o printer com as fontes
        const pdfDoc = printer.createPdfKitDocument(docDefinition); // Gera o documento PDF
        const filePath = 'C:/xampp/htdocs/Peregrine/backend/relatorio/relatorio.pdf'; // Caminho absoluto
        // Salva o PDF no diretório especificado
        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.end();

        // Após salvar o arquivo, você pode redirecionar para o download
        return filePath;

    } catch (error) {
        console.error('Erro ao gerar o relatório de viagens:', error);
    }
}

module.exports = { gerarRelatorioViagens };
