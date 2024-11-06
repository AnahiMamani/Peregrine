document.addEventListener("DOMContentLoaded", function () {
    const filtroButton = document.getElementById("filtroSearchViagem");
    const filtroOverlay = document.createElement("div");
    filtroOverlay.classList.add("filtro-overlay");

    filtroOverlay.innerHTML = `
        <div class="filtro-box">
            <div class="filtro-header">
                <h3>Filtros</h3>
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
                    
                    <div class="custo-inputs">
                        <div class="input-group-custo">
                            <label for="custoMin">Mínimo</label>
                            <input type="number" placeholder="R$" id="custoMin">
                        </div>
                        
                        <div class="input-group-custo">
                            <label for="custoMax">Máximo</label>
                            <input type="number" placeholder="R$" id="custoMax">
                        </div>
                    </div>
                </div>
                <hr>
                <div class="filtro-section"> 
                    <h5>Avaliação da organizadora</h5>
                    <label class="radio-button-avaliacao">
                        <input type="radio" name="avaliacao" value="todos">
                        <span>Todos</span>
                    </label>
                    <label class="radio-button-avaliacao">
                        <input type="radio" name="avaliacao" value="5">
                        <span>★ 5</span>
                    </label>
                    <label class="radio-button-avaliacao">
                        <input type="radio" name="avaliacao" value="4">
                        <span>★ 4</span>
                    </label>
                    <label class="radio-button-avaliacao">
                        <input type="radio" name="avaliacao" value="3">
                        <span>★ 3</span>
                    </label>
                    <label class="radio-button-avaliacao">
                        <input type="radio" name="avaliacao" value="2">
                        <span>★ 2</span>
                    </label>
                    <label class="radio-button-avaliacao">
                        <input type="radio" name="avaliacao" value="1">
                        <span>★ 1</span>
                    </label>
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
        //adicionar aqui a lógica para aplicar os filtros
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const custoMinInput = document.getElementById("custoMin");
    const custoMaxInput = document.getElementById("custoMax");

    // Criar o elemento de mensagem de erro
    const errorMessage = document.createElement("span");
    errorMessage.textContent = "O valor mínimo deve ser menor ou igual ao valor máximo";
    errorMessage.style.color = "red";
    errorMessage.style.fontSize = "0.9rem";
    errorMessage.style.display = "none"; // Ocultar inicialmente

    // Inserir a mensagem de erro após os campos de entrada
    const parentDiv = custoMaxInput.parentNode;
    parentDiv.appendChild(errorMessage);

    function formatCurrency(value) {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    function applyCurrencyMask(input) {
        let value = input.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        value = (parseFloat(value) / 100).toFixed(2); // Converte para formato decimal
        input.value = formatCurrency(value); // Formata como moeda
    }

    function validateMinMax() {
        const min = parseFloat(custoMinInput.value.replace(/[^\d,.-]/g, "").replace(",", "."));
        const max = parseFloat(custoMaxInput.value.replace(/[^\d,.-]/g, "").replace(",", "."));
        
        if (!isNaN(min) && !isNaN(max) && min > max) {
            errorMessage.style.display = "block"; // Exibir a mensagem de erro
        } else {
            errorMessage.style.display = "none"; // Ocultar a mensagem de erro
        }
    }

    custoMinInput.addEventListener("input", function () {
        applyCurrencyMask(custoMinInput);
    });

    custoMaxInput.addEventListener("input", function () {
        applyCurrencyMask(custoMaxInput);
    });

    custoMaxInput.addEventListener("blur", validateMinMax);
    custoMinInput.addEventListener("blur", validateMinMax);
});
