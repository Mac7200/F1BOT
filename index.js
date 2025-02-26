const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Use middleware before your routes
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT; // Use Render's provided port
console.log("PORT from environment:", process.env.PORT);

// Root route for quick verification
app.get('/', (req, res) => {
  res.send('Hello, Render! Your API is running.');
});

// Function to send a message to Bitrix24
async function sendToBitrix24(userMessage, botResponse) {
  try {
    const response = await axios.post(`${process.env.BITRIX_WEBHOOK_URL}im.message.add`, {
      DIALOG_ID: "chat1",
      MESSAGE: `User: ${userMessage}\nBot: ${botResponse}`
    });
    console.log("Message sent to Bitrix24:", response.data);
  } catch (error) {
    console.error("Error sending to Bitrix24:", error);
  }
}

// Chatbot endpoint
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

  await sendToBitrix24(userMessage, botResponse);
  res.json({ reply: botResponse });
});

// Start the server (only one call)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
