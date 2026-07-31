// =======================
// Firebase Setup
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const cartButtons = document.querySelectorAll(".add-cart");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalPrice = document.getElementById("total-price");

let cart = [];
let total = 0;

// =======================
// إضافة منتج للسلة
// =======================
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

// =======================
// تحديث السلة وإضافة حدث الحذف
// =======================
function updateCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>لا توجد منتجات في السلة.</p>";
    } else {
        cart.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "cart-item";
            itemDiv.innerHTML = `
                <span>${item.name}</span>
                <span>${item.price} جنيه</span>
                <button class="delete-btn" data-index="${index}">حذف</button>
            `;
            cartItems.appendChild(itemDiv);
        });

        // ربط أحداث الحذف داخل الموديول
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = Number(e.target.dataset.index);
                total -= cart[index].price;
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    cartCount.textContent = cart.length;
    totalPrice.textContent = total;
}

// =======================
// زر التمرير إلى قسم إتمام الطلب
// =======================
const checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("السلة فارغة.");
            return;
        }

        const checkoutSection = document.getElementById("checkout-section");
        if (checkoutSection) {
            checkoutSection.scrollIntoView({ behavior: "smooth" });
        }
    });
}

// =======================
// إرسال الطلب إلى Firebase
// =======================
const form = document.getElementById("checkout-form");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert("❌ السلة فارغة! اضف منتجات أولاً قبل إتمام الطلب.");
            return;
        }

        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("address").value;
        const payment = document.getElementById("payment") ? document.getElementById("payment").value : "الدفع عند الاستلام";

        try {
            await addDoc(collection(db, "orders"), {
                customerName: name,
                phone: phone,
                address: address,
                paymentMethod: payment,
                products: cart,
                total: total,
                createdAt: new Date()
            });

            alert("✅ تم إرسال طلبك بنجاح.");

            form.reset();
            cart = [];
            total = 0;
            updateCart();

        } catch (error) {
            console.error("Firebase Error: ", error);
            alert("❌ حدث خطأ أثناء إرسال الطلب: " + error.message);
        }
    });
}

// =======================
// تشغيل السلة عند فتح الصفحة
// =======================
updateCart();