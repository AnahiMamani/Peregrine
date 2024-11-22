//pagina u_planejarViagem.html

document.addEventListener('DOMContentLoaded', () => {
    const btnCriarViagem = document.getElementById('confirmaPlanejarViagem');

    btnCriarViagem.addEventListener('click', () => {
        // Cria a estrutura HTML da janela de confirmação
        const overlay = document.createElement('div');
        overlay.id = 'confirmOverlay';
        overlay.className = 'confirm-overlay';
        overlay.innerHTML = `
            <div class="confirm-box">
                <h4>Você confirma a criação dessa viagem?</h4>
                <p>Após publicada, a viagem estará visível a todas as usuárias do site. <br>Essa ação poderá ser desfeita.</p>
                <div class="confirm-buttons">
                    <button class="btn btn-secondary btn-confirmar-nao">Não, quero voltar</button>
                    <button class="btn btn-primary btn-confirmar-sim">Sim, publicar</button>
                </div>
            </div>
        `;

        // Adiciona a janela ao body
        document.body.appendChild(overlay);

        // Fecha a janela ao clicar no botão "Não, quero voltar"
        overlay.querySelector('.btn-confirmar-nao').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        // Redireciona ao clicar no botão "Sim, publicar"
        overlay.querySelector('.btn-confirmar-sim').addEventListener('click', () => {
            alert('Viagem publicada!'); 
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const custoViagem = document.getElementById("custoViagem");

    // Função para formatar o valor como moeda brasileira
    function formatCurrency(value) {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    // Função que aplica a máscara de moeda ao valor do input
    function applyCurrencyMask(input) {
        let value = input.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        value = (parseFloat(value) / 100).toFixed(2); // Converte para formato decimal
        input.value = formatCurrency(value); // Formata como moeda brasileira
    }

    // Adiciona o evento de input ao campo custoViagem
    custoViagem.addEventListener("input", function () {
        applyCurrencyMask(custoViagem);
    });
});


// Selecionar o ícone de informação (link grupo externo)
const infoIcon = document.getElementById('infoIcon');

// Criar a caixinha de tooltip
const tooltip = document.createElement('div');
tooltip.textContent = "O link externo é de um grupo criado pela organizadora da viagem, seja no whatsapp, telegram ou outra rede social, para combinar maiores detalhes da viagem. Saiba que a Peregrine não interfere nesta interação.";
tooltip.style.position = 'absolute';
tooltip.style.backgroundColor = '#f8f9fa';
tooltip.style.color = '#212529';
tooltip.style.border = '1px solid #ccc';
tooltip.style.borderRadius = '10px';
tooltip.style.padding = '10px';
tooltip.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
tooltip.style.width = '20rem';
tooltip.style.fontSize = '0.9rem';
tooltip.style.display = 'none'; // Escondido inicialmente
tooltip.style.zIndex = '1000';

// Adicionar a tooltip ao corpo
document.body.appendChild(tooltip);

// Mostrar tooltip ao passar o mouse
infoIcon.addEventListener('mouseover', (event) => {
    tooltip.style.display = 'block';
    tooltip.style.left = event.pageX + 'px'; // Posiciona próximo ao mouse
    tooltip.style.top = event.pageY + 20 + 'px'; // Ajusta a altura para ficar abaixo
});

// Esconder tooltip ao remover o mouse
infoIcon.addEventListener('mouseout', () => {
    tooltip.style.display = 'none';
});



