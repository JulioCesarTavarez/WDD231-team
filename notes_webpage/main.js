const user_input = document.querySelector("#user_input");
const user_button = document.querySelector("#user_button");
const user_welcome = document.querySelector("#user_welcome");
const user_error = document.querySelector(".user_error");
const userBox = document.querySelector(".user_box");

setTimeout(() => {
    userBox.style.opacity = "1";
    userBox.style.top = "50%";
}, 1000);

function nameSubmit(event) {
    event.preventDefault();

    let user_name = user_input.value;
    if (user_name) {
        user_welcome.innerHTML = `Welcome, ${user_name}`;
        userBox.style.opacity = "0";
        userBox.style.top = "-50%";
    }
    else
    {
        user_error.style.fontSize = "12px"
    }
}

function folderTemplate(folder_data){
    return ``
}

user_button.addEventListener("click", nameSubmit);