import express from 'express';
const app = express();
import { createServer } from 'http';
import { Server } from "socket.io";
import cors from 'cors';

var users = {}

app.use(cors());
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000","http://127.0.0.1:3000","https://paulduangithub.github.io"],
		methods: ["GET", "POST"],
		credentials: true
	}
});

app.post('/api/join-room', function (req, res) {
    console.log("test");
})

io.on('connection', (socket) => {
	socket.on("joinRoom", (data) => {
        console.log(data.uuid);
        socket.emit("ok",data)
	})

    socket.on("joined", (data) => {
        // console.log(data.uuid);
        users[data.uuid] = {name: data.name, position: data.position}
        io.sockets.emit("update",users)
        // console.log(users);
	})

    socket.on("moving", (data) => {
        // console.log(data.position);
        if(users[data.uuid]!=undefined) {
            users[data.uuid].position = data.position
            io.sockets.emit("updatePosition",users)
        }
    })
})

server.listen(8888, () => {
	console.log('listening on *:8888');
});