let lsProducts = window.localStorage.getItem("allEntries");
let cartInfos = JSON.parse(lsProducts);
console.table(cartInfos);
let productsInCart = [];


/**
 * Delete product from cart and localStorage
 * @param {string} idProduct from localStorage (cartInfos)
 * @param {string} colorProduct from localStorage (cartInfos)
 * @param {*} index 
 */
function deleteEntry(idProduct, colorProduct, index) {
  let findProduct = cartInfos.find(
    (cart_product) =>
      idProduct == cart_product.id && colorProduct == cart_product.color
  );

  if (findProduct) {
    cartInfos.splice(index, 1);
  }

  item = JSON.stringify(cartInfos);
  localStorage.setItem("allEntries", item);

  let thisArticle = document.querySelector(`[data-id='${idProduct}']`);
  thisArticle.remove();

  //location.reload();
}


/**
 * Update the quantity of a product in the cart and localStorage
 * @param {*} idProduct 
 * @param {*} colorProduct 
 * @param {*} qtyProduct 
 * @param {*} newQtyProduct 
 * @param {*} index 
 */
function changeQuantity(
  idProduct,
  colorProduct,
  qtyProduct,
  newQtyProduct,
  index
) {

  let findProduct = cartInfos.find(
    (cart_product) =>
      idProduct == cart_product.id && colorProduct == cart_product.color
  );

  if (findProduct) {
    qtyProduct = newQtyProduct;
    cartInfos[index].qty = Number(newQtyProduct);
    cartInfos.splice(index, 1, cartInfos[index]);
  }

  item = JSON.stringify(cartInfos);
  localStorage.setItem("allEntries", item);

  //location.reload();
  
}

/**
 * Sum the prices and add to the DOM
 * @param {*} data 
 * @param {*} cartItem 
 */
function totalPrice(data, cartItem) {
  // Map ids and prices from API Products (Fetch :responseProducts)
  // Create an array to get prices
  const pricesArray = data.map((item) => {
    let priceObject = {};
    priceObject["key"] = item._id;
    priceObject["price"] = item.price;
    return priceObject;
  });
  console.log('pricesArray');
  console.table(pricesArray);

 // Find product price thanks to "currentIndex"
 // Create new object with price*qty value (push in productsInCart array)
  let currentIndex = pricesArray.findIndex((product) => {
    return product.key == cartItem.id;
  });
  let itemInCart = {};

  itemInCart["id"] = cartItem.id;
  itemInCart["color"] = cartItem.color;
  itemInCart["price"] = cartItem.qty * pricesArray[currentIndex].price;
  productsInCart.push(itemInCart);

  console.log('productsInCart');
  console.table(productsInCart);

// Add all price*qty value pushed in productsInCart array
  var totalPrice = 0;
  for (var property in productsInCart) {
    totalPrice += productsInCart[property].price;
  }

// Insert total price inside the DOM
  let spanTotalPrice = document.getElementById("totalPrice");
  spanTotalPrice.innerHTML = totalPrice;
}

/**
 * update Total Price after deleting a product
 * @param {*} data 
 * @param {*} cartItem 
 * @param {*} index 
 */
function updateTotalPrice(data, cartItem, index){
 
  let newProductsInCart = productsInCart.filter((product) => {
    return product.key == cartItem.id;
   });
  
 productsInCart.splice(index, 1);
  console.log('productsInCart after delete smt :');
  console.table(productsInCart);

  var newTotalPrice = 0;
  for (let j = 0; j < productsInCart.length ; j ++) {
    newTotalPrice += productsInCart[j].price;
  }

// Refresh new total price inside the DOM
  let spanTotalPrice = document.getElementById("totalPrice");
  spanTotalPrice.innerHTML = newTotalPrice;

}

/**
 * Refreh total price after quantity change
 * @param {*} data 
 * @param {*} cartItem 
 * @param {*} index 
 */
function refreshTotalPrice(value, cartItem, newQty){
  let newTotalPrice = 0;
  for (let findPrice in productsInCart){
    if(productsInCart[findPrice].id == cartItem.id){
      productsInCart[findPrice].qty = parseInt(newQty);
      productsInCart[findPrice].price = value.price * parseInt(newQty);
    }
    newTotalPrice += productsInCart[findPrice].price;
  }
  let spanTotalPrice = document.getElementById("totalPrice");
  spanTotalPrice.innerHTML = newTotalPrice;


}

/**
 * Display total Price 
 * @param {*} cartInfos 
 */
function totalArticle(cartInfos){
  var totalQty = 0;
  for (var property in cartInfos) {
    totalQty += cartInfos[property].qty;
  }
  let spanTotalQty = document.getElementById("totalQuantity");
  spanTotalQty.innerHTML = totalQty;

}

function checkForm() {
  let regexStrings = /^[A-Za-z]{2,}$/;
  let regexAddress = /^([0-9]*) ?([a-zA-Z,\. ]*) ?([0-9]{5})$/;
  let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  let productsArray = [];
  for (let i = 0; i < cartInfos.length; i++) {
    productsArray.push(cartInfos[i].id);
  }

  let contactObj = {
    firstName: "prénom",
    lastName: "nom",
    address: "adresse",
    city: "ville",
    email: "email",
  };

  let firstNameInput = document.getElementById("firstName");
  firstNameInput.addEventListener(
    "change",
    function () {
      let firstName = firstNameInput.value;
      let firstNameMsg = document.getElementById("firstNameErrorMsg");
      !regexStrings.test(firstName) ? (firstNameMsg.innerHTML ="Le prénom ne doit contenir que des lettres (minimum 2)") : (firstNameMsg.innerHTML = " ") && (contactObj.firstName = firstName);
    },
    false
  );

  let lastNameInput = document.getElementById("lastName");
  lastNameInput.addEventListener(
    "change",
    function () {
      let lastName = lastNameInput.value;
      let lastNameMsg = document.getElementById("lastNameErrorMsg");
      !regexStrings.test(lastName)
        ? (lastNameMsg.innerHTML =
            "Le nom ne doit contenir que des lettres (minimum 2)")
        : (lastNameMsg.innerHTML = " ") && (contactObj.lastName = lastName);
    },
    false
  );

  let addressInput = document.getElementById("address");
  addressInput.addEventListener(
    "change",
    function () {
      let address = addressInput.value;
      let addressMsg = document.getElementById("addressErrorMsg");
      !regexAddress.test(address)
        ? (addressMsg.innerHTML =
            "Merci de saisir une adresse valide (ex: 7 rue du temple 77580)")
        : (addressMsg.innerHTML = " ") && (contactObj.address = address);
    },
    false
  );

  let cityInput = document.getElementById("city");
  cityInput.addEventListener(
    "change",
    function () {
      let city = cityInput.value;
      let cityMsg = document.getElementById("cityErrorMsg");
      !regexStrings.test(city)
        ? (cityMsg.innerHTML =
            "La ville ne doit contenir que des lettres (minimum 2)")
        : (cityMsg.innerHTML = " ") && (contactObj.city = city);
    },
    false
  );

  let emailInput = document.getElementById("email");
  emailInput.addEventListener(
    "change",
    function () {
      let email = emailInput.value;
      let emailMsg = document.getElementById("emailErrorMsg");
      !regexEmail.test(email)
        ? (emailMsg.innerHTML =
            "Merci de saisir une adresse email valide (ex: xyz@email.com)")
        : (emailMsg.innerHTML = " ") && (contactObj.email = email);
    },
    false
  );

  let orderBtn = document.getElementById("order");
  orderBtn.addEventListener(
    "click",
    function (e) {
      e.preventDefault();

      if (
        !regexStrings.test(firstNameInput.value) ||
        !regexStrings.test(lastNameInput.value) ||
        !regexAddress.test(addressInput.value) ||
        !regexStrings.test(cityInput.value) ||
        !regexEmail.test(emailInput.value)
      ) {
        alert("Merci de renseigner le formulaire correctement");
      } else if (productsArray.length === 0) {
        alert("Vous n'avez pas d'article dans votre panier");
      } else {
        fetch("http://localhost:3000/api/products/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contact: contactObj,
            products: productsArray,
          }),
        }).then(async (responseProducts) => {
          try {
            let respOrder = await responseProducts.json();
            let orderId = respOrder.orderId;
            localStorage.clear();
            window.location.assign("confirmation.html?orderId=" + orderId);
            console.log("responseProducts du POST");
            console.table(responseProducts);
          } catch (e) {
            console.log(e);
          }
        });
      }
    },
    false
  );
}


function createCartElement(value, cartItem, index, data) {
  let article = document.createElement("article");
  article.setAttribute("class", "cart__item");
  article.setAttribute("data-id", cartItem.id);
  article.setAttribute("data-color", cartItem.color);
  article.setAttribute("id", "testons");

  let divImage = document.createElement("div");
  divImage.setAttribute("class", "cart__item__img");
  divImage.innerHTML = `<img src="${value.imageUrl}" alt="${value.altTxt}">`;

  let divContent = document.createElement("div");
  divContent.setAttribute("class", "cart__item__content");

  let divDescr = document.createElement("div");
  divDescr.setAttribute("class", "cart__item__content__description");

  divDescr.innerHTML = `<h2>${value.name}</h2> <br> <p>${cartItem.color}</p> <br> <p>${value.price} €</p>`;

  let divSettings = document.createElement("div");
  divSettings.setAttribute("class", "cart__item__content__settings");

  // Quantité
  let divSetQty = document.createElement("div");
  divSetQty.setAttribute("class", "cart__item__content__settings__quantity");
  let pQuantity = document.createElement("p");
  pQuantity.innerHTML = "Qté :";
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
      if ((newQty > 100) || (newQty < 1)){
        alert('Merci de renseigner une quantité entre 0 et 100');
      
      } else {
      changeQuantity(cartItem.id, cartItem.color, cartItem.qty, newQty, index);
      totalArticle(cartInfos);
      refreshTotalPrice(value, cartItem, newQty);
     
      console.log('productIncart after change qty');
      console.table(productsInCart);
      }
          
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
      totalArticle(cartInfos);
      //totalPrice(data, cartItem);
      updateTotalPrice(data, cartItem, index);

      
    },
    false
  );

  document.getElementById("cart__items").append(article);

  article.appendChild(divImage);
  article.appendChild(divContent);
  divContent.append(divDescr);
  divContent.append(divSettings);
  divSettings.append(divSetQty);
  divSetQty.append(pQuantity);
  divSetQty.append(inputQuantity);
  divSettings.append(divSetDelete);
  divSetDelete.append(pDelete);

}


// Fetch all products from API
fetch("http://localhost:3000/api/products/")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then((responseProducts) => {
    if (cartInfos.length === 0) {

      let emptyCartMsg = document.querySelector("h1");
      emptyCartMsg.innerHTML = "Le panier est vide";

    } else {
      
      for (let i = 0; i < cartInfos.length; i++) {
        let id = cartInfos[i].id;

        // Fetch product details from API
        fetch("http://localhost:3000/api/products/" + id)
          .then(function (res) {
            if (res.ok) {
              return res.json();
            }
          })
          .then((dataResponse) => {
            createCartElement(dataResponse, cartInfos[i], i, responseProducts);
          })
          .catch(function (err) {
            console.log("Une erreur est survenue: " + err);
          });

        totalArticle(cartInfos);
        totalPrice(responseProducts, cartInfos[i]);
      }
    }
  })
  .catch(function (err) {
    console.log("Une erreur est survenue: " + err);
  });

checkForm();


