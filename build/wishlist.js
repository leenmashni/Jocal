

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("wishlist-grid");
  const token = localStorage.getItem("token");

  if (!token) {
    grid.innerHTML = "<p>Please log in to view your wishlist.</p>";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/wishlist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!data.length) {
      grid.innerHTML = "<p>Your wishlist is empty.</p>";
      return;
    }

    data.forEach(item => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <h4>${item.title}</h4>
        <h6>${item.price} JOD</h6>
        <div class="product-actions">
          <span class="buy-now">View</span>
          <button class="wishlist-btn" onclick="removeItem('${item.productId}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = "<p>Failed to load wishlist.</p>";
    console.error(err);
  }
});

async function removeItem(productId) {
  const token = localStorage.getItem("token");
  try {
    await fetch(`http://localhost:5000/wishlist/remove/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    window.location.reload();
  } catch (err) {
    console.error("Failed to remove item", err);
  }
}
