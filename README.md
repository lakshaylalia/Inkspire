# 🖋️ Inkspire – A Social Content Sharing Platform

Inkspire is a full-stack content-sharing web application inspired by Medium. It allows users to create, explore, and engage with articles while providing features like likes, comments, and a user profile system. Built using the MERN stack with a focus on clean architecture and real-world functionality.

---

## 🚀 Features

- ✍️ Create, edit, and delete posts with Markdown-style formatting
- ❤️ Like/unlike posts with instant feedback (AJAX-based)
- 💬 Comment on articles to engage in discussions
- 👤 User profile pages with post history
- 🔄 Follower/Following system (*in development*)
- 🌗 Dark mode and responsive UI
- 🔍 Post search and sorting (upcoming)

---

## 🛠️ Tech Stack

| Category         | Technologies                                |
|------------------|---------------------------------------------|
| Frontend         | EJS, Tailwind CSS, Vanilla JS (AJAX)        |
| Backend          | Node.js, Express.js                         |
| Database         | MongoDB, Mongoose                           |
| Authentication   | Session-based                 |
| Architecture     | MVC structure, RESTful APIs                 |
| Deployment       | Coming soon (Render / Vercel / Railway)     |

---


## 🧪 Installation & Setup

1. **🔧 Clone the repo**
   ```bash
   git clone https://github.com/yourusername/inkspire.git
   cd inkspire

2. **📦 Install dependencies**
   ```bash
     npm install

3. **🔐 Create a .env file in the root folder with:**
    ```bash
       PORT=5000
       MONGO_URI=your_mongodb_uri
       SESSION_SECRET=your_random_secret
    
4 .**🚀 Start the server**
  ```bash
    npm run dev

