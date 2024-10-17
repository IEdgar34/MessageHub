export const logininOut = (auth, signOut, signInWithEmailAndPassword, notification, validationRules, onAuthStateChanged) => {
    const logininFormOpen = document.querySelector(".loginin");
    const formLoginInClose = document.querySelector(".formlog__close");
    const formLoginInSend = document.querySelector(".formlog__send");
    const formLoginInWrap = document.querySelector(".form__log");
    const formLogininData = document.querySelector(".form__log-data");
    const logOutBtn = document.querySelector(".logout");
    const inputs = document.querySelectorAll(".form__log-data input");
    const bar = document.querySelector(".bar");
    const searchOpen = document.querySelector(".search__open");

    let c = true;
    //
    logininFormOpen.addEventListener("click", () => formLoginInOpenCloseTogle(formLoginInWrap));
    formLoginInClose.addEventListener("click", () => formLoginInOpenCloseTogle(formLoginInWrap));
    logOutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        signOut(auth)
            .then(() => {
                bar.classList.remove("bar_active");
                searchOpen.classList.remove("search__open_active");
                // Sign-out successful.
            })
            .catch((error) => {
                // An error happened.
            });
    });
    //

    formLoginInSend.addEventListener("click", (e) => {
        e.preventDefault();
        if (validationRules(inputs)) {
            document.querySelector(".form .spiner")?.remove();
            let spiner = document.createElement("div");
            spiner.classList.add("spiner");
            spiner.innerHTML = ` 
                <div></div>
                <div></div>
                <div></div>
            `;
            formLoginInWrap.append(spiner);
            e.preventDefault();
            const data = new FormData(formLogininData);
            signInWithEmailAndPassword(auth, data.get("email"), data.get("password"))
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    onAuthStateChanged(auth, (user) => {
                        if (user) {
                            const uid = user.uid;

                            // ...
                        } else {
                        }
                    });
                    formLoginInOpenCloseTogle(formLoginInWrap);
                    let str = "sucsses";
                    debounc_(str, "rgb(8, 230, 41)", "black");
                    let elem = document.querySelector(".form__log .spiner");
                    elem.remove();
                    inputs.forEach((item) => {
                        item.value = "";
                    });
                    /* console.log(user.uid); */
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    let elem = document.querySelector(".form__log .spiner");
                    elem.remove();
                    debounc_(errorCode, "#ff0000a9", "#fff");
                });
        }
    });
    let debounc_ = debounc(notification, 4000);
    function debounc(fn, delay) {
        let deb = true;
        return function (...args) {
            if (deb) {
                fn.apply(this, args);
                deb = false;
                setTimeout(() => (deb = true), delay);
            }
        };
    }
    //
    function formLoginInOpenCloseTogle(formSelector) {
        if (formSelector.classList.contains("form__log_active")) {
            formSelector.classList.remove("form__log_active");
        } else {
            formSelector.classList.add("form__log_active");
        }
        bar.classList.remove("bar_active");
        searchOpen.classList.remove("search__open_active");
    }
};
