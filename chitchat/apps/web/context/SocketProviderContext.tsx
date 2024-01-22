'use client'

import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";


interface SocketProviderrProps {
    children: React.ReactNode
}

interface ISocketContext {
    sendMessage: (msg: string) => any;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

// Custom hook for socket
export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) throw new Error('state is undefined');

    return state;
}

export const SocketProvider: React.FC<SocketProviderrProps> = ({children}) => {
    const [socket, setSocket] = useState<Socket>()

    const sendMessage: ISocketContext["sendMessage"] = useCallback(
        (msg) => {
        console.log("Send Message", msg);
        if (socket) {
            socket.emit("event:message", {message: msg})
        };
    }, [socket]);

    useEffect(() => {
        const _socket = io('http://localhost:8000');
        setSocket(_socket);
        return () => {
            _socket.disconnect();
            setSocket(undefined);
        }
    }, []);
    return (
        <SocketContext.Provider value={{sendMessage}}>
            {children}
        </SocketContext.Provider>
    )
}