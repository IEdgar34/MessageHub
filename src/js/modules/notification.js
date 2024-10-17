export const notification = (errorCode, colorSelector, textColor) => {
    const notification = document.querySelector(".message__block");
    notification.textContent = errorCode;
    notification.style.cssText = `
        background-color: ${colorSelector};
        color: ${textColor};
    `;
    setTimeout(() => notification.classList.add("message__block_active"), 0);

    let set = setTimeout(() => notification.classList.remove("message__block_active"), 3000);
};
