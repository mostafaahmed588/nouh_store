// =======================
// Firebase App
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// =======================
// Firebase Authentication
// =======================
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// =======================
// Firebase Firestore
// =======================
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
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

// =======================
// تشغيل Firebase
// =======================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =======================
// عناصر الصفحة
// =======================
const form = document.getElementById("product-form");
const productsContainer = document.getElementById("admin-products");
const message = document.getElementById("product-message");
const logoutBtn = document.getElementById("logout-btn");

// =======================
// التأكد من تسجيل الدخول (بدون طرد مفاجئ)
// =======================
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("تم تسجيل الدخول:", user.email);
        loadProducts();
    } else {
        console.log("جاري التحقق من حالة المستخدم...");
        setTimeout(() => {
            if (!auth.currentUser) {
                window.location.replace("admin.html");
            }
        }, 1200);
    }
});

// =======================
// إضافة منتج
// =======================
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("product-name").value.trim();
        const price = Number(document.getElementById("product-price").value);
        const image = document.getElementById("product-image").value.trim();
        const description = document.getElementById("product-description").value.trim();

        // التحقق من البيانات
        if (!name || !price || !image) {
            message.style.color = "red";
            message.textContent = "من فضلك املأ اسم المنتج والسعر ورابط الصورة.";
            return;
        }

        message.style.color = "#333";
        message.textContent = "جاري إضافة المنتج...";

        try {
            await addDoc(collection(db, "products"), {
                name: name,
                price: price,
                image: image,
                description: description,
                createdAt: new Date()
            });

            message.style.color = "green";
            message.textContent = "تم إضافة المنتج بنجاح ✅";

            form.reset();
            loadProducts();

        } catch (error) {
            console.error("خطأ في إضافة المنتج:", error);
            message.style.color = "red";
            message.textContent = "حدث خطأ أثناء إضافة المنتج ❌: " + error.message;
        }
    });
}

// =======================
// تحميل المنتجات
// =======================
async function loadProducts() {
    if (!productsContainer) return;

    productsContainer.innerHTML = "<p>جاري تحميل المنتجات...</p>";

    try {
        const snapshot = await getDocs(collection(db, "products"));

        productsContainer.innerHTML = "";

        if (snapshot.empty) {
            productsContainer.innerHTML = "<p>لا توجد منتجات حتى الآن.</p>";
            return;
        }

        snapshot.forEach((item) => {
            const product = item.data();
            const div = document.createElement("div");
            div.className = "admin-product";

            div.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                <div class="admin-product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description || ""}</p>
                    <strong>${product.price} جنيه</strong>
                    <button class="delete-product" data-id="${item.id}" style="background: red; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-top: 5px;">
                        حذف المنتج
                    </button>
                </div>
            `;

            productsContainer.appendChild(div);
        });

        // =======================
        // أزرار حذف المنتجات
        // =======================
        document.querySelectorAll(".delete-product").forEach((button) => {
            button.addEventListener("click", async () => {
                const id = button.dataset.id;

                if (!confirm("هل تريد حذف المنتج؟")) {
                    return;
                }

                try {
                    await deleteDoc(doc(db, "products", id));
                    loadProducts();
                } catch (error) {
                    console.error("خطأ في حذف المنتج:", error);
                    alert("حدث خطأ أثناء حذف المنتج");
                }
            });
        });

    } catch (error) {
        console.error("خطأ في تحميل المنتجات:", error);
        productsContainer.innerHTML = "<p>حدث خطأ أثناء تحميل المنتجات.</p>";
    }
}

// =======================
// تسجيل الخروج
// =======================
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.replace("admin.html");
        } catch (error) {
            console.error("خطأ في تسجيل الخروج:", error);
        }
    });
}