document.addEventListener('DOMContentLoaded', function(){
        const button = document.documentElementById('myButton');
        if(button){
            button.addEventListener('click', function(){
                alert('Botão clicando');
            })
        }
})