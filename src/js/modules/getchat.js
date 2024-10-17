export const getChat = (particioantId, senderId, onValue, cleaner) => {
    let date;
    let aRigth = [];
    let aLeft = [];
    const chatWrap = document.querySelector(".chat__wrap");
    cleaner();

    let spiner = document.createElement("div");
    spiner.innerHTML = ` 
        <div class="spiner">
            <div></div>
            <div></div>
            <div></div>
        </div>
    `;
    chatWrap.append(spiner);

    function promise() {
        return new Promise((resolve, reject) => {
            onValue(particioantId, (snapshot) => {
                const udate = snapshot.val();

                if (udate) {
                    aLeft = [];
                    for (let key in udate.messages) {
                        aLeft.push([udate.messages[key].txt, udate.messages[key].time, "left"]);
                    }
                }
                resolve();
            });
        });
    }
    promise()
        .then(() => {
            return new Promise((resolve, reject) => {
                onValue(senderId, (snapshot) => {
                    date = snapshot.val();

                    if (date) {
                        aRigth = [];
                        for (let key in date.messages) {
                            aRigth.push([date.messages[key].txt, date.messages[key].time, "right"]);
                        }
                    }
                    resolve();
                });
            });
        })

        .then(() => {
            let s = aRigth.concat(aLeft);
            cleaner();
            s.sort((a, b) => b[1] - a[1]);
            s.forEach((item) => {
                if (item[2] === "right") {
                    let t = new Date(item[1]);
                    let str = `${t.getHours()}:${t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes()}`;

                    createChatMessageBlock("right", item[0], str);
                } else {
                    let t = new Date(item[1]);
                    let str = `${t.getHours()}:${t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes()}`;
                    createChatMessageBlock("left", item[0], str);
                }
            });
        })
        .catch((e) => {
            console.log(e);
        });

    //
    function createChatMessageBlock(classSelector, txtSelector, timeSelector) {
        const div = document.createElement("div");
        chatWrap.scrollTo(0, chatWrap.scrollHeight);
        div.classList.add(classSelector);
        div.innerHTML = ` 
                <div class="text"> 
                    <p>${txtSelector}</p>
                    <p class="time">${timeSelector}</p>
                </div>
            `;

        chatWrap.prepend(div);
    }
};
