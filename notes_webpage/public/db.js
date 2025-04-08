// initialize the database
const db = new Dexie('NotesApp');
db.version(1).stores({
    folders: '++id, folder_name, folder_user, folder_url, last_edited', // I will modulize this code, if you want, feel free to add your notes table with is respective values. 
    notes: '++id, folder_url, note_title, note_text'
});

export async function getDB() {
    return db;
}

// Open the database
db.open().catch(error => {
    console.error("Failed to open DB:", error);
});