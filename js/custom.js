// Chat POC
const messages = '#messages-container'; // Message container
let shownMessages = []; // Track messages already displayed to prevent duplicates
let shownDates = []; // Track dates already displayed to prevent duplicates
let showReceiver = false; // Show receiver name
let lastUserId = null; // Last receiver user ID
let lastChatId = null; // Chat ID
let lastUserName = null; // Last user name
const audio = $('#pop')[0]; // Get the audio element
let chatRoom = null; // Chatroom subscription
let lastRoom = null; // Last room

// Date options
const dateOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
};

// Time options
const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
};

// Check app initialized state
if (app.initialized === true) {
    app.emit('onAuthStateChanged', thoriumapi.firebase.getUser()); // Emit auth state
}

// Handle auth state changes
app.on('onAuthStateChanged', (user) => {
    const auth = user;

    if (auth) {
        $('#title-o-1008').text(`Hi, ${auth.displayName}`);
    }
});

// Function to notify recipients of new messages
function notifyRecipients(id) {
    if (id !== thoriumapi.firebase.getUser().uid) {
        audio.play();
    }
}

// Function to push the message to the display
function pushDisplay(data) {
    if (!shownMessages.includes(data.time_stamp)) {
        shownMessages.push(data.time_stamp);
        $(messages).append(data.message);
    }
}

// Check if the date has already been displayed
function checkDate(date) {
    if (!shownDates.includes(date)) {
        shownDates.push(date);
        $(messages).append(messageTitle(date));
    }
}

// Check if the user has already been displayed
function checkDisplay(id, name) {
    if (id === thoriumapi.firebase.getUser().uid) {
        showReceiver = false;
        lastUserId = null;
        lastUserName = null;
    }
    else {
        showReceiver = lastUserId !== id;
        lastUserId = id;
        lastUserName = name;
    }
}

// Check if it's a sent message or received message
const checkMessage = (data) => {
    return data.user_id === thoriumapi.firebase.getUser().uid
        ? itemize(null, showReceiver, data.msg_text, data.chat_id)
        : itemize(data.user_name, showReceiver, data.msg_text, data.chat_id);
};

// Function to format message title
const messageTitle = (title) => {
    const msgTpl = `
        <div class="messages-title">${title}</div>
    `;
    return msgTpl;
};

// Function to format messages
const itemize = (name, show, msg, chatId) => {
    let msgTpl;

    if (name) {
        const names = show ? `<div id="${chatId}" class="messages-name">${name}</div>` : '';
        msgTpl = `
            <div class="message message-received">
                <div class="message-content">
                    ${names}
                    <div class="message-bubble">
                        <div class="message-text">${msg}</div>
                    </div>
                </div>
            </div>
        `;
    }
    else {
        msgTpl = `
            <div class="message message-sent">
                <div class="message-content">
                    <div class="message-bubble">
                        <div class="message-text">${msg}</div>
                    </div>
                </div>
            </div>
        `;
    }
    return msgTpl;
};

// Handle new messages in Firestore
const subscribe = () => {
    const ref = firestoredb
        .collection(lastRoom)
        .orderBy('time_stamp')
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const msgData = change.doc.data();
                const date = new Date(msgData.time_stamp * 1000);

                // Check if the user has already been displayed
                checkDisplay(msgData.user_id, msgData.user_name);

                // Check if it's a sent message or received message
                const message = checkMessage(msgData);

                // Check if the date has already been displayed
                checkDate(date.toLocaleString('en-US', dateOptions).replaceAll(',', ''));

                // Append the message to the container
                pushDisplay({ time_stamp: msgData.time_stamp, message: message });

                // Update message time stamp
                const time = date.toLocaleTimeString('en-US', timeOptions);
                $('#' + msgData.chat_id).text(lastUserName + ' ' + time);

                // Play the audio received notification
                notifyRecipients(msgData.user_id);

                // Set the last chat ID
                lastChatId = thoriumapi.firebase.getUser().uid === msgData.user_id ? msgData.chat_id : null;

                // Scroll to the bottom of the page
                $('.page-content').scrollTop(10000, 400);
            });
        });

    return ref;
};

// Handle sending the message
$(document).on('click', '#obj-33', (e) => {
    e.preventDefault();

    const msgInput = '#obj-99';
    const msgVal = $(msgInput).val().trim();

    if (msgVal !== '') {
        $(msgInput).val(null); // Clear the input field

        // Add message to Firestore
        (async () => {
            try {
                // Set the last chat ID
                lastChatId = !lastChatId ? 'chat_' + Math.round(+new Date() / 1000) : lastChatId;

                await firestoredb.collection(lastRoom).add({
                    room_id: lastRoom,
                    chat_id: lastChatId,
                    msg_text: msgVal,
                    user_id: thoriumapi.firebase.getUser().uid,
                    user_name: thoriumapi.firebase.getUser().displayName,
                    time_stamp: Math.round(+new Date() / 1000),
                });
            }
            catch (err) {
                console.error('Error adding message: ', err.message);
            }
        })();
    }
});

// Handle getting all messages in default room
$(document).on('page:init', '.page[data-name="chat"]', (e) => {
    const page = e.detail;
    shownDates = []; // Reset shown dates
    shownMessages = []; // Reset shown messages
    lastUserId = null; // Reset last user ID
    lastRoom = 'room.1'; // Change to static room
    chatRoom = subscribe(); // Subscribe to messages
});

// Handle logging out the user
$(document).on('click', '#button-1073', (e) => {
    e.preventDefault();
    thoriumapi.firebase.logout(); // Logout the user
});

// Handle switching to the main page
$(document).on('click', '#o-1088', function (e) {
    e.preventDefault();
    chatRoom(); // Unsubscribe from messages
});
