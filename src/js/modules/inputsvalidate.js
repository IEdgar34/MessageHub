export const validate = () => {
    const inputMessage = document.querySelector(".message");
    inputMessage.addEventListener("input", (e) => {
        if (e.target.scrollHeight < 118) {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
        }

        if (e.target.value[e.target.value.length - 1] == "\n") {
            e.target.scrollTop = e.target.scrollHeight;
        }
    });
    inputMessage.addEventListener("focus", () => {
        inputMessage.scrollIntoView({ behavior: "smooth", block: "center" });
    });
};
