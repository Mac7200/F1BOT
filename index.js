const axios = require('axios');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const BITRIX_WEBHOOK_URL = process.env.BITRIX_WEBHOOK_URL;
// Your middleware and routes go here
app.get('/', (req, res) => {
    res.send('Hello, Render!');
});

// Start the server on the correct port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use(cors());
app.use(bodyParser.json());

// Function to send a message to Bitrix24
async function sendToBitrix24(userMessage, botResponse) {
    try {
        const response = await axios.post(`${BITRIX_WEBHOOK_URL}im.message.add`, {
            DIALOG_ID: "chat1", // Change this to the user or chat ID in Bitrix24
            MESSAGE: `User: ${userMessage}\nBot: ${botResponse}`
        });
        console.log("Message sent to Bitrix24:", response.data);
    } catch (error) {
        console.error("Error sending to Bitrix24:", error);
    }
}

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    let botResponse = "I'm sorry, I didn't understand that.";

    if (userMessage.includes('hello')) {
        botResponse = "Hi there! How can I assist you?";
    } else if (userMessage.includes('help')) {
        botResponse = "Sure! What do you need help with?";
    } else if (userMessage.includes('bye')) {
        botResponse = "Goodbye! Have a great day!";
    }

    // Send response to Bitrix24
    await sendToBitrix24(userMessage, botResponse);

    res.json({ reply: botResponse });
});

app.listen(PORT, () => {
    console.log(`Chatbot API is running on http://localhost:${PORT}`);
});
