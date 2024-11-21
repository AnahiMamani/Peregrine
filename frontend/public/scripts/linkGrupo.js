// // Redireciona ao clicar no botão "Sim, publicar"
// overlay.querySelector('.btn btn-primary').addEventListener('click', () => {
//     // Coloque aqui o link para o grupo do WhatsApp
//     window.location.href = '/perfil'; // Substitua com o link correto
// });

document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o botão usando o ID para garantir que o botão correto seja clicado
    const btnEntrarNoGrupo = document.getElementById('entrarNoGrupo');

    btnEntrarNoGrupo.addEventListener('click', () => {
        // Substitua o link abaixo pelo link do grupo do WhatsApp
        window.location.href = 'https://www.google.com.br'; // Link do grupo
    });
});

