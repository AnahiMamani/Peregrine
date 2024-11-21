document.addEventListener('DOMContentLoaded', () => {
    const btnPerfilOrganizadora = document.getElementById('perfilOrganizadora');

    btnPerfilOrganizadora.addEventListener('click', () => {
        // Cria a estrutura HTML da janela de confirmação
        const overlay = document.createElement('div');
        overlay.id = 'confirmOverlay';
        overlay.className = 'confirm-overlay';
        overlay.innerHTML = `
            <div class="card-body confirm-box">
                <img id="perfilOrganizadora" name="perfilOrganizadora" src="/images/img-fotoPerfilFulana.png" alt="Foto de Perfil" class="rounded-circle border border-3 border-light" style="cursor:pointer; width: 150px; height: 150px; object-fit: cover; margin-right: 20px;">
                <div class="my-2">
                    <h4 class="text-center" style="font-weight: bold;">Fulana da Silva Sauro</h4>
                    <p class="text-center" style="font-size: 1.2rem; color: #6c757d;"><span style="color: #99067E;">★</span> 4,97</p>
                </div>
                <p class="text-justify">Olá, sou a Fulana de tal, tenho 40 anos e amo viajar.
                    Sou mãe de pet (dois cachorros e um gato). Moro em São Paulo e trabalho como corretora de imóveis. Gosto de ir ao cinema no tempo livre e pratico corrida de rua. Viajo pelo menos uma vez por mês.
                </p>
                <button class="btn btn-primary btn-confirmar-entendi w-50">Ok, entendi!</button>
            </div>
        `;

        // Adiciona a janela ao body
        document.body.appendChild(overlay);

        // Fecha a janela ao clicar no botão "Ok,entendi"
        overlay.querySelector('.btn-confirmar-entendi').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    });
});