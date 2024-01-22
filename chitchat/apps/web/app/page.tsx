'use client'
import { useState } from "react";
import { useSocket } from "../context/SocketProviderContext";
import classes from "./page.module.css";

export default function Page() {
  const {sendMessage} = useSocket();
  const [message, setMessage] = useState('');

  return (
    <div>
      <h1>ChitChat</h1>
      <div>
        <input 
            onChange={e => setMessage(e.target.value)}
            className={classes["chat-input"]} 
            type="text"/>
        <button 
            onClick={e => sendMessage(message)}
            className={classes["chat-button"]} > Send</button>
      </div>
    </div>

  )
}