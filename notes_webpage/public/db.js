const db = new Dexie('NotesApp');
db.version(2).stores({
    folders: '++id, folder_name, folder_user, folder_url, last_edited',
    notes: '++id, folder_url, note_title, note_text'
});

// Open the database
db.open().catch(error => {
    console.error("Failed to open DB:", error);
});

export function getDB() {
    return db;
}