```javascript
// =======================
// Firebase Setup
// =======================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =======================
// Firebase Config
// =======================

const firebaseConfig = {
    apiKey: "AIzaSyDaD9acq3GZccK6kd0vZXNlnFXnABQhSxE",
    authDomain: "noah-store-b7a9a.firebaseapp.com",
    projectId: "noah-store-b7a9a",
    storageBucket: "noah-store-b7a9a.firebasestorage.app",
    messagingSenderId: "856449841045",
    appId: "1:856449841045:web:6c75869fb740428aaf289c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// =======================
// عناصر الصفحة
// =======================

const productsContainer =
    document.getElementById("products-container");

const cartItems =
    document.getElementById("cart-items");

const cartCount =
    document.getElementById("cart-count");

const totalPrice =
    document.getElementById("total-price");

const checkoutBtn =
    document.getElementById("checkout-btn");

const form =
    document.getElementById("checkout-form");


// =======================
// السلة
// =======================

let cart = [];
let total = 0;


// =======================
// تحميل المنتجات من Firebase
// =======================

async function loadProducts() {

    if (!productsContainer) return;

    productsContainer.innerHTML = `
        <p style="text-align:center; width:100%;">
            جاري تحميل المنتجات...
        </p>
    `;

    try {

        const productsSnapshot =
            await getDocs(collection(db, "products"));

        productsContainer.innerHTML = "";

        if (productsSnapshot.empty) {

            productsContainer.innerHTML = `
                <p style="text-align:center; width:100%;">
                    لا توجد منتجات حاليًا.
                </p>
            `;

            return;
        }


        productsSnapshot.forEach((doc) => {

            const product = doc.data();

            const name = product.name || "منتج بدون اسم";
            const description = product.description || "";
            const price = Number(product.price) || 0;
            const image = product.image || "images/default.jpg";


            const card = document.createElement("div");

            card.className = "card";


            card.innerHTML = `

                <img
                    src="${image}"
                    alt="${name}"
                    loading="lazy"
                    onerror="this.src='images/default.jpg'"
                >

                <div class="info">

                    <h3>${name}</h3>

                    <p>${description}</p>

                    <span>
                        ${price} جنيه
                    </span>

                    <button
                        class="add-cart"
                        data-name="${name}"
                        data-price="${price}"
                    >

                        <i class="fa-solid fa-cart-plus"></i>

                        أضف إلى السلة

                    </button>

                </div>

            `;


            productsContainer.appendChild(card);

        });


        // ربط أزرار إضافة المنتجات للسلة
        connectCartButtons();


    } catch (error) {

        console.error(
            "Firebase Products Error:",
            error
        );

        productsContainer.innerHTML = `
            <p style="text-align:center; width:100%; color:red;">
                حدث خطأ أثناء تحميل المنتجات.
            </p>
        `;
    }
}


// =======================
// ربط أزرار إضافة للسلة
// =======================

function connectCartButtons() {

    const cartButtons =
        document.querySelectorAll(".add-cart");


    cartButtons.forEach(button => {

        button.addEventListener("click", () => {

            const name =
                button.dataset.name;

            const price =
                Number(button.dataset.price);


            cart.push({
                name: name,
                price: price
            });


            total += price;

            updateCart();

        });

    });

}


// =======================
// تحديث السلة
// =======================

function updateCart() {

    if (!cartItems) return;


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>لا توجد منتجات في السلة.</p>";

    } else {

        cart.forEach((item, index) => {

            const itemDiv =
                document.createElement("div");

            itemDiv.className =
                "cart-item";


            itemDiv.innerHTML = `

                <span>
                    ${item.name}
                </span>

                <span>
                    ${item.price} جنيه
                </span>

                <button
                    class="delete-btn"
                    data-index="${index}"
                >
                    حذف
                </button>

            `;


            cartItems.appendChild(itemDiv);

        });


        // أحداث الحذف

        document
            .querySelectorAll(".delete-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    (e) => {

                        const index =
                            Number(
                                e.target.dataset.index
                            );


                        total -=
                            cart[index].price;


                        cart.splice(index, 1);


                        updateCart();

                    }
                );

            });

    }


    // تحديث عدد المنتجات

    if (cartCount) {

        cartCount.textContent =
            cart.length;

    }


    // تحديث السعر

    if (totalPrice) {

        totalPrice.textContent =
            total;

    }

}


// =======================
// زر إتمام الطلب
// =======================

if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                alert("السلة فارغة.");

                return;

            }


            const checkoutSection =
                document.getElementById(
                    "checkout-section"
                );


            if (checkoutSection) {

                checkoutSection.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


// =======================
// إرسال الطلب إلى Firebase
// =======================

if (form) {

    form.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            if (cart.length === 0) {

                alert(
                    "❌ السلة فارغة! أضف منتجات أولاً."
                );

                return;

            }


            const name =
                document.getElementById("name").value.trim();


            const phone =
                document.getElementById("phone").value.trim();


            const address =
                document.getElementById("address").value.trim();


            const paymentElement =
                document.getElementById("payment");


            const payment =
                paymentElement
                    ? paymentElement.value
                    : "الدفع عند الاستلام";


            try {

                await addDoc(
                    collection(db, "orders"),
                    {

                        customerName: name,

                        phone: phone,

                        address: address,

                        paymentMethod: payment,

                        products: cart,

                        total: total,

                        createdAt: new Date()

                    }
                );


                alert(
                    "✅ تم إرسال طلبك بنجاح."
                );


                // تفريغ الفورم

                form.reset();


                // تفريغ السلة

                cart = [];

                total = 0;


                updateCart();


            } catch (error) {

                console.error(
                    "Firebase Error:",
                    error
                );


                alert(
                    "❌ حدث خطأ أثناء إرسال الطلب: " +
                    error.message
                );

            }

        }
    );

}


// =======================
// تشغيل الموقع
// =======================

// تحميل المنتجات من Firebase

loadProducts();


// تشغيل السلة

updateCart();
```
