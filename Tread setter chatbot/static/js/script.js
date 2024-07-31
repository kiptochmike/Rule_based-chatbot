// images
var userAvatarUrl = "{{ url_for('static', filename='images/avatar.jpg') }}";
var botAvatarUrl = "{{ url_for('static', filename='images/bot.jpg') }}";

// Function to create a message element
function createMessageElement(message, type) {
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);

    let avatarDiv = document.createElement("div");
    avatarDiv.classList.add("avatar");
    if (type === 'user') {
        avatarDiv.style.backgroundImage = `url(${userAvatarUrl})`; // User avatar
    } else {
        avatarDiv.style.backgroundImage = `url(${botAvatarUrl})`; // Bot avatar
    }

    let textDiv = document.createElement("div");
    textDiv.classList.add("text");
    textDiv.innerHTML = message;

    let timestampDiv = document.createElement("div");
    timestampDiv.classList.add("timestamp");
    timestampDiv.innerHTML = new Date().toLocaleTimeString();

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(textDiv);
    messageDiv.appendChild(timestampDiv);

    return messageDiv;
}

// Function to add a message to the chat
function addMessageToChat(messageElement) {
    let chatBox = document.getElementById("chat-box");
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to handle sending a message
function sendMessage(userInput) {
    if (userInput.trim() === '') return;

    var userMessage = createMessageElement(userInput, 'user');
    addMessageToChat(userMessage);

    fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'user_input=' + encodeURIComponent(userInput)
    })
    .then(response => response.json())
    .then(data => {
        var botMessage = createMessageElement(data.response, 'bot');
        addMessageToChat(botMessage);
        document.getElementById('user-input').value = '';
    })
    .catch(error => {
        console.error('Error:', error);
        var errorMessage = createMessageElement("There was an error processing your request. Please try again.", 'bot');
        addMessageToChat(errorMessage);
        document.getElementById('user-input').value = '';
    });
}

// Function to send the initial welcome message
function sendInitialMessage() {
    var initialMessage = createMessageElement("My name is Treadsetter. How may I help you today?", 'bot');
    addMessageToChat(initialMessage);
}

// Run this function when the page loads
window.onload = function() {
    sendInitialMessage();
};

// Event listener for the send button
document.querySelector('button').addEventListener('click', function() {
    var userInput = document.getElementById('user-input').value;
    sendMessage(userInput);
});
