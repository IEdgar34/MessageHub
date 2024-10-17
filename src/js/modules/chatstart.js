export const chat = (db, auth, ref, onAuthStateChanged, onValue, getChat, cleaner) => {
    const userWrapper = document.querySelector(".user__wrapper");
    const participantName = document.querySelector(".chat__wrap-username");
    const searchBar = document.querySelector(".bar");
    const btn = document.querySelector(".search__open");
   
    let localAuth;

    userWrapper.addEventListener("click", (e) => getMessageData(e));

    function getMessageData(e) {
        if (e.target.classList.contains("chat__user")) {
            let recipientId = e.target.getAttribute("data-id");
            let senderId = auth.lastNotifiedUid;
            //
            participantName.textContent = "";
            participantName.textContent = e.target.querySelector("div p").innerText;
            participantName.setAttribute("data-id", recipientId);
            let f = [e.target.querySelector("div p").innerText, recipientId];
            localStorage.setItem(senderId + "j", JSON.stringify(f));
            //
            //наш
            let chatId = recipientId + senderId;
            const starCountRef = ref(db, "chats/" + chatId);
            //его
            let x = senderId + recipientId;
            localStorage.setItem(x + "v", 0);
            e.target.querySelector(".missed_mess").textContent = 0;
            e.target.querySelector(".missed_mess").style.display = "none";
            const particioantId = ref(db, "chats/" + x);
            getChat(particioantId, starCountRef, onValue, cleaner);
            //
            if (searchBar.classList.contains("bar_active")) {
                searchBar.classList.remove("bar_active");
                btn.classList.remove("search__open_active");
            }
        }
    }

    /*  function getChat(particioantId, starCountRef) {
        function c() {
            return new Promise((resolve) => {
                onValue(particioantId, (snapshot) => {
                    const udate = snapshot.val();
                    if (udate) {
                        aLeft = [];
                        for (let key in udate.messages) {
                            aLeft.push([udate.messages[key].txt, udate.messages[key].time, "left"]);
                        }
                        resolve();
                    }
                });
            });
        }
        c()
            .then(() => {
                return new Promise((resolve) => {
                    onValue(starCountRef, (snapshot) => {
                        date = snapshot.val();
                        if (date) {
                            aRigth = [];
                            for (let key in date.messages) {
                                aRigth.push([date.messages[key].txt, date.messages[key].time, "right"]);
                            }
                            resolve();
                        }
                    });
                });
            })
            .then(() => {
                let s = aRigth.concat(aLeft);
                s.sort((a, b) => b[1] - a[1]);
                cleaner();
                s.forEach((item) => {
                    if (item[2] === "right") {
                        createChatMessageBlock("right", item[0]);
                    } else {
                        createChatMessageBlock("left", item[0]);
                    }
                });
            })
            .catch((e) => {
                console.log(e);
            });

        function cleaner() {
            const messRight = document.querySelectorAll(".right");
            const messLeft = document.querySelectorAll(".left");
            messLeft.forEach((item) => {
                item.remove();
            });
            messRight.forEach((item) => {
                item.remove();
            });
        }
    } */
    function getLocalStorageDate() {
        let lastChatLocalArr = JSON.parse(localStorage.getItem(localAuth.uid + "j"));

        participantName.textContent = "";

        if (lastChatLocalArr && lastChatLocalArr.length > 0) {
            participantName.textContent = lastChatLocalArr[0];
            participantName.setAttribute("data-id", lastChatLocalArr[1]);

            //получение ссылок на последний открытый чат из localstorage и подгрузка
            let participantId = lastChatLocalArr[1] + localAuth.uid;
            let senderId = localAuth.uid + lastChatLocalArr[1];
            let p = ref(db, "chats/" + participantId);
            let n = ref(db, "chats/" + senderId);
            getChat(n, p, onValue, cleaner);
        }
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;

            localAuth = auth.currentUser;
            getLocalStorageDate();

            // ...
        } else {
            localAuth = "";
            participantName.textContent = "";
            cleaner();
        }
    });
};
