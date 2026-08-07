import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDaD9acq3GZccK6kd0vZXNlnFXnABQhSxE",
    authDomain: "noah-store-b7a9a.firebaseapp.com",
    projectId: "noah-store-b7a9a",
    storageBucket: "noah-store-b7a9a.firebasestorage.app",
    messagingSenderId: "856449841045",
    appId: "1:856449841045:web:6c75869fb740428aaf289c"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const message = document.getElementById("message");


loginBtn.addEventListener("click", async () => {

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {

        message.style.color = "red";
        message.textContent =
            "من فضلك اكتب الإيميل وكلمة المرور.";

        return;
    }

    message.style.color = "#333";
    message.textContent = "جاري تسجيل الدخول...";

    try {

        await setPersistence(
            auth,
            browserLocalPersistence
        );

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        message.style.color = "green";
        message.textContent =
            "تم تسجيل الدخول بنجاح ✅";

        window.location.replace("dashboard.html");

    } catch (error) {

        console.error("Login Error:", error);

        message.style.color = "red";

        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/user-not-found"
        ) {

            message.textContent =
                "الإيميل أو كلمة المرور غير صحيحة ❌";

        } else {

            message.textContent =
                "حدث خطأ: " + error.message;

        }

    }

});