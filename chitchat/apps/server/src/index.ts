import http from "http";
import SocketService from "./services/socket";

async function init() {

    const socketSerice = new SocketService();

    const httpServer = http.createServer();
    const PORT = process.env.PORT || 8000;

    socketSerice.io.attach(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`HTTP Server running on ${PORT}`)
    });

    socketSerice.initEventListener();
}

init();