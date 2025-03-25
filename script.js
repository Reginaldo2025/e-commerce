// Seleciona os elementos necessários
const navbar = document.querySelector(".navbar");
const cartBtn = document.getElementById("cart-btn");
const buyButtons = document.querySelectorAll(".buy-btn");
const checkoutBtn = document.getElementById("checkoutBtn");
const totalPriceElement = document.getElementById("totalPrice");
const cartItemsList = document.getElementById("cartItems");
const menuButton = document.querySelector(".menu-button");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("cartModal");
const modalOverlay = document.getElementById("modalOverlay");
const addressInput = document.getElementById("addressInput");
const errorMessage = document.getElementById("errorMessage");
const cartCountElement = document.getElementById("cart-count"); // Contador de itens no modal
document.addEventListener("DOMContentLoaded", () => {

  const btns = document.querySelectorAll(".btn-comprar");
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      gsap.to(btn, {
        scale: 1.2,
        backgroundColor: "#00ff88",
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('nav a');
    const loadingBar = document.getElementById('loading');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            loadingBar.style.display = 'block';

            setTimeout(() => {
                window.location.href = this.href;
            }, 2000);
        });
    });
});

// Dados do carrinho
let cart = [];

// Dados fictícios para os produtos, com imagem incluída
const products = [
  { name: "Produto A", price: 1000, img: "path/to/imageA.jpg" },
  { name: "Produto B", price: 2000, img: "path/to/imageB.jpg" },
  { name: "Produto C", price: 3000, img: "path/to/imageC.jpg" }
];

menuButton.addEventListener("click", () => {
  navbar.classList.toggle("show-menu");
});

// Função para abrir ou fechar o modal
function toggleModal() {
  if (modal.style.display === "block") {
    modal.style.display = "none";
    modalOverlay.style.display = "none";
    document.body.classList.remove("no-scroll"); // Remove a classe no-scroll do body
  } else {
    modal.style.display = "block";
    modalOverlay.style.display = "block";
    document.body.classList.add("no-scroll"); // Adiciona a classe no-scroll ao body
  }
}

// Impede que o clique no modal feche o modal
modal.addEventListener("click", (event) => {
  event.stopPropagation();
});

// Adiciona produto ao carrinho
function addToCart(product) {
  const existingProduct = cart.find((item) => item.name === product.name);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
}

// Remove um item do carrinho
function removeFromCart(productName) {
  const product = cart.find((item) => item.name === productName);
  if (product) {
    product.quantity--;
    if (product.quantity <= 0) {
      cart = cart.filter((item) => item.name !== productName);
    }
    updateCartUI();
  }
}

// Atualiza o conteúdo do modal
function updateCartUI() {
  cartItemsList.innerHTML = ""; // Limpa a lista
  let total = 0;

  // Atualiza o contador de itens no modal (contando apenas os itens únicos)
  cartCountElement.textContent = cart.length;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.marginBottom = "10px";

    // Exibe a imagem, nome, preço e quantidade
    li.innerHTML = `
      <div style="display: flex; align-items: center;">
        <img src="${item.img}" alt="${item.name}" style="width: 150px; height: 150px; object-fit: cover; margin-right: 10px;">
        <div style="font-size: 18px;"> <!-- Aumente o tamanho da fonte aqui -->
          <strong>${item.name}</strong><br> 
          Preço: ${formatPrice(item.price)}<br>
          Quantidade: ${item.quantity}
        </div>
      </div>
    `;

    // Botão de remover
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remover";
    removeButton.style.backgroundColor = "#f44336";
    removeButton.style.color = "white";
    removeButton.style.border = "none";
    removeButton.style.padding = "5px 10px";
    removeButton.style.cursor = "pointer";
    removeButton.style.borderRadius = "5px";

    removeButton.addEventListener("click", () => removeFromCart(item.name));

    li.appendChild(removeButton);
    cartItemsList.appendChild(li);

    total += item.price * item.quantity;
  });

  totalPriceElement.textContent = `Total: ${formatPrice(total)}`;
}

// Função para formatar preços em Kwanza Angolano (AOA)
function formatPrice(price) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

// Eventos de clique dos botões de compra
buyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.getAttribute("data-name");
    const price = parseFloat(button.getAttribute("data-price").replace(/,/g, '')); // Remove vírgulas e converte para número
    const img = button.getAttribute("data-img");  // Adicione o atributo data-img ao HTML para cada botão
    addToCart({ name, price, img });
  });
});

// Envia o pedido para o WhatsApp
function sendToWhatsApp() {
  const address = addressInput.value.trim();
  if (address === "") {
    errorMessage.style.display = "block";
    return;
  }

  errorMessage.style.display = "none";

  const phoneNumber = "929052930"; // Substitua pelo número da loja
  let message = "Pedido via WhatsApp:\n";

  cart.forEach((item) => {
    message += `${item.name}\nPreço: ${formatPrice(item.price)}\nQuantidade: ${item.quantity}\n\n`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `Total: ${formatPrice(total)}\n`;
  message += `Endereço: ${address}`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`);
}

// Adiciona os eventos de clique
openModalBtn.addEventListener("click", toggleModal);
closeModalBtn.addEventListener("click", toggleModal); // Altere de closeModal para toggleModal
  modalOverlay.addEventListener("click", toggleModal); // Altere de closeModal para toggleModal
checkoutBtn.addEventListener("click", sendToWhatsApp);

// Função para mostrar a categoria selecionada
function showCategory(category) {
    // Esconde todos os contêineres de categoria
    var contents = document.getElementsByClassName('category-content');
    for (var i = 0; i < contents.length; i++) {
        contents[i].style.display = 'none';
    }

    // Mostra o contêiner da categoria selecionada
    if (category) {
        document.getElementById(category).style.display = 'block';
    }
}

function closeCategory(button) {
    const categoryDiv = button.closest('.category-content');
    categoryDiv.style.display = 'none';
}
