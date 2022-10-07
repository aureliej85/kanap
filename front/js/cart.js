
for (let i=0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        let objLinea = window.localStorage.getItem(key);
        let cartInfos = JSON.parse(objLinea);
        let id = cartInfos.id;

        fetch("http://localhost:3000/api/products/" +cartInfos.id)
        .then(function(res) {
            if (res.ok) {
              return res.json();
            }
          })
          .then(function(value) {

            let article = document.createElement("article");
            article.setAttribute("class", "cart__item");
            article.setAttribute("data-id", cartInfos.id);
            article.setAttribute("data-color", cartInfos.color);
            
            let divImage = document.createElement("div");
            divImage.setAttribute("class", "cart__item__img");
            divImage.innerHTML = '<img src="'+value.imageUrl+'" alt="'+value.altTxt+'">';

            let divContent = document.createElement("div");
            divContent.setAttribute("class", "cart__item__content");
    

            let divDescr = document.createElement("div");
            divDescr.setAttribute("class", "cart__item__content__description");
            divDescr.innerHTML = '<h2>'+value.name+'</h2> <br> <p>'+cartInfos.color+'</p> <br> <p>'+value.price+'</p>';

            let divSettings = document.createElement("div");
            divSettings.setAttribute("class", "cart__item__content__settings");

           
            document.getElementById("cart__items").append(article);
            
            let selectorArticle = '[data-id="'+cartInfos.id+'"]';
            document.querySelector(selectorArticle).append(divImage);
            document.querySelector(selectorArticle).append(divContent);
            divContent.append(divDescr);
            


        })
        .catch(function(err) {
        // Une erreur est survenue
        });


};

