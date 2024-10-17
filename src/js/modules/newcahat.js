export const newChat = (auth, set, db, ref, onValue, onAuthStateChanged, cleaner, onChildAdded) => {
    const usersList = document.querySelector(".search__result");
    const userWrapper = document.querySelector(".user__wrapper");
    const messageBlock = document.querySelector(".message__block");
    let data;
    let name;
    let use;
    /*   let myId; */
    //следим авторизован ли пользователь,и запускаем нужные функции

    let i = 0;
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const myId = user.uid;
            use = auth.currentUser;
            createChatElemLocal();
            userWrapper.style.display = "block";
            onValue(ref(db, "users/" + myId), (snapshot) => {
                let data = snapshot.val();
                if (data) {
                    name = data.username + " " + data.usersurname;
                }
            });
            ///////
            onChildAdded(ref(db, "chats"), (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    let id = data.id.slice(0, myId.length);
                    if (id === myId) {
                        ////
                        let chatId = data.participants.userId2 + myId;

                        onValue(ref(db, "chats/" + chatId), (snapshot) => {
                            const chatData = snapshot.val();
                            if (!chatData) {
                                writeUserData(data.participants.userId2 + myId, data.participants.userId2, myId, data.participants.userId2 + myId, name);
                            }
                        });
                        ////

                        let arr = [];
                        onChildAdded(ref(db, "chats/" + data.id + "/messages"), (snapshot) => {
                            const message = snapshot.val();
                            arr.push(message.time);
                            if (arr[arr.length - 1] > +localStorage.getItem(data.id + "t")) {
                                let senderNameLocal = document.querySelector(".chat__wrap-username").textContent;
                                let senderName = data.participants.sendername;
                                localStorage.setItem(data.id + "t", arr[arr.length - 1]);
                                localStorage.setItem(data.id + "m", message.txt);
                                ////

                                if (message && data.participants.sendername !== name && senderNameLocal === senderName) {
                                    createChatMessage("left", message.txt, timeSlice(message.time));
                                    createChatElem(data.participants.sendername, data.participants.userId2, 0, message.txt.trim(), message.time);
                                } else {
                                    if ("Notification" in window && Notification.permission !== "denied") {
                                        Notification.requestPermission().then((permission) => {
                                            if (permission === "granted") {
                                                // Показать уведомление
                                                new Notification("Новое сообщение в чате!", {
                                                    body: "У вас есть новое непрочитанное сообщение.",
                                                    //icon: "path/to/icon.png", // Иконка уведомления
                                                });
                                            }
                                        });
                                    }

                                    let value = +localStorage.getItem(data.id + "v") || 0;
                                    localStorage.setItem(data.id + "v", (value += 1));
                                    createChatElem(data.participants.sendername, data.participants.userId2, value, message.txt.trim(), message.time);
                                }
                            }
                        });
                    }
                }
            });

            // ...
        } else {
            use = "";
            userWrapper.style.display = "none";
        }
    });

    function createChatMessage(classSelector, txtSelector, timeSelector) {
        let chatWrap = document.querySelector(".chat__wrap");
        const div = document.createElement("div");
        div.classList.add(classSelector);
        div.innerHTML = ` 
        <div class="text"> 
        <p>${txtSelector}</p>
        <p class="time">${timeSelector}</p>
        </div>
        `;

        chatWrap.append(div);
        chatWrap.scrollTo(0, chatWrap.scrollHeight);
    }
    usersList.addEventListener("click", (e) => addUserChatList(e));

    //создаем в базе данных объект чата,где chatId это результат склеивания id двух пользователей
    //и одобавляем этот чат в список чатов
    //только в том случае,если такого чата до этого не было в базе,или чат был удален из списка
    function addUserChatList(e) {
        if (e.target.classList.contains("user") && use !== "") {
            let userId = e.target.getAttribute("data-UserId");
            let userName = e.target.textContent;
            let chatId = userId + auth.lastNotifiedUid;
            let dataId = e.target.getAttribute("data-userid");
            //

            function getData() {
                onValue(ref(db, "chats/" + chatId), (snapshot) => {
                    data = snapshot.val();
                    let v = localStorage.getItem(auth.lastNotifiedUid + userId + "v");
                    let prevM = localStorage.getItem(auth.lastNotifiedUid + userId + "m");
                    let time = localStorage.getItem(auth.lastNotifiedUid + userId + "t");
                    if (data == undefined) {
                        writeUserData(chatId, userId, auth.lastNotifiedUid, chatId, name);
                        createChatElem(userName, dataId, v, undefined, undefined);
                        closeSerchWrap();
                    } else {
                        createChatElem(userName, dataId, v, prevM?.trim(), time?.trim());
                        closeSerchWrap();
                    }
                });
            }
            getData();
        } else if (e.target.classList.contains("user") && use == "") {
            notificationMessage();
        }
    }

    function writeUserData(chatId, userId1, userId2, senderId, senderName) {
        set(ref(db, "chats/" + chatId), {
            id: senderId,
            participants: {
                userId1: userId1,
                userId2: userId2,
                sendername: senderName,
            },
        });
    }

    //функция добавления чата с пользователем в список сайдбара
    //добавляет в localsorage массив данных,после перезагрузки получаем этот массив и подгружаем список
    function createChatElem(userName, dataId, missedMessageValue, messagePreview, time) {
        let elem = document.querySelector(`.chat__user[data-id="${dataId}"]`);
        if (elem) {
            elem.querySelector(".missed_mess").textContent = missedMessageValue;
            elem.querySelector(".txt").textContent = sliceTxt(messagePreview) || "";
            elem.querySelector(".time").textContent = timeSlice(time) || "";
        } else {
            const div = document.createElement("li");
            div.setAttribute("data-id", dataId);
            div.classList.add("chat__user");
            div.innerHTML = `
            <img src="images/user.webp" alt="" class="chat__user-img"/>
                <div class="chat__user_mess-wrap">
                    <div>
                        <p class="name">${userName}</p>
                    </div>
                    <span class="txt">${sliceTxt(messagePreview) || ""}</span>
                    <span class="time">${timeSlice(time) || ""}</span>
                </div>
                <img src="images/del.webp" alt=""class="chat__user-del"/>
            <span class="missed_mess" style="${missedMessageValue < 1 ? "display: none;" : "display: flex;"}">${missedMessageValue || 0}</span>    
        `;
            //добавили
            userWrapper.prepend(div);
            //добавили в localStorage
            setLocalStorage();
            //удаляем со страницы,и в ней вызываем функцию setLocalStorage которая перезаписывает новый список
            deleteElem();
        }
    }
    //добавляет список чатов в localStorage
    function setLocalStorage() {
        let arr = [];
        let wrapperElem = document.querySelectorAll(".chat__user");
        if (wrapperElem) {
            arr = Array.from(wrapperElem).map((item) => {
                let n = item.querySelector(".chat__user .name").innerText;

                return [n, item.getAttribute("data-id")];
            });
            localStorage.setItem(use.uid, JSON.stringify(arr));
        }
    }
    //удаляем чат со страницы,и обновляем localStorage
    function deleteElem() {
        let del = document.querySelectorAll(".chat__user-del");
        del.forEach((item) => {
            item.addEventListener("click", (e) => {
                let name = document.querySelector(".chat__wrap-username");
                let txt = item.previousElementSibling.querySelector("p").textContent;
                item.parentElement.remove();
                if (txt.trim() === name.textContent.trim()) {
                    cleaner();
                    name.textContent = "";
                    localStorage.setItem(use.uid + "j", JSON.stringify([]));
                }
                setLocalStorage();
            });
        });
    }

    //добавляем список чатов из localStorage
    function createChatElemLocal() {
        let localArr = JSON.parse(localStorage.getItem(use.uid));
        const chatuser = document.querySelectorAll(".chat__user");
        if (chatuser) {
            chatuser.forEach((item) => {
                item.remove();
            });
        }
        if (localArr) {
            localArr.reverse();
            localArr.forEach((item) => {
                let x = +localStorage.getItem(use.uid + item[1] + "v");
                let prevM = localStorage.getItem(use.uid + item[1] + "m");
                let time = localStorage.getItem(use.uid + item[1] + "t");
                createChatElem(item[0], item[1], x, prevM?.trim(), time?.trim());
            });
        }
    }

    //очистить и закрыть список найденых пользователей
    const input = document.querySelector(".search");
    function closeSerchWrap() {
        input.value = "";
        localStorage.setItem("inputValue", "");
        usersList.style.display = "none";
    }
    //функция уведомления
    function notificationMessage() {
        messageBlock.style.cssText = ` 
            height: 90px;
            background-color: #ff0000a9;
        `;
        messageBlock.innerHTML = `  
            <p>Войдите или авторизуйтесь что бы начать чат</p>
        `;
        messageBlock.classList.add("message__block_active");
        setTimeout(() => messageBlock.classList.remove("message__block_active"), 3000);
    }
    function sliceTxt(arg) {
        if (arg) {
            if (arg.length > 8) {
                return arg.slice(0, 8) + "...";
            } else {
                return arg;
            }
        } else {
            return false;
        }
    }
    function timeSlice(arg) {
        if (arg) {
            let d = new Date(+arg);
            return d.getHours() + ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());
        } else {
            return false;
        }
    }
};
