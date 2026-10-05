const API_URL = "http://localhost:8080/api/productos";

const productGrid = document.getElementById("productGrid");
const loadingGrid = document.getElementById("loadingGrid");
const emptyState = document.getElementById("emptyState");
const message = document.getElementById("message");
const totalProductos = document.getElementById("totalProductos");
const resultCount = document.getElementById("resultCount");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const reloadButton = document.getElementById("reloadButton");
const apiStatus = document.getElementById("apiStatus");
const productDialog = document.getElementById("productDialog");
const closeDialog = document.getElementById("closeDialog");

let products = [];

function formatPrice(price) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

function setApiStatus(online) {
  apiStatus.textContent = online ? "API conectada" : "API sin conexión";
  apiStatus.className = `status ${online ? "status-online" : "status-offline"}`;
}

function showError(text) {
  message.textContent = text;
  message.classList.remove("hidden");
}

function clearError() {
  message.classList.add("hidden");
  message.textContent = "";
}

function populateCategories() {
  const selected = categoryFilter.value;
  const categories = [...new Set(products.map((product) => product.categoria))].sort();

  categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  if (categories.includes(selected)) {
    categoryFilter.value = selected;
  }
}

function openProductDetail(product) {
  document.getElementById("dialogName").textContent = product.nombre;
  document.getElementById("dialogId").textContent = product.id;
  document.getElementById("dialogCategory").textContent = product.categoria;
  document.getElementById("dialogPrice").textContent = formatPrice(product.precio);
  productDialog.showModal();
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const top = document.createElement("div");
  top.className = "card-top";

  const id = document.createElement("span");
  id.className = "product-id";
  id.textContent = `#${String(product.id).padStart(3, "0")}`;

  const category = document.createElement("span");
  category.className = "category-chip";
  category.textContent = product.categoria;

  const name = document.createElement("h4");
  name.textContent = product.nombre;

  const price = document.createElement("p");
  price.className = "price";
  price.textContent = formatPrice(product.precio);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "detail-button";
  button.textContent = "Ver detalle";
  button.addEventListener("click", () => openProductDetail(product));

  top.append(id, category);
  card.append(top, name, price, button);
  return card;
}

function renderProducts() {
  const search = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  const filtered = products.filter((product) => {
    const matchesSearch =
      product.nombre.toLowerCase().includes(search) ||
      product.categoria.toLowerCase().includes(search);
    const matchesCategory = !category || product.categoria === category;
    return matchesSearch && matchesCategory;
  });

  productGrid.innerHTML = "";
  filtered.forEach((product) => productGrid.appendChild(createProductCard(product)));

  resultCount.textContent = `${filtered.length} de ${products.length} productos`;
  emptyState.classList.toggle("hidden", filtered.length !== 0);
}

async function loadProducts() {
  clearError();
  loadingGrid.classList.remove("hidden");
  productGrid.classList.add("hidden");
  emptyState.classList.add("hidden");
  reloadButton.disabled = true;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`La API respondió con HTTP ${response.status}`);
    }

    products = await response.json();
    totalProductos.textContent = products.length;
    populateCategories();
    renderProducts();
    setApiStatus(true);
    productGrid.classList.remove("hidden");
  } catch (error) {
    products = [];
    totalProductos.textContent = "0";
    resultCount.textContent = "";
    setApiStatus(false);
    showError(
      "No se pudo cargar el catálogo. Verifica que Spring Boot esté ejecutándose en http://localhost:8080 y que CORS esté habilitado para el frontend."
    );
    console.error(error);
  } finally {
    loadingGrid.classList.add("hidden");
    reloadButton.disabled = false;
  }
}

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
reloadButton.addEventListener("click", loadProducts);
closeDialog.addEventListener("click", () => productDialog.close());
productDialog.addEventListener("click", (event) => {
  if (event.target === productDialog) productDialog.close();
});

loadProducts();
