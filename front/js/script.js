/**
 * Display all products in HomePage
 * @param {*} data The Fetch response
 */
function displayProducts(data){
    for (let products of data ) {

        let link = document.createElement("a");
        let urlLink = `./product.html?id=${products._id}`;
        link.setAttribute('href', urlLink);
    
        let article = document.createElement("article");
        article.innerHTML=`<img src='${products.imageUrl}' alt='${products.altTxt}'>`;
    
        let name = document.createElement("h3");
        name.innerHTML = products.name;
    
        let descr = document.createElement("p");
        descr.innerHTML= products.description;
    
        link.append(article);
        article.append(name);
        article.append(descr);
    
        let item = document.getElementById("items");
        item.append(link);
        
       }    
}


// Fetch products from API
fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then((dataResponse) => {
    displayProducts(dataResponse);
  })
  .catch(function(err) {
    console.log("Une erreur est survenue: " + err);
  });
    


   
