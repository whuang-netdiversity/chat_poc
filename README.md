# Chat POC

**Chat POC** is a proof-of-concept real-time chat application that demonstrates key functionalities such as real-time messaging, duplicate prevention, dynamic message formatting, audio notifications, and user authentication integration with Firebase.

## Table of Contents

- [Chat POC](#chat-poc)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Installation](#installation)
  - [Running the Application using http-server](#running-the-application-using-http-server)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)

## Features

- **Real-Time Messaging:**  
  Subscribes to a static chat room (e.g., `room.1`) using Firestore’s `onSnapshot` listener to display new messages in real time.

- **Duplicate Prevention:**  
  Uses arrays (`shownMessages` and `shownDates`) to track and prevent the display of duplicate messages and date headers.

- **Dynamic Message Rendering:**  
  - Differentiates between sent and received messages.
  - Displays the sender’s name conditionally—only if the sender differs from the previous message.
  - Inserts date headers when a new day is detected, formatted using customizable date options.

- **Audio Notifications:**  
  Plays an audio clip from an HTML audio element when a new message is received from another user.

- **User Authentication & Personalized Greetings:**  
  Integrates with Firebase Authentication (via `thoriumapi.firebase`) to manage user sessions and update the UI with a personalized greeting once the user is authenticated.

- **Event-Driven UI Updates:**  
  Leverages jQuery for event handling, including sending messages, logging out, and page navigation (e.g., subscribing/unsubscribing from chat updates).

## Technologies

- **JavaScript (ES6+):**  
  Utilizes modern JavaScript features such as arrow functions, template literals, and async/await.

- **Firebase Firestore:**  
  Provides a real-time database for storing and streaming chat messages.

- **Firebase Authentication:**  
  Manages user authentication and session state.

- **jQuery:**  
  Handles DOM manipulation and event binding.

- **(Optional) UI Frameworks:**  
  The usage of page lifecycle events (e.g., `page:init`) hints at possible integration with frameworks like Framework7 or similar for mobile/web applications.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/whuang-netdiversity/chat_poc.git
   cd chat_poc

## Running the Application using http-server

1. **Run the Server:**

    ```bash
    npx http-server .

2. **Access the App:**
    Open your browser and navigate to the URL provided by `http-server` (typically `http://localhost:8080`).
    See Chat POC running in your local environment.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgements

- **Firebase Documentation:**  
  For detailed guides and use cases regarding Firestore and Firebase Authentication [LINK](https://firebase.google.com/docs/firestore/query-data/get-data).

- **Framework7 Documentation:**  
  For the fantastic UI framework that powers mobile and desktop applications [LINK](https://framework7.io/docs/messages).
