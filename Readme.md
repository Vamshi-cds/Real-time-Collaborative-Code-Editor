# 🚀 Real-Time Collaborative Code Editor  

Hey there! 👋 This is my **Real-Time Collaborative Code Editor**, built as part of my school project. The goal is to create a web-based code editor where multiple people can edit code together in real-time, just like Google Docs but for programming.  

> **⚠ Note:** This is a **local project**, meaning I’m not hosting it online—just running it on my own computer for testing and learning purposes. 🚀  

---

## 📌 Features  

✅ **Real-time editing** – Multiple users can type at the same time.  
✅ **Live cursor tracking** – See where others are editing.  
✅ **Basic syntax highlighting** – Thanks to Monaco Editor (the one VS Code uses).  
✅ **WebSocket communication** – Instant updates without page refresh.  

---

## 📂 Folder Structure  

📦 real-time-code-editor ┣ 📂 frontend # React app (Monaco Editor) ┃ ┣ 📜 package.json # Dependencies ┃ ┣ 📜 src/ ┃ ┃ ┣ 📜 App.js # Main React component ┃ ┃ ┣ 📜 editor.js # Code editor setup ┃ ┃ ┗ 📜 index.js # Entry point ┃ ┗ 📜 public/ ┃ ┗ 📜 index.html # HTML template ┣ 📂 backend # Spring Boot WebSocket server ┃ ┣ 📜 src/main/java/com/editor # Java code ┃ ┣ 📜 application.properties # Config file ┃ ┣ 📜 WebSocketConfig.java # WebSocket setup ┃ ┗ 📜 CodeEditorHandler.java # Handles WebSocket messages ┣ 📂 websocket-server # Alternative WebSocket server using Django ┃ ┣ 📜 asgi.py # ASGI WebSocket setup ┃ ┣ 📜 editor_server.py # Handles WebSocket connections ┃ ┗ 📜 requirements.txt # Python dependencies ┗ 📜 README.md


---

## 🛠 How to Run It  

### **1️⃣ Clone the Repo**  
```sh
git clone https://github.com/your-username/your-repository.git
cd real-time-code-editor
2️⃣ Start the Backend (Spring Boot WebSocket Server)
sh
Copy
Edit
cd backend
mvn clean install
java -jar target/backend-app.jar
The WebSocket server will start on ws://localhost:8080/

3️⃣ Start the Frontend (React App with Monaco Editor)
sh
Copy
Edit
cd frontend
npm install
npm start
The frontend will be available at http://localhost:3000/

4️⃣ (Optional) Start the Alternative WebSocket Server (Python + Daphne)
If you want to use the Django ASGI WebSocket server instead of Spring Boot:

sh
Copy
Edit
cd websocket-server
pip install -r requirements.txt
daphne -b 0.0.0.0 -p 8000 editor_server.asgi:application
This runs on ws://localhost:8000/

🚀 Why I Built This
I wanted to challenge myself by building a real-time app using WebSockets. Most of my projects have been simple CRUD apps, so this was a fun way to learn about:

WebSockets (for instant communication between users).
Spring Boot + React (for backend & frontend).
Monaco Editor (because I wanted something that feels like VS Code).
Redis (planned feature) for session management (not yet implemented).
