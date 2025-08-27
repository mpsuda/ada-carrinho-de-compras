import "./style.css";



const apiPersonagem = async () => {
    const res = await fetch("https://rickandmortyapi.com/api/character/1,2,3");
    const data = await res.json();
    return data;
};

function generateProductHTML(personagem) {
        return personagem.map((p) => (`
            <div class="item" data-id="${p.id}">
              <div class="item__group">
                <img src="${p.image}" alt="${p.name}" class="sticker" />
                <h3>${p.name}</h3>
              </div>
              <div class="item__group">
                <div class="quantity-control">
                  <button type="button" class="quantity-btn decrease">-</button>
                  <span class="quantity-value" aria-live="polite">${p.quantity || getLocalStorage(p.id).quantity}</span>
                  <button type="button" class="quantity-btn increase">+</button>
                </div>
                <button type="button" class="delete-btn" id="add-to-cart">
                  &times;
                </button>
              </div>
            </div> 
    `)).join("");
}

function getLocalStorage(id) {
    const data = localStorage.getItem(id);
    return data ? JSON.parse(data) : { quantity: 0 };
}

function setQuantityInLocalStorage(index, id, clean = false) {
    index == 0 || clean ? localStorage.removeItem(id) : localStorage.setItem(id, JSON.stringify({
        quantity: index,
    }));
}

async function main() {
    const personagem = await apiPersonagem();

    const container = document.getElementById("products");
    container.innerHTML = generateProductHTML(personagem);

    const btnsIncrease = document.querySelectorAll(".increase");
    const btnsDecrease = document.querySelectorAll(".decrease");
    const quantityValues = document.querySelectorAll(".quantity-value");
    const btnDelete = document.querySelectorAll(".delete-btn");

    btnsIncrease.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            quantityValues[index].textContent = parseInt(quantityValues[index].textContent) + 1;
            const id = btn.parentElement.parentElement.parentElement.dataset.id;
            setQuantityInLocalStorage(quantityValues[index].textContent, id);
        });
    });

    btnsDecrease.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            quantityValues[index].textContent = Math.max(0, parseInt(quantityValues[index].textContent) - 1);
            const id = btn.parentElement.parentElement.parentElement.dataset.id;
            setQuantityInLocalStorage(quantityValues[index].textContent, id);
        });
    });

    btnDelete.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            quantityValues[index].textContent = 0;
            const id = btn.parentElement.parentElement.dataset.id;
            setQuantityInLocalStorage(quantityValues[index].textContent, id, true);
        });
    });

}

main();