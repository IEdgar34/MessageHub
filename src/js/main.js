import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update, push, onChildAdded } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";

import { search } from "./modules/search";
import { registration } from "./modules/registration";
import { logininOut } from "./modules/logininOut";
import { validate } from "./modules/inputsvalidate";
import { notification } from "./modules/notification";
import { newChat } from "./modules/newcahat";
import { chat } from "./modules/chatstart";
import { setmessage } from "./modules/setmessage";
import { getChat } from "./modules/getchat";
import { cleaner } from "./modules/clean";
import { validationRules } from "./modules/validationrules";

/* import "../css/style.css"; */
document.addEventListener("DOMContentLoaded", () => {
    const logininWrap = document.querySelector(".loginin__wrap");
    const logoutWrap = document.querySelector(".logout__wrap");
    const wrapper = document.querySelector(".chat__wrapper");

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAm4FIpmTq7ScBxHHguXclYCAQPYAUAOys",
        authDomain: "chat-39b72.firebaseapp.com",
        databaseURL: "https://chat-39b72-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "chat-39b72",
        storageBucket: "chat-39b72.appspot.com",
        messagingSenderId: "720352596482",
        appId: "1:720352596482:web:694f46c4fe9efbbe974d1b",
    };
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    /*   const database = getDatabase(app); */
    const db = getDatabase();
    const auth = getAuth(app);
    search(ref, db, onValue, auth, onAuthStateChanged);
    logininOut(auth, signOut, signInWithEmailAndPassword, notification, validationRules, onAuthStateChanged);
    registration(createUserWithEmailAndPassword, auth, getDatabase, set, ref, notification, validationRules);
    validate(validationRules);
    newChat(auth, set, db, ref, onValue, onAuthStateChanged, cleaner, onChildAdded);
    chat(db, auth, ref, onAuthStateChanged, onValue, getChat, cleaner);
    setmessage(db, update, auth, ref, onAuthStateChanged, push);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            logininWrap.style.display = "none";
            logoutWrap.style.display = "flex";

            // ...
        } else {
            logininWrap.style.display = "flex";
            logoutWrap.style.display = "none";
        }
    });
    const open = document.querySelector(".search__open");
    const bar = document.querySelector(".bar");
    open.addEventListener("click", (e) => {
        if (e.target.classList.contains("search__open_active")) {
            open.classList.remove("search__open_active");
            bar.classList.remove("bar_active");
        } else {
            open.classList.add("search__open_active");
            bar.classList.add("bar_active");
        }
    });
    let body = document.querySelector("body");
    function setVh() {
        let vh = window.innerHeight * 0.01;

        document.documentElement.style.setProperty("--vh", `${vh}px`);
        wrapper.style.setProperty("--vh", `${vh}px`);
        bar.style.setProperty("--vh", `${vh}px`);
        document.body.style.setProperty("--vh", `${vh}px`);
    }

    // Вызываем функцию при загрузке страницы
    setVh();

    // Также обновляем значение при изменении размеров экрана
    window.addEventListener("resize", setVh);
    //
    const notif = document.querySelector(".notification");
    notif.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("notification__close")) {
            notif.style.display = "none";
        }
    });
    if (!localStorage.getItem("notif").trim()) {
        notification();
    }
    function notification() {
        setTimeout(() => {
            notif.style.display = "block";
            localStorage.setItem("notif", true);
        }, 3000);
    }
});
