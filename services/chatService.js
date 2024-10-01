import { sql } from "../database.js";


const addChatMessage = async (sender, message) => {
    if (!sender || !message) {
        throw new Error("Sender and message are required");
    }
    try {
        await sql`INSERT INTO messages (sender, message) VALUES (${sender}, ${message})`;
    } catch (error) {
        console.error("Error in addChatMessage service:", error);
        throw error;
    }
};
const getChatMessages = async () => {
    try {
        const result = await sql`
        SELECT * FROM messages
        ORDER BY id DESC
        LIMIT 5
        `;
        
        return result;
    } catch (error) {
        console.error("Error in getChatMessages service:", error);
        throw error;
    }
};


export { addChatMessage, getChatMessages };