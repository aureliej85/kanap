let existingEntries = JSON.parse(localStorage.getItem("allEntries"));
if (existingEntries == null) existingEntries = [];

/**
 * Display product detail in Product page
 * @param {*} value The Fetch response
 */
function displayProduct(value) {
  let image = `<img src="${value.imageUrl}" alt="${value.altText}"/>`;
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

/**
 * Save options (color and quantity) in localStorage (allEntries)
 */
function saveOptions() {
  let colorPick = document.getElementById("colors").value;
  let qtyPick = document.getElementById("quantity").value;

  let productObj = {
    id: id,
    color: colorPick,
    qty: Number(qtyPick),
  };

  localStorage.setItem("productObj", JSON.stringify(productObj));

  // Add productObj to localStorage (existingEntries)
  if (existingEntries == null) {
    existingEntries = [];
    existingEntries.push(productObj);
    localStorage.setItem("allEntries", JSON.stringify(existingEntries));
  } else {
    let findProduct = existingEntries.find(
      (cartProduct) =>
        productObj.id == cartProduct.id && productObj.color == cartProduct.color
    );
    if (findProduct) {
      // add (sum) quantities If same id and same color and update localStorage (allentries)
      let nb = Number(productObj.qty) + Number(findProduct.qty);
      
        findProduct.qty = nb;
        localStorage.setItem("allEntries", JSON.stringify(existingEntries));
     
    } else {
      existingEntries.push(productObj);
      localStorage.setItem("allEntries", JSON.stringify(existingEntries));
    }
  }
  return true;
}

/**
 * Click on "add to cart" button with an eventListener,
 * Save options (saveOptions function) and
 * redirection to cart page
 */
function addBtn() {
  const bouton = document.getElementById("addToCart");
  bouton.addEventListener(
    "click",
    function () {
      let qtyInput = document.getElementById('quantity').value ;
      if(parseInt(qtyInput) > 100){
        alert("SVP, entrez une quantité inférieure à 100.");
      } else {
      saveOptions();
      //location.href = "http://127.0.0.1:5500/front/html/cart.html";
      alert("Le panier a été mis à jour !");
      }     
    },
    false
  );
}

// Fetch product details from API to display product
let id = new URLSearchParams(window.location.search).get("id");
fetch("http://localhost:3000/api/products/" + id)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then((dataResponse) => {
    displayProduct(dataResponse);
  })
  .catch(function (err) {
    console.log("Une erreur est survenue: " + err);
  });

addBtn();
