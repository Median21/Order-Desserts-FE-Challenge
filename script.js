const menu = document.querySelector(".menu");
const cart = document.querySelector(".cart-container")

fetch("./data.json")
.then(response => response.json())
.then(data => renderMenu(data))


function renderMenu(data) {
    data.forEach((food) => {
        const twoDecimals = food.price.toFixed(2)

        let responsiveImage;
        
        if (window.innerWidth >= 768 && window.innerWidth < 1440) {
            responsiveImage = food.image.tablet
        } else if (window.innerWidth >= 1440) {
            responsiveImage = food.image.desktop
        } else {
            responsiveImage = food.image.mobile
        }
        
        menu.innerHTML += 
        `
        <div class="outer-picture-container">
            <div class="picture-container">
                <img class="food-image" src=${responsiveImage}>

                <div class="button-container">
                    <button class="add-to-cart" data-id=${food.id}>
                    <img class="cart-image" src="./assets/images/icon-add-to-cart.svg"/>
                    Add to Cart
                    </button>
                </div>
            </div>
        
            <p class="category">${food.category}</p>
            <h4 class="food-name">${food.name}</h4>
            <h5 class="price">$${twoDecimals}</h5>
        </div>
        `
    })
    cart.innerHTML+= `
                <h2>Your Cart (0)</h2>
                <img class="empty-cart-image" src="./assets/images/illustration-empty-cart.svg"/>
                <p>Your added items will appear here</p>
        `
}


let cartArray = []; //Full data of dessert
let all = "";

document.body.addEventListener('click', (e) => {
    if (e.target) {
        fetch("./data.json")
        .then(response => response.json())
        .then(data => dessertData(data))
        .catch(err => console.log(err))
    }

    function dessertData(data) {
        const filtered = data.filter(dessert => {
            return e.target.dataset.id == dessert.id;
        })

       const item = filtered[0]

        let itemExists = false;
    
        for (let i = 0; i < cartArray.length; i++) {
            if (item.id == cartArray[i].id) {
                cartArray[i].qty++;
                itemExists =  true;
                break;
            }
        }

        if (!itemExists) {
            item.qty = 1;
            cartArray.push(item);
        }

        all = `<h2>Your Cart(${cartArray.length})</h2>`

        cartArray.forEach((cartItem) => {
            all += `
            <h1>${cartItem.name}</h1>
            <span>${cartItem.qty}x @ ${cartItem.price.toFixed(2)} <strong>${((cartItem.qty * cartItem.price).toFixed(2))}</strong></span>
            `
        })
    
        cart.innerHTML = all;
    }
})
     
