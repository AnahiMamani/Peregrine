// public/deletando.js
async function banirUsuario(id) {
    try {
        const response = await fetch(`/delete/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.getElementById(`user-${id}`).remove(); // Remove a linha da tabela
            alert('Usuário banido com sucesso!');
        } else {
            alert('Erro ao banir o usuário.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao banir o usuário.');
    }
}
