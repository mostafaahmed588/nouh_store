// عناصر الصفحة
const cartButtons = document.querySelectorAll(".add-cart");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalPrice = document.getElementById("total-price");

let cart = [];
let total = 0;

// إضافة منتج للسلة
cartButtons.forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        cart.push({
            name,
            price
        });

        total += price;

        updateCart();

    });

});

// تحديث السلة
function updateCart() {

    cartItems.innerHTML = "";

    if(cart.length === 0){

        cartItems.innerHTML = "<p>لا توجد منتجات في السلة.</p>";

    }else{

        cart.forEach((item,index)=>{

            cartItems.innerHTML += `

            <div class="cart-item">

                <span>${item.name}</span>

                <span>${item.price} جنيه</span>

                <button onclick="removeItem(${index})">

                حذف

                </button>

            </div>

            `;

        });

    }

    cartCount.innerHTML = cart.length;

    totalPrice.innerHTML = total;

}

// حذف منتج
function removeItem(index){

    total -= cart[index].price;

    cart.splice(index,1);

    updateCart();

}

// زر إتمام الطلب
const checkoutBtn = document.getElementById("checkout-btn");

checkoutBtn.addEventListener("click",()=>{

    if(cart.length===0){

        alert("السلة فارغة.");

        return;

    }

    document
    .getElementById("checkout-section")
    .scrollIntoView({

        behavior:"smooth"

    });

});

// إرسال الطلب
const form = document.getElementById("checkout-form");

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const name=document.getElementById("name").value;

    const phone=document.getElementById("phone").value;

    const address=document.getElementById("address").value;

    alert(

`شكراً ${name}

تم استلام طلبك بنجاح.

سيتم التواصل معك على الرقم:

${phone}`

);

    form.reset();

    cart=[];

    total=0;

    updateCart();

});