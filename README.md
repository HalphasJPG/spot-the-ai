# Spot the AI Image - 1v1 Multiplayer Challenge 👁️✨

A real-time, 1v1 multiplayer web game where players compete to see who is better at spotting the difference between real photographs and AI-generated images.

## Features
* **1v1 Multiplayer:** Generate a unique 4-letter room code to challenge a friend.
* **Solo Mode:** Practice identifying images on your own.
* **Real-time Sync:** Powered by Socket.io, the game waits for both players to finish before calculating the winner.
* **Victory Effects:** Custom confetti animations for the winner!

## Tech Stack
* **Frontend:** HTML, CSS (Syne & DM Mono fonts), JavaScript
* **Backend:** Node.js, Express
* **Multiplayer:** Socket.io

---

## 🚀 Deployment Instructions (AWS / Host Setup)

To get this game running on a live server, follow these steps:

**1. Clone the repository**
\`\`\`bash
git clone https://github.com/YOUR-USERNAME/spot-the-ai-game.git
cd spot-the-ai-game
\`\`\`

**2. Install Dependencies**
This project requires Node.js. Install the required packages (`express` and `socket.io`) by running:
\`\`\`bash
npm install
\`\`\`

**3. Start the Server**
\`\`\`bash
npm start
\`\`\`
*(The server runs on port 3000 by default. Make sure port 3000 is open in your AWS security group, or set up a reverse proxy like Nginx to route traffic from port 80/443 to 3000).*

---

## 🎮 How to Play
1. **Host a Game:** Click "1v1 Multiplayer" -> "Create New Room". Share the 4-letter code with your opponent.
2. **Join a Game:** Click "1v1 Multiplayer" -> Enter the 4-letter code -> Click "Join Room".
3. **The Challenge:** Two images will appear. Click the one you believe is the **real photograph**. 
4. **Winning:** The player with the most correct guesses at the end of the round wins. Tie-breakers result in a draw.