document.addEventListener('DOMContentLoaded', function() {
    // Refresh button functionality
    document.getElementById('refresh-button').addEventListener('click', function() {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = ''; 
        const welcomeMessage = document.createElement('div');
        welcomeMessage.classList.add('chat-message', 'bot-message');
        welcomeMessage.textContent = 'Welcome to the Sales Chatbot! Type an item description or size to get details.';
        chatBox.appendChild(welcomeMessage);
    });

    // Send button functionality
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
            })
            .catch(error => console.error('Error:', error)); // Handle any errors
    });

    // Dynamic Promo Text with typing effect
    const promoText = document.getElementById('promo-text');
    const messages = [
        "Welcome to Tread Setters Assistant!",
        "Speak with our chatbot today!",
        "Get instant help from our chatbot!",
        "Retrieve Data Information from our assistant",
        
        
    ];
    
    // Function to type text with a typing animation
    function typeText(text, element, callback) {
        let i = 0;
        element.textContent = '';
        const typingInterval = setInterval(function() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                if (callback) callback();
            }
        }, 80); // typing speed here
    }
    
    // Function to change the promo text periodically with typing effect
    let index = 0;
    function changePromoText() {
        const nextMessage = messages[index];
        typeText(nextMessage, promoText, function() {
            index = (index + 1) % messages.length;
            setTimeout(changePromoText, 2000); // Pause before changing text
        });
    }
    
    changePromoText(); // Start typing effect
});
