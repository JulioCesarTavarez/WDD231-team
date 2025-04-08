import { getDB } from "./main.js";

const folderURL = new URLSearchParams(window.location.search).get("id");
if (!folderURL) {
    alert("No folder URL found in query parameters.");
    window.location.href = "index.html";
}

const database = await getDB();

let noteCount = 1;
let editingNote = null;
let deleteMode = false;

const addNoteButton = document.querySelector("#add-button");
addNoteButton.addEventListener("click", toggleNoteForm);

const closeButton = document.querySelector("#cancelCreation");
closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    toggleNoteForm();
});

const noteMaker = document.getElementById("addNote");
noteMaker.addEventListener("click", makeNote);

const remove = document.querySelector(".delete-button");
remove.addEventListener("click", () => {
    deleteMode = true;
    document.body.classList.add("delete-cursor");
    document.querySelectorAll(".stickyNote").forEach(note => {
        note.classList.add("delete-mode");
    });
    alert("Delete mode ON: Click a note to remove it.");
});

function toggleNoteForm() {
    const noteCreator = document.querySelector(".noteCreationForm");
    noteCreator.classList.toggle("hideNote");
}

function editExistingNote(noteDiv) {
    const h2 = noteDiv.querySelector("h2");
    const p = noteDiv.querySelector("p");

    document.getElementById("note_title").value = h2.textContent;
    document.getElementById("note_text").value = p.textContent;

    document.querySelector(".noteCreationForm").classList.remove("hideNote");
    editingNote = noteDiv;
}

function exitDeleteMode() {
    deleteMode = false;
    document.body.classList.remove("delete-cursor");
    document.querySelectorAll(".stickyNote").forEach(note => {
        note.classList.remove("delete-mode");
    });
}

function displayNotes(notes) {
    notes.forEach(note => {
        const div = document.createElement("div");
        div.classList.add("stickyNote");
        div.id = `stickyNote${noteCount}`;

        const h2 = document.createElement("h2");
        h2.classList.add("stickyTitle");
        h2.textContent = note.note_title;

        const p = document.createElement("p");
        p.classList.add("stickyText");
        p.textContent = note.note_text;

        const button = document.createElement("button");
        button.textContent = "Read More";
        button.id = `readMore${noteCount}`;
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            if (!deleteMode) {
                editExistingNote(div);
            }
        });

        div.appendChild(h2);
        div.appendChild(p);
        div.appendChild(button);

        div.addEventListener("click", (event) => {
            event.stopPropagation();
            if (deleteMode) {
                div.remove();
                exitDeleteMode();
                deleteNoteFromDB(note); // Optional: delete from IndexedDB
            }
        });

        document.querySelector(".notes").appendChild(div);
        noteCount++;
    });
}

async function makeNote(event) {
    event.preventDefault();

    const noteTitle = document.getElementById("note_title");
    const noteText = document.getElementById("note_text");

    if (editingNote) {
        const h2 = editingNote.querySelector("h2");
        const p = editingNote.querySelector("p");

        h2.textContent = noteTitle.value;
        p.textContent = noteText.value;

        // Optional: update in IndexedDB
        // You would need to store and track note IDs for this

        editingNote = null;
    } else {
        const div = document.createElement("div");
        div.classList.add("stickyNote");
        div.id = `stickyNote${noteCount}`;

        const h2 = document.createElement("h2");
        h2.classList.add("stickyTitle");
        h2.textContent = noteTitle.value;

        const p = document.createElement("p");
        p.classList.add("stickyText");
        p.textContent = noteText.value;

        const button = document.createElement("button");
        button.textContent = "Read More";
        button.id = `readMore${noteCount}`;
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            if (!deleteMode) {
                editExistingNote(div);
            }
        });

        div.appendChild(h2);
        div.appendChild(p);
        div.appendChild(button);

        div.addEventListener("click", (event) => {
            event.stopPropagation();
            if (deleteMode) {
                div.remove();
                exitDeleteMode();
            }
        });

        document.querySelector("main").appendChild(div);
        noteCount++;

        await saveNoteToFolder(noteTitle.value, noteText.value);
    }

    noteTitle.value = "";
    noteText.value = "";
    document.querySelector(".noteCreationForm").classList.add("hideNote");
}

async function saveNoteToFolder(noteTitle, noteText) {
    try {
        await database.notes.add({
            folder_url: folderURL,
            note_title: noteTitle,
            note_text: noteText
        });
        console.log("Note saved to folder:", folderURL);
    } catch (error) {
        console.error("Error saving note:", error);
    }
}

// Optional function for deleting a note from IndexedDB (you'll need note ID)
async function deleteNoteFromDB(note) {
    try {
        await database.notes.where({
            folder_url: folderURL,
            note_title: note.note_title,
            note_text: note.note_text
        }).delete();
        console.log("Note deleted from DB.");
    } catch (error) {
        console.error("Error deleting note from DB:", error);
    }
}

// Initial display of saved notes
const folderNotes = await database.notes.where("folder_url").equals(folderURL).toArray();
displayNotes(folderNotes);
