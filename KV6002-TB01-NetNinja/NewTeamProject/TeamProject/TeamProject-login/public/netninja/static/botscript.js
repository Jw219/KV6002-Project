// toggle for the chatbot
function toggleChatbot() {
    const chatbotBox = document.getElementById('chatbot-box');
    chatbotBox.style.display = chatbotBox.style.display === 'none' || chatbotBox.style.display === '' 
        ? 'flex' 
        : 'none';
}

// Send user query to the backend
async function sendMessage() {
    const queryInput = document.getElementById('query');
    const messagesDiv = document.getElementById('chatbot-messages');
    const query = queryInput.value.trim();

    if (!query) return;

    // display user message in the chat
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.textContent = query;
    messagesDiv.appendChild(userMessage);
    queryInput.value = '';

    // auto scroll for the chat section
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // send query
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });
        const data = await response.json();

        // output the chat bot repsonse.
        const botMessage = document.createElement('div');
        botMessage.className = 'bot-message';
        botMessage.textContent = data.answer || "Sorry, I couldn't process that.";
        messagesDiv.appendChild(botMessage);
    } catch (err) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'bot-message';
        errorMessage.textContent = "Error connecting to the chatbot.";
        messagesDiv.appendChild(errorMessage);
    }

    // scroll to the latest message
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
