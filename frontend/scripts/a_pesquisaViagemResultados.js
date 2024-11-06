document.addEventListener("DOMContentLoaded", function () {
    const filtroButton = document.getElementById("filtroSearchViagem");
    const filtroOverlay = document.createElement("div");
    filtroOverlay.classList.add("filtro-overlay");

    filtroOverlay.innerHTML = `
        <div class="filtro-box">
            <div class="filtro-header">
                <h4>Filtros</h4>
                <button class="filtro-close">&times;</button>
            </div>
            <div class="filtro-content">
                <div class="filtro-section">
                    <h5>Ordenar por</h5>
                    <label><input type="radio" name="order" value="relevancia"> Relevância</label><br>
                    <label><input type="radio" name="order" value="lancamento"> Lançamentos de viagens</label><br>
                    <label><input type="radio" name="order" value="menor_custo"> Menor estimativa de custo</label><br>
                    <label><input type="radio" name="order" value="maior_custo"> Maior estimativa de custo</label>
                </div>
                <hr>
                <div class="filtro-section">
                    <label>Permitido filhos <input type="checkbox" id="permitidoFilhos"></label><br>
                    <label>Permitido pets <input type="checkbox" id="permitidoPets"></label>
                </div>
                <hr>
                <div class="filtro-section">
                    <h5>Estimativa de custo</h5>
                    <input type="text" placeholder="R$ Mínimo" id="custoMin"> 
                    <input type="text" placeholder="R$ Máximo" id="custoMax">
                </div>
                <hr>
                <div class="filtro-section">
                    <h5>Avaliação da organizadora</h5>
                    <label><input type="radio" name="avaliacao" value="todos"> Todos</label>
                    <label><input type="radio" name="avaliacao" value="5"> 5</label>
                    <label><input type="radio" name="avaliacao" value="4"> 4</label>
                    <label><input type="radio" name="avaliacao" value="3"> 3</label>
                    <label><input type="radio" name="avaliacao" value="2"> 2</label>
                    <label><input type="radio" name="avaliacao" value="1"> 1</label>
                </div>
                <button class="btn-aplicar">Aplicar</button>
            </div>
        </div>
    `;

    document.body.appendChild(filtroOverlay);

    filtroButton.addEventListener("click", function () {
        filtroOverlay.style.display = "flex";
    });

    filtroOverlay.querySelector(".filtro-close").addEventListener("click", function () {
        filtroOverlay.style.display = "none";
    });

    filtroOverlay.querySelector(".btn-aplicar").addEventListener("click", function () {
        filtroOverlay.style.display = "none";
        // Adicione aqui a lógica para aplicar os filtros
    });
});
