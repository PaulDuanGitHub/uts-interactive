import express from 'express';
const app = express();
import { createServer } from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import esm from 'express-status-monitor';
import readline from 'readline';
var users = {}
var gameStarted = false
var results = {}

app.use(cors());
app.use(esm());
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000","http://127.0.0.1:3000","https://paulduangithub.github.io"],
		methods: ["GET", "POST"],
		credentials: true
	}
});

app.post('/api/join-room', function (req, res) {
    // console.log("test");
})

io.on('connection', (socket) => {
    socket.on("disconnect", () => {
        // console.log(socket.id, "left the game", "current player: ", Object.keys(users).length);
        delete users[socket.uuid]
        io.sockets.emit("playerLeaved",socket.uuid)
    })

	socket.on("joinRoom", (data) => {
        socket.emit("ok",data)
	})
    
    socket.on("joined", (data) => {
        // console.log(data.uuid);
        users[data.uuid] = {name: data.name, position: data.position, velocity: data.velocity}
        users[data.uuid].socketID = socket.id
        socket.uuid = data.uuid
        // console.log(data.name, " joined the game, current player: ", Object.keys(users).length);
        io.sockets.emit("update",{users:users,joinedPlayerName:data.name,gameStarted:gameStarted})
        // console.log(users);
        var list = Object.values(results).sort((a,b)=>{
            a.result-b.result
        })
        // console.log(results,list)
        io.sockets.emit("updateRanking",list)
	})

    socket.on("moving", (data) => {
        // console.log(data.position);
        if(users[data.uuid]!=undefined) {
            users[data.uuid].position = data.position
            users[data.uuid].velocity = data.velocity
            users[data.uuid].powered = data.powered
            users[data.uuid].sleeping = data.sleeping
            // console.log(data.name, " is moving, position:", data.position, " velocity: ",data.velocity, Object.values(users));
            var updatePack = {}
            updatePack[data.uuid] = users[data.uuid]
            io.sockets.emit("updatePosition",updatePack)
            // console.log(socket.bytesSend);
        }
    })

    socket.on("arrive", (data) => {
        results[data.uuid] = {name:data.name,result:data.result}
        var list = Object.values(results).sort((a,b)=>{
            return a.result-b.result
        })
        // console.log(results,list)
        io.sockets.emit("updateRanking",list)
    })
})

server.listen(8888, () => {
	console.log('listening on *:8888');
    const read = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      read.question('Start the game?', answer => {
        gameStarted = true
        io.sockets.emit("gameStart")
      });
});
