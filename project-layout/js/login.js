
let loginButton = document.querySelector(".btn__login");
loginButton.addEventListener("click", () => {
    //chu y ten cua selector
    let email = document.querySelector(".form__input.email").value;
    let pass = document.querySelector(".form__input.password").value;
    if (email == "admin@gmail.com" && pass == "123456") {
        const userInfo = {
            email: email,
        }
        // luu vo local
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        location.href = "./index.html";
    } else {
        alert("Email hoặc tài khoản không đúng , vui lòng đăng nhập lại")

    }
});
