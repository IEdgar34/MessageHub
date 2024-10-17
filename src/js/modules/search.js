/* import { getDatabase, ref, onValue, set, remove } from "firebase/database"; */
export const search = (ref, db, onValue, auth, onAuthStateChanged) => {
    const searchInput = document.querySelector(".search");
    const searchResult = document.querySelector(".search__result");
    let userArray = [];
    let sendId;
    //

    searchInput.addEventListener("input", (e) => searchName(searchInput));
    function searchName(searchInput) {
        let target = searchInput.value;
        localStorage.setItem("inputValue", target);
        target.length < 1 ? cleanUserWrapper(".search__result p", ".search__result span") : grouping(target);
    }
    function grouping(target) {
        let arr = userArray.filter((item) => {
            let name = Object.keys(item);

            let c = "";
            for (let i = 0; i < target.length; i++) {
                c += name[0][i];
            }

            if (target.includes(c)) {
                return item;
            }
        });

        cleanUserWrapper(".search__result p", ".search__result span");
        addElem(arr, searchResult);
    }

    function cleanUserWrapper(ArrayClass, spanClass) {
        searchResult.style.display = "none";
        let i = document.querySelectorAll(ArrayClass);
        let b = document.querySelectorAll(spanClass);
        i.forEach((item) => {
            item.remove();
        });
        b.forEach((item) => {
            item.remove();
        });
    }

    function addElem(arr, appendWrapper) {
        if (arr.length > 0) {
            arr.forEach((item) => {
                let p = document.createElement("p");
                let nameId = Object.entries(item);
                p.setAttribute("data-userId", nameId[0][1]);
                p.classList.add("user");
                p.textContent = nameId[0][0].slice(0);
                appendWrapper.append(p);
            });
        } else {
            let span = document.createElement("span");
            let c = appendWrapper.querySelector("span");
            span.textContent = "Nothing found";
            c === null ? appendWrapper.append(span) : null;
        }

        appendWrapper.style.display = "flex";
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            sendId = auth.currentUser.uid;
            const starCountRef = ref(db, "users");
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val();
                userArray = [];
                for (let key in data) {
                    let modifiedUser = {};

                    if (data[key].userId !== uid) {
                        modifiedUser[data[key].username + " " + data[key].usersurname] = data[key].userId;
                        userArray.push(modifiedUser);
                    }
                }
                searchInput.value = localStorage.getItem("inputValue");
                searchName(searchInput);
            });
            // ...
        } else {
        }
    });
};
