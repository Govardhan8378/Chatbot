import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import Nav from '../components/Nav'

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", type: "text", text: "Hi! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", type: "text", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      if (Array.isArray(data.products)) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", type: "products", products: data.products },
          {
            sender: "bot",
            type: "text",
            text: "Would you like to order any of these items? Please type the product name to proceed.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", type: "text", text: data.reply },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", text: "Error getting response." },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };
  return (
    <>
      <Nav />
      <div className="chat-wrapper">
        <div className="chat-container">
          <center><h1 className="title">GG site Chatbot</h1></center>
          <div className="messages">
            {messages.map((msg, idx) =>
              msg.type === "text" ? (
                <div key={idx} className={`message ${msg.sender}`}>
                  <div className="bubble">{msg.text}</div>
                </div>
              ) : (
                <div key={idx} className="message bot">
                  <div className="bubble product-list">
                    {msg.products.map((product) => (
                      <div key={product.id} className="product-card">
                        <p>ID:{product.id}</p>
                        <img src={product.image} alt={product.product} />
                        <div className="info">
                          <h4>{product.product}</h4>
                          <p className="brand">
                            {product.company || product.brand || product.author}
                          </p>
                          <p className="price">${product.price}</p>
                          <p>{product.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </div>
  
          <div className="input-row">
            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
  
  
};

export default Chatbot;
