document.getElementById('searchInput').addEventListener('input', function() {
    if (this.value === '') {
        document.getElementById('searchForm').submit();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const banirButtons = document.querySelectorAll('.btn-danger'); // Botões de banir
    
    // Para cada botão de banir, adicionamos o evento de clique
    banirButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const userId = this.getAttribute('data-id');
            showConfirmBox(userId);
        });
    });

    // Função para mostrar a caixa de confirmação
    function showConfirmBox(userId) {
        // Cria o overlay e a caixa de confirmação
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';

        const confirmBox = document.createElement('div');
        confirmBox.className = 'confirm-box';

        confirmBox.innerHTML = `
            <h4>Você tem certeza que deseja banir esta Viajante?</h4>
            <p>Essa ação não poderá ser desfeita. A Viajante será banida permanentemente.</p>
            <div class="confirm-buttons">
                <button class="btn btn-secondary" id="cancelar">Voltar</button>
                <button class="btn btn-danger" id="confirmarBanimento">Sim, banir Viajante</button>
            </div>
        `;

        overlay.appendChild(confirmBox);
        document.body.appendChild(overlay);

        // Ação para o botão de cancelar
        document.getElementById('cancelar').addEventListener('click', function () {
            document.body.removeChild(overlay); // Fecha o overlay
        });

        // Ação para o botão de confirmar
        document.getElementById('confirmarBanimento').addEventListener('click', function () {
            // Envia o pedido de banir para o servidor usando POST
            fetch(`/control/deleteViajante/${userId}`, {
                method: 'POST', // Usando POST como estava no seu código original
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId }) // Envia o ID do usuário
            })
            .then(response => {
                if (response.ok) {
                    // Redireciona para a página '/administradores/banir' após a exclusão
                    window.location.href = '/viajantes/gerenciar/banir'; // Redirecionamento após sucesso
                } else {
                    alert('Erro ao banir a usuária.');
                }
            })
            .catch(error => {
                console.error('Erro ao enviar requisição:', error);
                alert('Erro na comunicação com o servidor.');
            });
            document.body.removeChild(overlay); // Fecha o overlay
        });
    }
});
