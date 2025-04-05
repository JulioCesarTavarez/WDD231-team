let noteCount = 1; // this will keep track of all teh sticky note made
let editingNote = null; // if editing note is true we can edit notes
let deleteMode = false;//this is to see if we can delete the note when true

const addNoteButton = document.querySelector("#add-button");
addNoteButton.addEventListener("click", toggleNoteForm);

const closeButton = document.querySelector("#cancelCreation");
closeButton.addEventListener("click", (event) =>{
    event.preventDefault(); 
    toggleNoteForm();
});

function toggleNoteForm() {
    const noteCreator = document.querySelector(".noteCreationForm");
    noteCreator.classList.toggle("hideNote");
}

const noteMaker = document.getElementById("addNote");
noteMaker.addEventListener("click", makeNote);

function makeNote(event) {
    event.preventDefault();

    const noteTitle = document.getElementById("note_title");
    const noteText = document.getElementById("note_text");

    if (editingNote) {
        // Update existing note
        const h2 = editingNote.querySelector("h2");
        const p = editingNote.querySelector("p");

        h2.textContent = noteTitle.value;
        p.textContent = noteText.value;

        editingNote = null;
    } else {
        // Create new note
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
            if (deleteMode) {
                event.stopPropagation();
                div.remove();
                exitDeleteMode();
            }
        });

        document.querySelector("main").appendChild(div);
        noteCount++;
    }

    // Reset form
    noteTitle.value = "";
    noteText.value = "";
    document.querySelector(".noteCreationForm").classList.add("hideNote");
}

function editExistingNote(noteDiv) {
    const h2 = noteDiv.querySelector("h2");
    const p = noteDiv.querySelector("p");

    document.getElementById("note_title").value = h2.textContent;
    document.getElementById("note_text").value = p.textContent;

    document.querySelector(".noteCreationForm").classList.remove("hideNote");

    editingNote = noteDiv;
}

const remove = document.getElementById("delete-button");
remove.addEventListener("click", () => {
    deleteMode = true;
    document.body.classList.add("delete-cursor");
    document.querySelectorAll(".stickyNote").forEach(note => {
        note.classList.add("delete-mode");
    });
    alert("Delete mode ON: Click a note to remove it.");
});

function exitDeleteMode() {
    deleteMode = false;
    document.body.classList.remove("delete-cursor");
    document.querySelectorAll(".stickyNote").forEach(note => {
        note.classList.remove("delete-mode");
    });
}
