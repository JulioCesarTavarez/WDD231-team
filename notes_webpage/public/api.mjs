export async function quotes() {
    try {
      const response = await fetch('https://zenquotes.io/api/today');
      const data = await response.json();
      console.log(data); // Use the data here
      return data; // Return the data so it can be used elsewhere
    } catch (error) {
      console.error('Error:', error);
      return null; // Return null or handle error appropriately
    }
  }