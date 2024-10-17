export const cleaner = () => {
    let spiner = document.querySelector(".chat__wrap div");
    if (spiner) {
        spiner.remove();
    }
    let c = document.querySelectorAll(".right");
    let b = document.querySelectorAll(".left");
    c.forEach((item) => item.remove());
    b.forEach((item) => item.remove());
};
