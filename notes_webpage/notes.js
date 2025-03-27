let noteCount = 1;
function addNote() {
    let stickyNote = document.createElement("div");
    stickyNote.classList.add("stickyNote");
    stickyNote.innerHTML = `
        <h2 class="stickyTitle">Note title ${noteCount++}</h2>
        <p class="stickyText">Lorem ipsum dolor</p>
        <button id="readMore1" class="Open Note ${noteCount}">Read More</button>
    `;
    document.querySelector("main").appendChild(stickyNote);
}
const addNoteButton = document.querySelector("#add-button");
addNoteButton.addEventListener("click", addNote);