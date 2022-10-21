function displayProduct(value) {
  let image = `<img src="${value.imageUrl}" alt="${value.altText}"></img>`;
  document.getElementsByClassName("item__img")[0].innerHTML = image;

  let title = value.name;
  document.getElementById("title").append(title);

  let price = value.price;
  document.getElementById("price").append(price);

  let description = value.description;
  document.getElementById("description").append(description);

  let colors = value.colors;
  for (let color of colors) {
    let option = document.createElement("option");
    option.setAttribute("value", color);
    option.append(color);
    document.getElementById("colors").append(option);
  }
}

function addEntry() {
  var existingEntries = JSON.parse(localStorage.getItem("allEntries"));
  if (existingEntries == null) existingEntries = [];

  // On récupère les valeurs saisies couleur et quantité
  var colorPick = document.getElementById("colors").value;
  var qtyPick = document.getElementById("quantity").value;
  var entry = {
    id: id,
    color: colorPick,
    qty: Number(qtyPick),
  };

  localStorage.setItem("entry", JSON.stringify(entry));

  console.table(existingEntries);

  // Condition pour mettre à jour la couleur et la quantité si même id sinon aouter nouveau produit
  if (existingEntries == null) {
    existingEntries = [];
    existingEntries.push(entry);
    localStorage.setItem("allEntries", JSON.stringify(existingEntries));
  } else {
    let get_article = existingEntries.find(
      (cart_product) =>
        entry.id == cart_product.id && entry.color == cart_product.color
    );
    if (get_article) {
      let nb = Number(entry.qty) + Number(get_article.qty);
      if (nb < 101) {
        get_article.qty = nb;
        localStorage.setItem("allEntries", JSON.stringify(existingEntries));
      } else {
        return false;
      }
    } else {
      existingEntries.push(entry);
      localStorage.setItem("allEntries", JSON.stringify(existingEntries));
    }
  }
  return true;
}

let id = new URLSearchParams(window.location.search).get("id");

fetch("http://localhost:3000/api/products/" + id)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then((value) => {
    displayProduct(value);

    const bouton = document.getElementById("addToCart");
    bouton.addEventListener(
      "click",
      function () {
        addEntry();
        location.href = "http://127.0.0.1:5500/front/html/cart.html";
      },
      false
    );
  })
  .catch(function (err) {
    console.log("Une erreur est survenue");
  });
