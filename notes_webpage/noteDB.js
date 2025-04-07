
// This will update a note if edited    
await db.notes.update(existingNoteId, {
    note_title: note_title.value,
    note_text: note_text.value
})

//Thi will let us filter the notes for each folder.
const params = new URLSearchParams(window.location.search);
const folderURL = params.get('id');



async function loadNotes() {
    const notes = await db.notes.where("folder_url").equals(folderURL).toArray();
    notes.forEach(displayNote);
}

function displayNote(note) {
    const div = document.createElement("div");
    div.classList.add("stickyNote");
    div.id = `note-${note.id}`;

    const h2 = document.createElement("h2");
    h2.classList.add("stickyTitle");
    h2.textContent = note.note_title;

    const p = document.createElement("p");
    p.classList.add("stickyText");
    p.textContent = note.note_text;

    const button = document.createElement("button");
    button.textContent = "Read More";
    button.addEventListener("click", () => {
        // Load into form for editing
        document.getElementById("note_title").value = note.note_title;
        document.getElementById("note_text").value = note.note_text;
        editingNote = note;
        toggleNoteForm();
    });

    div.appendChild(h2);
    div.appendChild(p);
    div.appendChild(button);

    div.addEventListener("click", async () => {
        if (deleteMode) {
            await db.notes.delete(note.id);
            div.remove();
            exitDeleteMode();
        }
    });

    document.querySelector("main").appendChild(div);
}

document.addEventListener("DOMContentLoaded", loadNotes);
