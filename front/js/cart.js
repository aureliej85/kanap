let objLinea = window.localStorage.getItem("allEntries");
let cartInfos = JSON.parse(objLinea);
console.table(cartInfos);
let productsInCart = [];

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

function totalPrice(data, cartItem){
  const prices = data.map(item => {
    var arrayPrice = {};
    arrayPrice["key"] = item._id;
    arrayPrice["price"] = item.price;
    return arrayPrice;
  });
  console.table(prices);


  // PRIX TOTAL
  let current_index = prices.findIndex((product) => { return product.key == cartItem.id;
  });

  let itemInCart = {};

  itemInCart['id'] = cartItem.id;
  itemInCart['color'] = cartItem.color;
  itemInCart['price'] = cartItem.qty * prices[current_index].price;
  productsInCart.push(itemInCart);

  console.log("productsInCart :");
  console.table(productsInCart);

  
  var totalPrice = 0;
  for (var property in productsInCart) {
    totalPrice += productsInCart[property].price;   
  
  };

  console.log("totalPrice" +totalPrice);
  let spanTotalPrice = document.getElementById("totalPrice");
  spanTotalPrice.innerHTML = totalPrice;

}

function checkForm(){
  let regexStrings = /^[A-Za-z]{2,}$/;
  let regexAddress = /^([0-9]*) ?([a-zA-Z,\. ]*) ?([0-9]{5})$/;
  let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  let productsArray = [];
  for (let i=0; i < cartInfos.length; i ++){
    productsArray.push(cartInfos[i].id);
  }

  let contactObj = {
    "firstName" : "prénom",
    "lastName" : "nom",
    "address" : "adresse",
    "city" : "ville",
    "email" : "email",
  };

    let firstNameInput = document.getElementById("firstName");
    firstNameInput.addEventListener(
      "change",
      function () {       
        let firstName = firstNameInput.value;
        let firstNameMsg = document.getElementById("firstNameErrorMsg"); 
        !regexStrings.test(firstName) ? firstNameMsg.innerHTML = "Le prénom ne doit contenir que des lettres (minimum 2)" : (firstNameMsg.innerHTML = " ") && (contactObj.firstName = firstName) ; 
      },
      false
    );

    let lastNameInput = document.getElementById("lastName");
    lastNameInput.addEventListener(
      "change",
      function () {   
        let lastName = lastNameInput.value;
        let lastNameMsg = document.getElementById("lastNameErrorMsg");  
        !regexStrings.test(lastName) ? lastNameMsg.innerHTML = "Le nom ne doit contenir que des lettres (minimum 2)" : (lastNameMsg.innerHTML = " ") && (contactObj.lastName = lastName) ; 
      },
      false
    );

    let addressInput = document.getElementById("address");
    addressInput.addEventListener(
      "change",
      function () {     
        let address = addressInput.value;
        let addressMsg = document.getElementById("addressErrorMsg");       
        !regexAddress.test(address) ? addressMsg.innerHTML = "Merci de saisir une adresse valide (ex: 7 rue du temple 77580)" : (addressMsg.innerHTML = " ") && (contactObj.address = address)  ; 
      },
      false
    );

    let cityInput = document.getElementById("city");
    cityInput.addEventListener(
      "change",
      function () {  
        let city = cityInput.value;
        let cityMsg = document.getElementById("cityErrorMsg");
        !regexStrings.test(city) ? cityMsg.innerHTML = "La ville ne doit contenir que des lettres (minimum 2)" : (cityMsg.innerHTML = " ") && (contactObj.city = city)  ; 
      },
      false
    );

    let emailInput = document.getElementById("email");
    emailInput.addEventListener(
      "change",
      function () {       
        let email = emailInput.value;
        let emailMsg = document.getElementById("emailErrorMsg");           
        !regexEmail.test(email) ? emailMsg.innerHTML = "Merci de saisir une adresse email valide (ex: xyz@email.com)" : (emailMsg.innerHTML = " ") && (contactObj.email = email)  ; 
      },
      false
    );


    let orderBtn = document.getElementById("order");
    orderBtn.addEventListener(
      "click",
      function (e) {
        e.preventDefault();

        console.log("contactObj :");
        console.table(contactObj);
        console.log("productArray :");
        console.table(productsArray);
        
        if((!regexStrings.test(firstNameInput.value)) || (!regexStrings.test(lastNameInput.value)) || (!regexAddress.test(addressInput.value)) || (!regexStrings.test(cityInput.value)) || (!regexEmail.test(emailInput.value)) ){

          alert("Merci de renseigner le formulaire correctement");

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
          }).then(async (response) => {
            try {
              let respOrder = await response.json();
              let orderId = respOrder.orderId;
              localStorage.clear();
              window.location.assign("confirmation.html?orderId=" + orderId);
              console.log("response du POST");
              console.table(response);
          } catch (e) {
            console.log(e);
          }
          });

        }
      },
      false
    );
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
       
  }


  fetch("http://localhost:3000/api/products/")
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then((response) => {
         
        for(let i=0; i <cartInfos.length ; i++){
          let id = cartInfos[i].id;                 

          fetch("http://localhost:3000/api/products/"+id)
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

          totalPrice(response, cartInfos[i]);

        }
      
     
    })
    .catch(function (err) {
      // Une erreur est survenue
    });

    checkForm();