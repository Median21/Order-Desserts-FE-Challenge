const menu = document.querySelector(".menu");
const cart = document.querySelector(".cart-container")

fetch("./data.json")
.then(response => response.json())
.then(data => renderMenu(data))

let cartArray = []; //Full data of dessert
let cartHTML = "";
let cartTotalPrice = 0;

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
                    <button class="add-to-cart" data-id=${food.id} data-incart=${false}>
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




//ADDS ITEM TO CART~~~~~~~~~~~~~
document.body.addEventListener('click', (e) => {
    if (e.target.classList == "add-to-cart") {
        
      
    
        fetch("./data.json")
        .then(response => response.json())
        .then(data => dessertData(data))
        .catch(err => console.log(err))
    } else if (e.target.classList == "delete") {
        removeFromCart();
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
                e.target.textContent = cartArray[i].qty;
                break;
            }
        }

        if (!itemExists) {
            item.qty = 1;
            cartArray.push(item);
            console.log(cartArray)
            e.target.textContent = item.qty;
        }


/* 
            e.target.dataset.incart = "true";
            e.target.classList.add("in-cart") */

           
         /*    console.log(e.target)
            e.target.offsetParent.offsetParent.firstElementChild.classList.add("in-cart") */




        let totalCart = 0;
        
        cartArray.forEach((item) => {
            totalCart += item.qty
        })

        cartHTML = `<h2>Your Cart (${totalCart})</h2>`

        cartTotalPrice = 0;
        
        cartArray.forEach((cartItem) => {
            //cTP = 7*1 + 7*2 
            cartTotalPrice += cartItem.qty * cartItem.price
            cartHTML += `
            <div class="cart-item-container">
                <div>
                    <h3>${cartItem.name}</h3>
                    <span class="qty-span">${cartItem.qty}x @ $${cartItem.price.toFixed(2)} <strong>$${((cartItem.qty * cartItem.price).toFixed(2))}</strong></span>
                </div>
                <div>
                    <button class="delete" data-id=${cartItem.id}><img class="t" src="./assets/images/icon-remove-item.svg"></button>
                </div>
            </div>
             <hr />
            `
        })


    
        cartHTML += `
        <div class="order-total">
            <h4>Order Total</h4>
            <h3>$${cartTotalPrice.toFixed(2)}</h3>
        </div>
        <div class="carbon-neutral">
            <p><img src="assets/images/icon-carbon-neutral.svg"></img>This is a carbon-neutral delivery</p>
        </div>
        <button class="confirm-order-btn">Confirm Order</button>
        `
        

        cart.innerHTML = cartHTML;
    }





//REMOVES ITEM FROM CART~~~~~~~~~~~~~~~~~~
    function removeFromCart() {
        let indexToBeRemoved = cartArray.findIndex((element) => element.id == e.target.dataset.id)
        console.log(indexToBeRemoved)
      
        let totalAfterRemove = cartArray[indexToBeRemoved].price * cartArray[indexToBeRemoved].qty  
        cartTotalPrice -= totalAfterRemove 
       
        cartArray.splice(indexToBeRemoved, 1)


        let totalCart = 0;

        cartArray.forEach((item) => {
            totalCart += item.qty
        })
        
        if (cartArray.length == 0) {
            cart.innerHTML = `
            <h2>Your Cart (0)</h2>
            <img class="empty-cart-image" src="./assets/images/illustration-empty-cart.svg"/>
            <p>Your added items will appear here</p>
            `
            cartTotalPrice = 0;
        } else {
            cartHTML = `<h2>Your Cart (${totalCart}) </h2>`
            cartArray.forEach((cartItem) => {   
                cartHTML += `
                <h3>${cartItem.name}</h3>
                <span>${cartItem.qty}x @ ${cartItem.price.toFixed(2)} <strong>${((cartItem.qty * cartItem.price).toFixed(2))}</strong></span>
                <button class="delete" data-id=${cartItem.id}>X</button>
                <hr />
                `
            })

            cartHTML += `<h4>Total: ${cartTotalPrice.toFixed(2)}</h4>`
            
            cart.innerHTML = cartHTML;
        }
    }
})
     
