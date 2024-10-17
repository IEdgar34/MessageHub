export const validationRules = (inputsSelector) => {
    const validation = {
        email: (value) => /\S+@\S+\.\S+/.test(value) || "Введите корректный email",
        text: (value) => /^[А-ЯЁа-яё a-zA-Z]{2,30}$/.test(value) || "Имя и Фамилия должны содержать только буквы",
        password: (value) => /[a-zA-Z]{6,15}/.test(value) || "Пароль должен быть не менее 6 символов и не содержать кириллицу",
    };
    let arr = [];
    inputsSelector.forEach((item) => {
        let type = item.type;
        let value = item.value.trim();
        let bol = validation[type](value);

        if (bol !== true) {
            arr.push(false);
            let c = item.nextElementSibling;
            c.innerText = bol;
            c.classList.add("active");
            setTimeout(() => c.classList.remove("active"), 3000);
        }
    });

    if (arr.includes(false)) {
        return false;
    } else {
        return true;
    }
};
