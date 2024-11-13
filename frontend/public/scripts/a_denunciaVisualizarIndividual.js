//pagina a_denunciaVisualizarIndividual.html

document.addEventListener('DOMContentLoaded', function () {
    const banirButton = document.querySelector('.bg-danger'); //botao cancelar denuncia
    const cancelarButton = document.querySelector('.bg-success'); //botao banir usuária
    
    banirButton.addEventListener('click', function () {
        showConfirmBox("banir");
    });

    cancelarButton.addEventListener('click', function () {
        showConfirmBox("cancelar");
    });
    
    function showConfirmBox(action) {
        // cria o overlay e a caixa de confirmação
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';

        const confirmBox = document.createElement('div');
        confirmBox.className = 'confirm-box';

        // define o conteúdo da caixa de acordo com a ação
        let titleText, smallText, confirmText;
        
        if (action === "banir") {
            titleText = "Você tem certeza que deseja banir essa usuária?";
            smallText = "Essa ação não poderá ser desfeita. A usuária será notificada.";
            confirmText = "Sim, banir usuária";
        } else if (action === "cancelar") {
            titleText = "Você tem certeza que deseja cancelar a denúncia?";
            smallText = "Essa ação não poderá ser desfeita. A usuária que enviou a denúncia será notificada.";
            confirmText = "Sim, cancelar denúncia";
        }

        confirmBox.innerHTML = `
            <h4>${titleText}</h4>
            <p>${smallText}</p>
            <div class="confirm-buttons">
                <button class="btn btn-confirmar-nao">Não, quero voltar</button>
                <button class="btn btn-confirmar-sim">${confirmText}</button>
            </div>
        `;

        overlay.appendChild(confirmBox);
        document.body.appendChild(overlay);

        // adiciona o evento para fechar o overlay se o admin escolher "Não"
        overlay.querySelector('.btn-confirmar-nao').addEventListener('click', function () {
            document.body.removeChild(overlay);
        });

        // adiciona o evento para confirmar a ação (banir ou cancelar)
        overlay.querySelector('.btn-confirmar-sim').addEventListener('click', function () {
            //os alerts aqui embaixo sao só de teste, pq vai ter que substituir pelo codigo real com o BD
            if (action === "banir") {
            //aqui vai ter que direcionar a pagina para a_denunciaBanirConcluido.html
                alert("Usuária banida com sucesso!");
            } else if (action === "cancelar") {
            //aqui vai ter que direcionar a pagina para a_denunciaCancelarConcluido.html
                alert("Denúncia cancelada com sucesso!");
            }
            document.body.removeChild(overlay);
        });
    }
});
