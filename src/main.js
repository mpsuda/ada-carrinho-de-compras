import "./style.css";



const apiPersonagem = async () => {
    const res = await fetch("https://rickandmortyapi.com/api/character/1,2,3");
    const data = await res.json();
    return data;
};

async function buildCharacterData() {
    const personagem = await apiPersonagem();
    personagem.forEach(p => {
        const localData = getLocalStorage(p.id);
        p.quantity = localData.quantity;
    });
    return personagem;
}

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
                  <span class="quantity-value" aria-live="polite">${p.quantity}</span>
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

function setQuantityInLocalStorage(index, id) {
    index == 0 ? localStorage.removeItem(id) : localStorage.setItem(id, JSON.stringify({
        quantity: index,
    }));
}

function initializeQuantityButtons() {
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


async function main() {
    const personagem = await buildCharacterData();

    const container = document.getElementById("products");
    container.innerHTML = generateProductHTML(personagem);

    initializeQuantityButtons();

    const cartCheckout = document.getElementById("cart_checkout");
    const cartTotal = document.getElementById("cart_total");

    
   if (cartTotal.innerText > 0) {
       cartCheckout.disabled = false;
       cartTotal.textContent = `${cartTotal.innerText}`;
   }

    cartCheckout.addEventListener("click", () => {
         localStorage.clear();
         cartTotal.textContent = "0";
         cartCheckout.disabled = true;
         const quantityValues = document.querySelectorAll(".quantity-value");
         quantityValues.forEach((q) => q.textContent = "0");
    });
}

main();




