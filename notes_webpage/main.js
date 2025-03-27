import { folders } from './objects.js';

const user_input = document.querySelector("#user_input");
const user_button = document.querySelector("#user_button");
const user_welcome = document.querySelector("#user_welcome");
const user_error = document.querySelector(".user_error");
const folder_error = document.querySelector(".folder_error");
const userBox = document.querySelector(".user_box");
const add_button = document.querySelector(".add-button");
const delete_button = document.querySelector(".delete-button");
const add_form = document.querySelector(".new_folder");
const folderCont = document.querySelector(".folder-cont");
let user_folders = []
let user_name = "User"
let user_folder_number = 2;

setTimeout(() => {
    userBox.style.opacity = "1";
    userBox.style.top = "50%";
}, 1000);

function hideFolderForm(event) {
    event.preventDefault();
    add_form.style.opacity = "0";
    add_form.style.top = "-50%";
}

function saveFolderName(event) {
    event.preventDefault();
    const folder_input = document.querySelector("#folder_input").value;
    if (folder_input.trim()) {
        user_folders.push({
            folder_name: folder_input,
            folder_user: user_name,
            folder_url: `${user_name}_${user_folder_number}`,
            last_edited: new Date().toISOString().split('T')[0] // Formats as YYYY-MM-DD
        });
        user_folder_number++;
        displayUserFolders(user_folders);
        hideFolderForm(event);
    }
    else {
        folder_error.style.fontSize = "12px"
    }
}

function addFolder() {
    const add_folder = document.querySelector("#folder_add_button");
    const cancel_folder = document.querySelector("#folder_cancel_button");
    add_folder.addEventListener("click", saveFolderName);
    cancel_folder.addEventListener("click", hideFolderForm);
    add_form.style.opacity = "1";
    add_form.style.top = "50%";
    

}

function deleteFolder(event) {
    event.preventDefault();

    const folderCont = document.querySelector(".folder-cont"); // Make sure folderCont is defined

    folderCont.addEventListener("click", function(event) {
        if (event.target.closest(".folder-card")) { // Ensure we're clicking on a folder
            removeFolder(event.target.closest(".folder-card")); // Pass the clicked folder
        }
    });
}

function removeFolder(selectedFolder) {
    const index = user_folders.findIndex(folder => folder.folder_url === selectedFolder.dataset.folderUrl);
    
    if (index !== -1) { // Ensure the folder exists in the array
        user_folders.splice(index, 1); // Remove 1 item at the found index
        displayUserFolders(user_folders); // Update the UI
    }
}


function displayUserFolders(user_folders) {
    folderCont.innerHTML = ""; // Clear previous content

    user_folders.forEach(folder => {
        folderCont.insertAdjacentHTML("beforeend", `
            <a href="notes.html?id=${folder.folder_url}" class="card-link">
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

    user_name = user_input.value;
    if (user_name) {
        user_welcome.innerHTML = `Welcome, ${user_name}`;
        userBox.style.opacity = "0";
        userBox.style.top = "-50%";

        user_folders = folders.filter(folder => folder.folder_user.toLowerCase() === user_name.toLowerCase());

        user_folders.sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited));
        
        displayUserFolders(user_folders);
    }
    else
    {
        user_error.style.fontSize = "12px"
    }


}

user_button.addEventListener("click", nameSubmit);
add_button.addEventListener("click", addFolder);
delete_button.addEventListener("click", deleteFolder);


// const search = window.location.search;
// const params = new URLSearchParams(search);
// const productId = params.get("id");