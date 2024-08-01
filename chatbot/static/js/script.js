document.getElementById('send-button').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') {
        return;
    }

    // Display user's message
    const chatBox = document.getElementById('chat-box');
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('chat-message', 'user-message');
    userMessageDiv.textContent = userInput;
    chatBox.appendChild(userMessageDiv);
    document.getElementById('user-input').value = '';

    // Fetch data from server
    fetch(`/search?item_description=${encodeURIComponent(userInput)}`)
        .then(response => response.json())
        .then(data => {
            const botMessageDiv = document.createElement('div');
            botMessageDiv.classList.add('chat-message', 'bot-message');

            if (Array.isArray(data)) {
                if (data.length === 0) {
                    botMessageDiv.textContent = 'No items found';
                } else {
                    botMessageDiv.innerHTML = data.map(item => `
                        <strong>Brand:</strong> ${item.Brand}<br>
                        <strong>Tyre Pattern:</strong> ${item.TyrePattern}<br>
                        <strong>Head Office Stock:</strong> ${item.HeadOffice}<br>
                        <strong>Mombasa Stock:</strong> ${item.Mombasa}<br>
                        <strong>MSA Road Stock:</strong> ${item['MSA Road']}<br>
                        <strong>Total Stock:</strong> ${item.Total}<br>
                        <strong>List Price:</strong> ${item.ListPrice}<br>
                        <strong>Retrieved At:</strong> ${item.Timestamp}<br><br>
                    `).join('');
                }
            } else {
                botMessageDiv.textContent = data.error || 'An error occurred';
            }
            chatBox.appendChild(botMessageDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        });
});
