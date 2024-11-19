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


