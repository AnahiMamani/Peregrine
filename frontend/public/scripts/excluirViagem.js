document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o botão de excluir viagem pelo ID correto
    const btnExcluirViagem = document.getElementById('exclusao');

    btnExcluirViagem.addEventListener('click', () => {
        // Cria a estrutura HTML da janela de confirmação
        const overlay = document.createElement('div');
        overlay.id = 'confirmOverlay';
        overlay.className = 'confirm-overlay';
        overlay.innerHTML = `
            <div class="confirm-box">
                <h4>Você tem certeza que deseja excluir a viagem?</h4>
                <p>Essa ação não poderá ser desfeita.</p>
                <div class="confirm-buttons">
                    <button class="btn btn-secondary btn-confirmar-nao">Não, quero voltar</button>
                    <button class="btn btn-primary btn-confirmar-sim">Sim, excluir viagem</button>
                </div>
            </div>
        `;

        // Adiciona a janela ao body
        document.body.appendChild(overlay);

        // Fecha a janela ao clicar no botão "Não, quero voltar"
        overlay.querySelector('.btn-confirmar-nao').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        // Redireciona ao clicar no botão "Sim, excluir viagem"
        overlay.querySelector('.btn-confirmar-sim').addEventListener('click', () => {
            window.location.href = '/viagem/exclusao-concluida'; 
        });
    });
});
