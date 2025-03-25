import { folders } from './objects.js';

const user_input = document.querySelector("#user_input");
const user_button = document.querySelector("#user_button");
const user_welcome = document.querySelector("#user_welcome");
const user_error = document.querySelector(".user_error");
const userBox = document.querySelector(".user_box");

setTimeout(() => {
    userBox.style.opacity = "1";
    userBox.style.top = "50%";
}, 1000);

function displayUserFolders(user_folders) {
    const folderCont = document.querySelector(".folder-cont"); // Ensure correct class selector
    folderCont.innerHTML = ""; // Clear previous content

    user_folders.forEach(folder => {
        folderCont.insertAdjacentHTML("beforeend", `
            <a href="notes.html" class="card-link">
                <section class="folder-card">
                    <img src="open-folder.png" class="folder-icon" alt="folder icon">
                    <h4 class="folder-title">${folder.folder_name}</h4>
                    <p>Last edit: ${folder.last_edited}</p>
                </section>
            </a>
        `);
    });
}

function nameSubmit(event) {
    event.preventDefault();

    let user_name = user_input.value;
    if (user_name) {
        user_welcome.innerHTML = `Welcome, ${user_name}`;
        userBox.style.opacity = "0";
        userBox.style.top = "-50%";

        let user_folders = folders.filter(folder => folder.folder_user.toLowerCase() === user_name.toLowerCase());

        user_folders.sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited));
        
        displayUserFolders(user_folders);
    }
    else
    {
        user_error.style.fontSize = "12px"
    }


}

user_button.addEventListener("click", nameSubmit);