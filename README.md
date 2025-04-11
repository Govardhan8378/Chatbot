# 🛒 AI-Powered customer Query Assistant Website with Chatbot

This project is a full-stack e-commerce platform integrated with an AI chatbot (powered by Cohere AI) that allows users to:
- Browse products from various categories
- Place and track orders
- Interact via an AI assistant
- Get recommendations, jokes, and support

Built with:
- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose)
- **AI Integration:** Cohere AI

---

## 🚀 Features

### 🔍 Product Features
- View products by categories (mobile, computer, furniture, etc.)
- Search products by name or brand
- Detailed product info (name, image, price, brand)

### 🛒 Order Management
- Place orders through chatbot commands
- Track, cancel, and view orders by product name or user
- Store all orders in MongoDB

### 🤖 Chatbot Features
- Built using **Cohere AI**
- Understands natural language queries
- Handles:
  - Product search
  - Order placement
  - Order tracking and cancellation
  - Customer greetings, jokes, support

### 👨‍💼 Admin Features (optional future scope)
- Add/Edit/Delete Products
- Manage Orders

---

## 📁 Folder Structure
project-root/ 
├── backend/ │ ├── config/ # DB & API config │ ├── controllers/ # Product & order logic │ ├── models/ # Mongoose schemas │ ├── routes/ # API route definitions │ ├── utils/ # Static product datasets │ ├── server.js # Entry point │ └── chatbot.js # Cohere AI logic
├── frontend/ │ ├── public/ # Static assets │ ├── src/ │ │ ├── components/ # Chatbot, product cards, etc. │ │ ├── pages/ # Home, Products, Orders │ │ ├── context/ # Global state │ │ ├── services/ # API services │ │ └── App.js # Main App │ └── index.html ├── .env # API keys, DB URIs ├── package.json └── README.md

cd backend
npm install
# Add your MongoDB URI and Cohere API Key to .env
npm start


cd ../frontend
npm install
npm start




💬 Chatbot Commands (Examples)
Command	Action
Search iPhone	Lists matching products
Order Samsung	Places an order
Track Samsung	Returns order status
Cancel Samsung	Cancels the order
Show mobiles	Lists mobile products
Tell me a joke	Responds with a joke
🧠 AI Chatbot
Uses Cohere AI for natural language understanding

Responds based on product dataset and order database

Intelligent, conversational, and context-aware

📦 Technologies Used
React.js (Frontend UI)

Node.js + Express (Backend API)

MongoDB + Mongoose (Database)

Cohere AI (Chatbot intelligence)

CSS/Tailwind (Styling)





