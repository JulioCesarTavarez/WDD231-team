const response = await fetch('/api/quote');
const quote = await response.json();

console.log(quote[0].q); // quote text
console.log(quote[0].a); // author
quoteDisplay(quote)

// initialize the database
const db = new Dexie('NotesApp');
db.version(1).stores({
    folders: '++id, folder_name, folder_user, folder_url, last_edited', // I will modulize this code, if you want, feel free to add your notes table with is respective values. 
});


// Open the database
db.open().catch(error => {
    console.error("Failed to open DB:", error);
});

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
let deleteMode = false;

// This function sets the user_name modal to wait 1 second before appearing on the screen. 
setTimeout(() => {
    userBox.style.opacity = "1";
    userBox.style.top = "50%";
}, 1000);

function hideFolderForm(event) {
    event.preventDefault();
    add_form.style.opacity = "0";
    add_form.style.top = "-50%";
}
// This function takes user_folders and saves them into the indexed db
async function saveFoldersToDB() {
    try {
        await db.folders.clear(); // Optional: Remove this line if updating folders individually.
        await db.folders.bulkPut(user_folders); // Ensures updates instead of duplication
        console.log("Folders saved to IndexedDB:", user_folders); // I have left the console.log here so that you can see how the data is organized.
    } catch (error) {
        console.error("Error saving folders:", error);
    }
}
// This function retrives saved folders. 
async function loadFoldersFromDB() {
    try {
        const storedFolders = await db.folders.toArray();
        
        // Filter folders belonging to the logged-in user
        user_folders = storedFolders.filter(folder => folder.folder_user === user_name);
        
        displayUserFolders(user_folders);
        console.log("Folders loaded from IndexedDB:", user_folders); // I have left the console.log here so that you can see how the data is organized.
    } catch (error) {
        console.error("Error loading folders:", error);
    }
}

// Call this when the page loads
document.addEventListener("DOMContentLoaded", loadFoldersFromDB);

// This function saves new folders to the user_folders array before saving the new folder to the indexed db. 
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
        saveFoldersToDB();
        hideFolderForm(event);
    }
    else {
        folder_error.style.fontSize = "12px"
    }
}

// This function creates the addFolder modal and creates event listeners to call the saveFolderName function
function addFolder() {
    const add_folder = document.querySelector("#folder_add_button");
    const cancel_folder = document.querySelector("#folder_cancel_button");
    add_folder.addEventListener("click", saveFolderName);
    cancel_folder.addEventListener("click", hideFolderForm);
    add_form.style.opacity = "1";
    add_form.style.top = "50%";
}

// This function removes a targeted element and its object form the user_folders array. The DB is updated after this funciton is complete. 
function removeFolder(event) {
    const folderElement = event.target.closest(".folder-card");
    if (!folderElement) return; // Ensure the target is a valid folder card element

    const section = folderElement.closest("section");
    if (!section) return; // Ensure we're in the correct structure

    const index = Number(section.getAttribute("data-index"));

    if (!isNaN(index) && index >= 0 && index < user_folders.length) {
        // Remove the folder from the array
        user_folders.splice(index, 1);

        // Re-render the list and ensure data-index updates correctly
        displayUserFolders(user_folders);
        saveFoldersToDB();
    }
}

// This allows the user to enter into a mode allowing them to delete folders. Folders would just be clicked on. 
function deleteFolderMode(event) {
    event.preventDefault();
    deleteMode = !deleteMode;

    if (deleteMode) {
        delete_button.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--color3");
        delete_button.style.color = getComputedStyle(document.documentElement).getPropertyValue("--color0");

        // Add event listener for removing folders
        folderCont.addEventListener("click", removeFolder);
        
    } else {
        delete_button.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--color1");
        delete_button.style.color = getComputedStyle(document.documentElement).getPropertyValue("--color4");

        // Remove event listener for removing folders
        folderCont.removeEventListener("click", removeFolder);
    }
}

// This little snippet of code designates when the folder cards perform an action. If clicked in delete folder mode, the clicked folder will be deleted. 
// If The user clicks on a card while not in edit mode, the user is redirected to the notes page for that folder. 
folderCont.addEventListener("click", (event) => {
    if (deleteMode) {
        return; // Prevent navigation when delete mode is active
    }
    newPage(user_folders, event);
});

// This function directs the user to a new page and sets the url parameters. 
function newPage(user_folders, event) {
    const folderElement = event.target.closest(".folder-card");
    if (!folderElement) return; // Ensure the target is a valid folder card element

    const section = folderElement.closest("section");
    if (!section) return; // Ensure we're in the correct structure

    console.log("newPage running")

    const sectionIndex = Number(section.getAttribute("data-index"));
    console.log("Selected folder object:", user_folders[sectionIndex].folder_url);

    window.location.href = `notes.html?id=${user_folders[sectionIndex].folder_url}`;
}


function displayUserFolders(user_folders) {
    const folderCont = document.querySelector(".folder-cont");
    folderCont.innerHTML = ""; // Clear previous content

    user_folders.forEach((folder, index) => {
        folderCont.insertAdjacentHTML("beforeend",
            `<section class="folder-card" data-index=${index}>
                <img src="open-folder.png" class="folder-icon" alt="folder icon">
                <h4 class="folder-title">${folder.folder_name}</h4>
                <p>Last edit: ${folder.last_edited}</p>
            </section>`
        );
    });
}

async function nameSubmit(event) {
    event.preventDefault();

    user_name = user_input.value.trim();
    if (user_name) {
        user_welcome.innerHTML = `Welcome, ${user_name}`;
        userBox.style.opacity = "0";
        userBox.style.top = "-50%";
        add_button.style.bottom = "25px";
        delete_button.style.bottom = "25px";

        await loadFoldersFromDB(); // Load folders only after setting user_name
    } else {
        user_error.style.fontSize = "12px";
    }
}

function quoteDisplay(quote) {
    const quoteContainer = document.querySelector(".quotation");
    const quoteAuthor = document.querySelector(".quote-author");
    quoteContainer.innerHTML = `"${quote[0].q}"`;
    quoteAuthor.innerHTML = `- ${quote[0].a}`;
}

user_button.addEventListener("click", nameSubmit);
add_button.addEventListener("click", addFolder);
delete_button.addEventListener("click", deleteFolderMode);