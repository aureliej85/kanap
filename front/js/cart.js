let objLinea = window.localStorage.getItem("allEntries");
let cartInfos = JSON.parse(objLinea);
console.table(cartInfos);


function deleteEntry(idProduct, colorProduct, index) {
  let get_article = cartInfos.find(
    (cart_product) =>
      idProduct == cart_product.id && colorProduct == cart_product.color
  );

  if (get_article) {
    cartInfos.splice(index, 1);
  }

  item = JSON.stringify(cartInfos);
  localStorage.setItem("allEntries", item);

  location.reload();
}

function changeQuantity(idProduct, colorProduct, qtyProduct, newQtyProduct, index) {
  let get_article = cartInfos.find(
    (cart_product) =>
      idProduct == cart_product.id && colorProduct == cart_product.color
  );

  
  if (get_article) {
    console.log("if get article");
    qtyProduct = newQtyProduct;
    cartInfos[index].qty = Number(newQtyProduct);
    cartInfos.splice(index, 1, cartInfos[index]);
    console.log(qtyProduct);
    console.log(newQtyProduct);
    console.log(cartInfos[index]);

  }

  item = JSON.stringify(cartInfos);
  localStorage.setItem("allEntries", item);

  console.log("Quantité bien modifiée");
}


function errorMsg(){
    let firstNameMsg = document.getElementById("firstNameErrorMsg");
    var firstName = firstNameMsg.value;
    if (firstName !== "plizz") {
        firstNameMsg.innerHTML = "No man";
    } else {
        firstNameMsg.innerHTML = "yes man";
    }

}





function createCartElement(value, cartItem, index) {
  let article = document.createElement("article");
  article.setAttribute("class", "cart__item");
  article.setAttribute("data-id", cartItem.id);
  article.setAttribute("data-color", cartItem.color);

  let divImage = document.createElement("div");
  divImage.setAttribute("class", "cart__item__img");
  divImage.innerHTML = `<img src="${value.imageUrl}" alt="${value.altTxt}">`;

  let divContent = document.createElement("div");
  divContent.setAttribute("class", "cart__item__content");

  let divDescr = document.createElement("div");
  divDescr.setAttribute("class", "cart__item__content__description");

  divDescr.innerHTML = `<h2>${value.name}</h2> <br> <p>${cartItem.color}</p> <br> <p>${value.price}</p>`;
  //totalPriceItem[index] = value.price * cartItem.qty;

  let divSettings = document.createElement("div");
  divSettings.setAttribute("class", "cart__item__content__settings");

  // Quantité
  let divSetQty = document.createElement("div");
  divSetQty.setAttribute("class", "cart__item__content__settings__quantity");
  let inputQuantity = document.createElement("input");
  inputQuantity.setAttribute("type", "number");
  inputQuantity.setAttribute("class", "itemQuantity");
  inputQuantity.setAttribute("name", "itemQuantity");
  inputQuantity.setAttribute("min", 1);
  inputQuantity.setAttribute("max", 100);
  inputQuantity.setAttribute("value", `${cartItem.qty}`); 
  inputQuantity.addEventListener(
    "change",
    function () {
      let newQty = inputQuantity.value;
      changeQuantity(cartItem.id, cartItem.color,cartItem.qty, newQty, index);
      alert("La quantité a bien été modifiée");
      
    },
    false
  );

  // Supprimer
  let divSetDelete = document.createElement("div");
  divSetDelete.setAttribute("class", "cart__item__content__settings__delete");
  let pDelete = document.createElement("p");
  pDelete.innerText = "Supprimer";
  pDelete.setAttribute("class", "deleteItem");
  pDelete.addEventListener(
    "click",
    function () {
      deleteEntry(cartItem.id, cartItem.color, index);
    },
    false
  );

  document.getElementById("cart__items").append(article);

  article.appendChild(divImage);
  article.appendChild(divContent);
  divContent.append(divDescr);
  divContent.append(divSettings);
  divSettings.append(divSetQty);
  divSetQty.append(inputQuantity);
  divSettings.append(divSetDelete);
  divSetDelete.append(pDelete);


  // TOTAL ARTICLES
  var totalQty = 0;
  for (var property in cartInfos) {
    totalQty += cartInfos[property].qty;   
    
  }
  let spanTotalQty = document.getElementById("totalQuantity");
  spanTotalQty.innerHTML = totalQty;


  // PRIX TOTAL
  var products = [];
  for(var j = 0; j < cartInfos.length; j++) {
    var obj = {}; 

      obj['id'] = cartInfos[j].id;
    obj['color'] = cartInfos[j].color;
    obj['price'] = cartInfos[j].qty * value.price;
    products.push(obj);
    
    console.log("nouvel obj :");
  console.table(obj);
  console.table(products);
  }

  var totalPrice = 0;
  for (var property in products) {
    totalPrice += products[property].price;   
  
  }

  console.log(totalPrice);
  let spanTotalPrice = document.getElementById("totalPrice");
  spanTotalPrice.innerHTML = "yes "+totalPrice; 


  // FORMULAIRE

  let firstNameInput = document.getElementById("firstName");
  firstNameInput.addEventListener(
    "change",
    function () {
      errorMsg();
    },
    false
  );

  

}


for (let i = 0; i < cartInfos.length; i++) {
  let id = cartInfos[i].id;
  const priceItem = [];

  fetch("http://localhost:3000/api/products/" + id)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then((value) => {
      createCartElement(value, cartInfos[i], i);

     
    })
    .catch(function (err) {
      // Une erreur est survenue
    });
}
