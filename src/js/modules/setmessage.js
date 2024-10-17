export const setmessage = (db, update, auth, ref, onAuthStateChanged, push) => {
    const send = document.querySelector(".chat__message-send");
    const partId = document.querySelector(".chat__wrap-username");
    const mess = document.querySelector(".message");
    const wrap = document.querySelector(".chat__wrap");
    let userChatId;
    let uid;

    send.addEventListener("click", (e) => updateData(e));
    function updateData(e) {
        if (uid) {
            let text = mess.value;
            let i = partId.getAttribute("data-id");
            let chatId = i + userChatId.uid;
            let obj = {
                txt: text,
                time: Date.parse(new Date()),
            };

            let k = push(ref(db, "chats/" + chatId + "/messages"));
            if (mess.value !== "" && partId.textContent !== "") {
                update(k, obj);
                let t = new Date(obj.time);
                let str = `${t.getHours()}:${t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes()}`;
                createChatMessage("right", obj.txt, str);
                wrap.scrollTo(0, wrap.scrollHeight);
                mess.style.cssText = `min-height: 48px`;
                mess.value = "";
            }
        }
    }
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
    onAuthStateChanged(auth, (user) => {
        if (user) {
            uid = user.uid;
            userChatId = auth.currentUser;
            // ...
        } else {
        }
    });
};
