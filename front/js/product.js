var str = window.location.href;
var url = new URL(str);
var id = url.searchParams.get("id");


fetch("http://localhost:3000/api/products/" + id)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {

    let image =
      '<img src="' + value.imageUrl + '" alt="' + value.altTxt + '"></img>';
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
    
    
    // Fonction pour save dans localStorage et aller sur page cart.html
    function stock() {
        var colorPick = document.getElementById("colors").value;
        var qtyPick = document.getElementById("quantity").value;

        let productItems = {
            id: id,
            color: colorPick,
            qty: qtyPick,
        };

        let obj= id+colorPick; //Permet d'avoir des clés différentes sinon id s'écrasent
       
        // On récupère la quantité initiale
        let obLinea = window.localStorage.getItem(obj);
        let productInfo = JSON.parse(obLinea);
        let oldQty = (productInfo != null) ? productInfo.qty : 0;


        // Loop dans localStorage
        for (let i=0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
        
                if (key === obj){
                    let objLinea = window.localStorage.getItem(key);
                    let productInfos = JSON.parse(objLinea);

                    if(productInfos.color === productItems.color){
                        productItems.qty = parseInt(oldQty) + parseInt(productItems.qty);
                        window.localStorage.setItem(obj, JSON.stringify(productItems));
                    } else {
                        window.localStorage.setItem(obj, JSON.stringify(productItems));
                    }

                } else {
                    window.localStorage.setItem(obj, JSON.stringify(productItems));
                }
        }


        location.href = "http://127.0.0.1:5500/front/html/cart.html";  
    }

    const bouton = document.getElementById("addToCart");
    bouton.addEventListener("click", stock);

  })
  .catch(function (err) {
    // Une erreur est survenue
  });
