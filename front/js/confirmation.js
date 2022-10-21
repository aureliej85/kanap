let id = new URLSearchParams(window.location.search).get("orderId");

let orderId = document.getElementById("orderId");
orderId.append(id);