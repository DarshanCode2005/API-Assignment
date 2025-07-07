// Replace this with your deployed Vercel proxy URL:
const PROXY_BASE = "https://api-proxy-rouge.vercel.app/";

const categoryTabs = document.getElementById("category-tabs");
const itemsContainer = document.getElementById("items-container");

async function loadCategories() {
  const res = await fetch(`${PROXY_BASE}?path=/categories`);
  const categories = await res.json();

  categories.forEach(({ category }) => {
    const btn = document.createElement("button");
    btn.textContent = category.toUpperCase();
    btn.onclick = () => {
      document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadItemsByCategory(category);
    };
    categoryTabs.appendChild(btn);
  });

  categoryTabs.firstChild.click();
}

async function loadItemsByCategory(cat) {
  itemsContainer.innerHTML = "<p>Loading items...</p>";
  try {
    const res = await fetch(`${PROXY_BASE}?path=/categories/${cat}/items`);
    const items = await res.json();
    renderItems(items);
  } catch (err) {
    itemsContainer.innerHTML = "<p>Error loading items.</p>";
    console.error(err);
  }
}

function renderItems(items) {
  itemsContainer.innerHTML = "";
  if (items.length === 0) {
    itemsContainer.innerHTML = "<p>No items found.</p>";
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";

    card.innerHTML = `
      <img src="https://picsum.photos/seed/${item.id}/300/160" alt="Product Image" />
      <h3>${item.name}</h3>
      <p><strong>Brand:</strong> ${item.brand}</p>
      <p><strong>Price:</strong> ₹${item.price}</p>
      <p><strong>Stock:</strong> ${item.stock}</p>
      <p><strong>Tags:</strong> ${item.tags?.split("|").join(", ")}</p>
    `;

    itemsContainer.appendChild(card);
  });
}

// Fetch single item by ID
async function fetchItemById() {
  const id = document.getElementById("item-id-input").value.trim();
  if (!id) return alert("Enter a valid item ID");

  itemsContainer.innerHTML = "<p>Loading item...</p>";

  try {
    const res = await fetch(`${PROXY_BASE}?path=/items/${id}`);
    if (!res.ok) throw new Error("Item not found");
    const item = await res.json();
    renderItems([item]);
  } catch (err) {
    itemsContainer.innerHTML = "<p>Item not found.</p>";
    console.error(err);
  }
}

// Fetch items by batch ID range
async function fetchItemsByRange() {
  const min = document.getElementById("range-min").value;
  const max = document.getElementById("range-max").value;

  if (parseInt(min) > parseInt(max)) {
    alert("Min ID should be less than Max ID");
    return;
  }

  itemsContainer.innerHTML = "<p>Loading range...</p>";

  try {
    const res = await fetch(`${PROXY_BASE}?path=/items/batch&query=ids=${min},${max}`);
    const data = await res.json();
    renderItems(data);
  } catch (err) {
    itemsContainer.innerHTML = "<p>Failed to fetch items in range.</p>";
    console.error(err);
  }
}

loadCategories();
