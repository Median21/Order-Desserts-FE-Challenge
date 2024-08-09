const menu = document.querySelector(".menu");
const cart = document.querySelector(".cart-container")

let cartArray = []; //Full data of dessert
let cartHTML = "";
let cartTotalPrice = 0;

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



document.body.addEventListener('click', (e) => {
    if (e.target.classList == "add-to-cart" || e.target.classList == "increment inc-dec") {
        fetch("./data.json")
        .then(response => response.json())
        .then(data => addToCart(data, e.target))
        .catch(err => console.log(err))
        console.log("NORMAL")
        console.log(e)
    } else if (e.target.classList == "cart-image") {
        console.log(e.target.parentElement.dataset.id)
        fetch("./data.json")
        .then(response => response.json())
        .then(data => addToCart(data, e.target.parentElement))
        .catch(err => console.log(err))
        console.log("IMG")
        
    } else if (e.target.classList == "decrement inc-dec") {
        decrementItem(e.target)
    } else if (e.target.classList == "delete-img") {
        removeFromCart(e.target.parentElement)
        
    } else if (e.target.classList == "delete") {
        removeFromCart(e.target);
    }


})
     

//ADDSITEM TO CART / Increments~~~~~~~~~~~~~
function addToCart(data, e) {

    const filtered = data.filter(dessert => {
        return e.dataset.id == dessert.id;
    })

    console.log(e.parentElement)
    const item = filtered[0]

    let itemExists = false;

    for (let i = 0; i < cartArray.length; i++) {
        if (item.id == cartArray[i].id) {
            cartArray[i].qty++;
            itemExists =  true;
            e.parentElement.innerHTML =`
            <button class="decrement inc-dec" data-id=${cartArray[i].id}>-</button>${cartArray[i].qty}<button class="increment inc-dec" data-id=${cartArray[i].id}>+</button>`;
            console.log(cartArray[i])
            break;
        }
    }

    if (!itemExists) {
        item.qty = 1;
        cartArray.push(item);
        console.log(cartArray)
        e.offsetParent.offsetParent.children[0].classList.add("highlight-menu")
        e.classList.add("in-cart")
        e.innerHTML = `<button class="decrement inc-dec" data-id=${item.id}>-</button>${item.qty}<button class="increment inc-dec" data-id=${item.id}>+</button>`;
    }

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
                <button class="delete" data-id=${cartItem.id}><img class="delete-img" src="./assets/images/icon-remove-item.svg"></button>
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


//DECREMENTS ITEM~!~~~~~
function decrementItem(e) {
    let indexToDecrement = cartArray.findIndex((element) => element.id == e.dataset.id)
    let isZero = false;

   if (cartArray[indexToDecrement].qty == 1) {
        isZero = true
   }

    cartArray[indexToDecrement].qty--;
    cartTotalPrice -= cartArray[indexToDecrement].price



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
            <div class="cart-item-container">
            <div>
                <h3>${cartItem.name}</h3>
                <span class="qty-span">${cartItem.qty}x @ $${cartItem.price.toFixed(2)} <strong>$${((cartItem.qty * cartItem.price).toFixed(2))}</strong></span>
            </div>
            <div>
                <button class="delete" data-id=${cartItem.id}><img class="delete-img" src="./assets/images/icon-remove-item.svg"/></button>
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
        <button class="confirm-order-btn">Confirm Order</button>`
        
        cart.innerHTML = cartHTML;

    
        if (isZero) {
            e.offsetParent.offsetParent.children[0].classList.remove("highlight-menu")
            removeFromCart(e)
            e.parentElement.classList.remove("in-cart")
            e.parentElement.innerHTML = `
                <img class="cart-image" src="./assets/images/icon-add-to-cart.svg"/>
                Add to Cart
            `
        } else {
            e.parentElement.innerHTML = `
            <button class="decrement inc-dec" data-id=${cartArray[indexToDecrement].id}>-</button>${cartArray[indexToDecrement].qty}<button class="increment inc-dec" data-id=${cartArray[indexToDecrement].id}>+</button>
            `
        }
     
    }
}

//REMOVES ITEM FROM CART~~~~~~~~~~~~~~~~~~
function removeFromCart(e) {
    let buttonToUpdate
    let allDecrements = document.querySelectorAll(".decrement") 

    allDecrements.forEach((button) => {
        if (button.dataset.id == e.dataset.id) {
            console.log(button)
            return buttonToUpdate = button
        }
    })
    
    buttonToUpdate.offsetParent.offsetParent.children[0].classList.remove("highlight-menu")
    buttonToUpdate.parentElement.classList.remove("in-cart")

    buttonToUpdate.parentElement.innerHTML = `
            <img class="cart-image" src="./assets/images/icon-add-to-cart.svg"/>
            Add to Cart
    `


    let indexToBeRemoved = cartArray.findIndex((element) => element.id == e.dataset.id)
    console.log(indexToBeRemoved)
  
    let totalAfterRemove = cartArray[indexToBeRemoved].price * cartArray[indexToBeRemoved].qty  
    cartTotalPrice -= totalAfterRemove;
   
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
            <div class="cart-item-container">
            <div>
                <h3>${cartItem.name}</h3>
                <span class="qty-span">${cartItem.qty}x @ $${cartItem.price.toFixed(2)} <strong>$${((cartItem.qty * cartItem.price).toFixed(2))}</strong></span>
            </div>
            <div>
                <button class="delete" data-id=${cartItem.id}><img class="delete-img" src="./assets/images/icon-remove-item.svg"></button>
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
        <button class="confirm-order-btn">Confirm Order</button>`
        
        cart.innerHTML = cartHTML;

    }
}

