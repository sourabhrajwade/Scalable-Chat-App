'use client'
import { useState } from "react";
import { useSocket } from "../context/SocketProviderContext";
import classes from "./page.module.css";

export default function Page() {
  const {sendMessage, messages} = useSocket();
  const [message, setMessage] = useState('');
  console.log("messages from ui", messages)
  return (
    <div>
      <h1>ChitChat</h1>
      <div>
        <input 
            className={classes["chat-input"]}
            onChange={e => setMessage(e.target.value)}
            placeholder="Message..."
            />
        <button 
            onClick={e => sendMessage(message)}
            className={classes["chat-button"]} > Send</button>
      </div>
      <div className="">
        {messages.map((e, i) => (
          <li>{i}{e}</li>
        ))}
      </div>
    </div>

  )
}