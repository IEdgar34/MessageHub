export const registration = (createUserWithEmailAndPassword, auth, getDatabase, set, ref, notification, validationRules) => {
    const openRegForm = document.querySelector(".registration");
    const closeRegForm = document.querySelector(".form__close");
    const formWrap = document.querySelector(".form");
    const formData = document.querySelector(".form__data");
    const formSend = document.querySelector(".form__send");
    const inputs = document.querySelectorAll(".form__data input");
    const bar = document.querySelector(".bar");
    const searchOpen = document.querySelector(".search__open");

    //loginin logout

    openRegForm.addEventListener("click", () => formOpenCloseTogle(formWrap));
    closeRegForm.addEventListener("click", () => formOpenCloseTogle(formWrap));
    formSend.addEventListener("click", (e) => regUserAndCreateDb(e, formData));

    function regUserAndCreateDb(e, formData) {
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
            formWrap.append(spiner);
            e.preventDefault();
            const date = new FormData(formData);
            //регистрация пользователя
            createUserWithEmailAndPassword(auth, date.get("email"), date.get("password"))
                .then((userCredential) => {
                    // Signed up
                    const user = userCredential.user;
                    //добавление пользователя в бд
                    function writeUserData(userId, name, surname, email) {
                        const db = getDatabase();
                        set(ref(db, "users/" + userId), {
                            userId: userId,
                            username: name,
                            usersurname: surname,
                            email: email,
                        });
                    }
                    writeUserData(user.uid, date.get("name"), date.get("surname"), date.get("email"));
                    let elem = document.querySelector(".form .spiner");
                    elem.remove();
                    formOpenCloseTogle(formWrap);
                    let str = "sucsses";
                    err(str, "rgb(8, 230, 41)", "black");
                    inputs.forEach((item) => {
                        item.value = "";
                    });
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    let elem = document.querySelector(".form .spiner");
                    elem.remove();
                    err(errorCode, "#ff0000a9", "#fff");
                    // ..
                });
        }
    }
    let err = debounc(notification, 4000);
    function debounc(fn, delay) {
        let d = true;
        return function (...args) {
            if (d) {
                fn.call(this, ...args);
                d = false;
                setTimeout(() => (d = true), delay);
            }
        };
    }
    function formOpenCloseTogle(formSelector) {
        bar.classList.remove("bar_active");
        searchOpen.classList.remove('search__open_active')
        if (formSelector.classList.contains("form_active")) {
            formSelector.classList.remove("form_active");
        } else {
            formSelector.classList.add("form_active");
        }
    }
};
