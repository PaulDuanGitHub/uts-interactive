import { Component, createFactory, createRef } from 'react';
import Matter from 'matter-js';
import io from 'socket.io-client';
import { url, isSocket } from "./Api.js";
import { v4 } from 'uuid';
import MyRender from './MyRender';
import { Col, Row, Form } from 'react-bootstrap';
import 'pathseg'
import titleURL from './assets/map/lobby/title.png'
import checkPointURL from './assets/map/checkpoint3.png'
import bookingsURL from './assets/map/Bookings.png'
import sharepointURL from './assets/map/SharePoint.png'
import buildMap from './buildMap.js';

export class MyComponent extends Component {
	Engine;
	Render;
	Bodies;
	Composite;
	Runner;
	engine;
	myRender;
	constructor() {
		super();
		this.gameCanvas = createRef();
		this.nameInput = createRef();
		this.messageList = createRef();
		this.timer = createRef();
		this.rankingList = createRef();
	}

	state = {
		onGround: true,
		joined: false,
		socket: io.connect(isSocket ? "https://api.paulduan.tk/" : "http://127.0.0.1:8888/", isSocket ? { path: '/uts-interactive/socket.io' } : {}),
		player: Matter.Bodies.rectangle(200, 200, 80, 80, { inertia: Infinity }),
		other_player: {},
		willBounce: [false,0],
		players: 0,
		gate: undefined,
		// startTime:0,
		// spawnPoint: { x: 10700, y: 300 } // Sheridan
		// spawnPoint: { x: 2300, y: 300 } // BSB
		// spawnPoint: { x: 3500, y: 300 } // 248
		// spawnPoint: { x: 5727, y: 530 } // Bee
		spawnPoint: { x: 600, y: 400 }
		// springs: []
	}

	keyboard = (keyCode) => {
		let key = {};
		key.code = keyCode;
		key.isDown = false;
		key.isUp = true;
		key.press = undefined;
		key.release = undefined;
		key.interval = undefined;
		//The `downHandler`
		key.downHandler = event => {
			// console.log(key.code, this.state.onGround);
			if (event.keyCode === key.code) {
				if (key.isUp && key.press) {
					if (key.code === 38) {
						if (this.state.onGround) {
							key.press();
						}
					} else {
						key.interval = setInterval(() => {
							key.press();
						});
						// key.press();
					}
				}
				console.log("key press");
				key.isDown = true;
				key.isUp = false;
			}
			if (event.keyCode > 36 && event.keyCode < 40) {
				event.preventDefault();
			}
		};

		//The `upHandler`
		key.upHandler = event => {
			console.log(event);
			if (event.keyCode === key.code) {
				if (key.isDown && key.release) {
					key.release()
					clearInterval(key.interval)
				};
				console.log("key release");
				key.isDown = false;
				key.isUp = true;
			}
			if (keyCode > 36 && keyCode < 40) {
				event.preventDefault();
			}
		};

		//Attach event listeners
		window.addEventListener(
			"keydown", key.downHandler.bind(key), true
		);
		window.addEventListener(
			"keyup", key.upHandler.bind(key), true
		);
		// this.gameCanvas.current.addEventListener("blur", key.upHandler.bind(key), false)
		return key;
	}

	registerSocketListener = () => {
		this.state.socket.on("ok", (data) => {
			let boxC = this.Bodies.rectangle(this.state.spawnPoint.x, this.state.spawnPoint.y, 25, 63, {
				inertia: Infinity,
				render: {
					lineWidth: 0
				}
			})
			console.log("北京正常", boxC);
			boxC.bodyType = "player"
			boxC.uuid = data.uuid
			boxC.name = data.name
			boxC.friction = 0
			boxC.frictionAir = 0
			boxC.collisionFilter = {
				category: 0x0002,
				mask: 0x0001
			}
			this.setState({ player: boxC }, () => {
				Matter.World.add(this.engine.world, boxC)
				this.state.socket.emit("joined", { name: boxC.name, uuid: boxC.uuid, position: boxC.position, velocity: boxC.velocity })
			})
		})

		this.state.socket.on("update", (data) => {

			if (data.gameStarted) {
				Matter.World.remove(this.engine.world, this.state.gate)
			}

			var bodies = this.Composite.allBodies(this.engine.world)
			var bodiesUUID = []
			bodies.forEach(body => {
				if (body.uuid != undefined) {
					bodiesUUID.push(body.uuid)
				}
			});

			console.log("update bodies", data, bodiesUUID);
			var new_other_player = this.state.other_player
			console.log(data);
			Object.keys(data['users']).forEach((player) => {
				if (!bodiesUUID.includes(player)) {
					console.log("------", data['users'][player]);
					let boxD = this.Bodies.rectangle(this.state.spawnPoint.x, this.state.spawnPoint.y, 25, 63, {
						inertia: Infinity, isStatic: true,
						render: {
							lineWidth: 0
						},
						position: data['users'][player].position,
						velocity: data['users'][player].velocity,
						collisionFilter: {
							category: 0x0002,
							mask: 0x0001
						}
					})
					boxD.uuid = player
					boxD.bodyType = "player"
					boxD.name = data['users'][player].name
					Matter.World.add(this.engine.world, boxD)
					new_other_player[boxD.uuid] = boxD
				}
			})
			this.setState({ other_player: new_other_player, players: Object.keys(data['users']).length }, () => {
				this.pushMessage(data["joinedPlayerName"])
			})
		})

		this.state.socket.on("updatePosition", (data) => {
			if (Object.keys(this.state.other_player).length !== 0) {
				var player = Object.keys(data)[0]
				if (player != this.state.player.uuid) {
					var position = data[player].position;
					var velocity = data[player].velocity;
					Matter.Body.setPosition(this.state.other_player[player], position)
					Matter.Body.setVelocity(this.state.other_player[player], velocity)
					this.state.other_player[player].powered = data[player].powered
				}
			}
		})

		this.state.socket.on("playerLeaved", (uuid) => {
			var leaved = this.state.other_player[uuid]
			var new_other_player = this.state.other_player
			delete new_other_player[uuid]
			this.setState({ other_player: new_other_player, players: this.state.players - 1 }, () => {
				if (leaved != undefined) {
					Matter.World.remove(this.engine.world, leaved)
					this.pushMessage(leaved.name, false)
				}
			})
		});

		this.state.socket.on("gameStart", () => {
			// alert("gameStart")
			Matter.World.remove(this.engine.world, this.state.gate)
		})
		this.state.socket.on("updateRanking", (data) => {
			// alert('')
			this.rankingList.current.innerHTML = ""
			console.log(data);
			data.forEach((result,index) => {
				var li = document.createElement("div");
				const d = new Date(Date.UTC(0,0,0,0,0,0,result.result))
				// Pull out parts of interest
				var parts = [
					d.getUTCMinutes(),
					d.getUTCSeconds(),
					d.getMilliseconds(),
				]
				var nameSpan = document.createElement("span")
				nameSpan.appendChild(document.createTextNode(index+1+" "+result.name))
				nameSpan.style.color = "blue"
				li.appendChild(nameSpan)
				li.appendChild(document.createTextNode(`: ${parts[0]+"m "+String(parts[1]).padStart(2,'0')+"s "+String(parts[2]).padStart(3,'0')+"ms"}`));
				li.style.textAlign = "left"
				this.rankingList.current.appendChild(li)
			})
		})
	}

	bindKeys = () => {
		this.left = this.keyboard(37)
		this.up = this.keyboard(38)
		this.right = this.keyboard(39)
		let speed = 4
		let jumpForce = 0.04
		this.left.press = () => {
			// console.log("test");
			// Matter.Body.setPosition(this.state.player,{x:this.state.player.position.x-1, y:this.state.player.position.y})
			Matter.Body.setVelocity(this.state.player, Matter.Vector.create(-speed, this.state.player.velocity.y))
		}

		this.left.release = () => {
			if (!this.right.isDown) {
				Matter.Body.setVelocity(this.state.player, Matter.Vector.create(0, this.state.player.velocity.y))
			}
		}

		this.right.press = () => {
			// console.log("test");
			// Matter.Body.setPosition(this.state.player,{x:this.state.player.position.x+1, y:this.state.player.position.y})
			Matter.Body.setVelocity(this.state.player, Matter.Vector.create(speed, this.state.player.velocity.y))
		}

		this.right.release = () => {
			if (!this.left.isDown) {
				Matter.Body.setVelocity(this.state.player, Matter.Vector.create(0, this.state.player.velocity.y))
			}
		}

		this.up.press = () => {
			// console.log("test");
			this.setState({ onGround: false })
			Matter.Body.applyForce(this.state.player, { x: this.state.player.position.x, y: this.state.player.position.y }, { x: 0, y: this.state.player.powered ? -0.08 : -jumpForce });
		}

		this.up.release = () => {

		}
	}

	renderCanvas = (name) => {
		this.gameCanvas.current.innerHTML = ""
		this.Engine = Matter.Engine
		this.Render = MyRender
		this.Bodies = Matter.Bodies
		this.Composite = Matter.Composite
		this.Runner = Matter.Runner

		// 3. 创建引擎
		this.engine = this.Engine.create()

		// 4. 创建渲染器，并将引擎连接到画布上
		let render = this.Render.create({
			element: document.getElementById('game-canvas'), // 绑定页面元素
			engine: this.engine, // 绑定引擎
			options: {
				wireframes: false,
				background: "#eeeeee",
				hasBounds: true,
				// background: "#14151f",
				height: "600",
				width: "900"
			}
		})
		this.myRender = render
		// add mouse control
		var mouse = Matter.Mouse.create(this.myRender.canvas),
			mouseConstraint = Matter.MouseConstraint.create(this.engine, {
				mouse: mouse,
				constraint: {
					stiffness: 0.4,
					render: {
						visible: false
					}
				}
			});

		this.Composite.add(this.engine.world, mouseConstraint);
		// var debugBlock = this.Bodies.rectangle(200, 200, 80, 10, { inertia: Infinity, bodyType:"test", mass:5000000})

		this.registerMatterEventListener()

		// 6. 将所有物体添加到世界中
		// this.Composite.add(this.engine.world, [boxA, boxB, ground, ground2])
		var gate = this.Bodies.rectangle(1200, 550, 20, 20, { isStatic: true, render: { fillStyle: "blue" } })
		this.setState({ gate: gate })
		this.Composite.add(this.engine.world, [
			// walls
			this.Bodies.rectangle(600, 10, 1220, 20, { isStatic: true }),
			this.Bodies.rectangle(637.5, 600, 1300, 20, { isStatic: true }),
			this.Bodies.rectangle(1200, 250, 20, 500, { isStatic: true }),
			this.Bodies.rectangle(0, 300, 20, 600, { isStatic: true }),

			gate,//gate

			this.createPlatform(900, 550, 40),
			this.createPlatform(1170, 425, 40),
			this.createPlatform(1055, 350),

			this.createPlatform(1040, 500, 60),
			this.createPlatform(1170, 268, 60),
			this.createPlatform(1030, 206),
			this.createPlatform(700, 200),
			this.createPlatform(50, 200),
			this.createPlatform(845, 245),
			// this.createPlatform(375, 430, undefined, undefined, 0.8, "spring"), // spring
			this.Bodies.rectangle(375,430,80,10, {
				bodyType:"spring",
				fspring:-0.08,
				isStatic: true,
				render: {
					fillStyle: "orange"
				}
			}),
			this.createCheckPoint(80, 155),
			this.createCheckPoint(1280, 550,true),
			this.createCheckPoint(3790, 525),
			this.createCheckPoint(4250, 525),
			this.createCheckPoint(3750, 300),
			this.createCheckPoint(4265, 50),
			this.createCheckPoint(5600, 530),

			this.Bodies.rectangle(1400, 600, 50, 50, {
				isStatic: true,
				render: {
					sprite: {
						texture: bookingsURL,
						xOffset: 0,
						yOffset: 0,
					}
				}
			}),
			this.Bodies.rectangle(1550, 600, 50, 50, {
				isStatic: true,
				render: {
					sprite: {
						texture: sharepointURL,
						xOffset: 0,
						yOffset: 0,
					}
				}
			}),
			this.Bodies.rectangle(1700, 600, 50, 50, {
				isStatic: true,
				render: {
					sprite: {
						texture: bookingsURL,
						xOffset: 0,
						yOffset: 0,
					}
				}
			}),
			// this.createPlatform(1800, 580, 800,undefined,undefined,undefined,undefined,true),
			// this.Bodies.rectangle((2500+250/2), 375, 443,425, {
			// 	isStatic: true,
			// 	render: {
			// 		lineWidth:1,
			// 		sprite: {
			// 			texture: GoJiraURL,
			// 			xOffset: 0,
			// 			yOffset: 0,
			// 		}
			// 	}
			// }),
			// [this.createPlatform(1900, 525),
			// this.createPlatform(2000, 450),
			// this.createPlatform(2100, 375),
			// this.createPlatform(2200, 300),
			// this.createPlatform(2300, 225),
			// this.createPlatform(2400, 150),
			// this.createPlatform(2500, 75)]

		])
		this.Composite.add(this.engine.world, [Matter.Bodies.rectangle(600, 175, 733*0.6, 451*0.6, {
			isStatic: true,
			render: {
				sprite: {
					texture: titleURL,
					xOffset: 0,
					yOffset: 0,
					xScale: 0.6,
					yScale: 0.6
				}
			}
			,
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001
			}
		})])
		buildMap.build(this.Composite, this.engine.world)
		// this.loadMap()
		// 7. 执行渲染操作
		this.Render.run(render)
		// 8. 创建运行方法
		var runner = this.Runner.create()
		// 9. 运行渲染器
		this.Runner.run(runner, this.engine)
		this.state.socket.emit("joinRoom", { name: name, uuid: v4() })
	}

	registerMatterEventListener = () => {
		Matter.Events.on(this.engine, 'collisionStart', (event) => {
			this.setState({ onGround: true })
			var pairs = event.pairs;
			pairs.forEach(pair => {
				console.log(pair);
				if (pair.bodyA === this.state.player) {
					if (pair.bodyB.bodyType === "spring") {
						console.log('test')
						this.setState({ willBounce: [true,pair.bodyB.fspring] })
					}
					if (pair.bodyB.bodyType === "checkpoint") {
						this.setState({ spawnPoint: pair.bodyB.position })
						// alert(pair.bodyB.position)
						if (pair.bodyB.isStart && this.state.startTime === undefined) {
							this.setState({startTime:Date.now()})
						}
						if (pair.bodyB.isFinal && this.state.startTime !== undefined) {
							this.arrive()
						}
					}
					if (pair.bodyB.bodyType === "donut") {
						if(this.state.player.powered != true) {
							this.state.player.powered = true
							var countdown = 8
							var timer = setInterval(() => {
								if (countdown == 0) {
									clearInterval(timer)
									this.state.player.powered = false
								}
								countdown --
							}, 1000)
						}
					}
					if (pair.bodyB.bodyType === "question") {
						const q = pair.bodyB.question
						const a = pair.bodyB.answer
						var answer = prompt(q)

						var event = new KeyboardEvent("keyup",{keyCode:37})
						window.dispatchEvent(event)
						event = new KeyboardEvent("keyup",{keyCode:38})
						window.dispatchEvent(event)
						event = new KeyboardEvent("keyup",{keyCode:39})
						window.dispatchEvent(event)
						
						Matter.Body.setVelocity(this.state.player, {x:0,y:0})
						console.log(this.state.player.velocity);
					}
				} else if (pair.bodyB === this.state.player) {
					if (pair.bodyA.bodyType === "spring") {
						this.setState({ willBounce: [true,pair.bodyA.fspring] })
					}
					if (pair.bodyA.bodyType === "checkpoint") {
						this.setState({ spawnPoint: pair.bodyA.position })
						// alert(pair.bodyB.position.x+","+pair.bodyB.position.y)
						if (pair.bodyA.isStart && this.state.startTime === undefined) {
							this.setState({startTime:Date.now()})
						}
						if (pair.bodyA.isFinal && this.state.startTime !== undefined) {
							this.arrive()
						}
					}
					if (pair.bodyA.bodyType === "donut") {
						if(this.state.player.powered != true) {
							this.state.player.powered = true
							var countdown = 8
							var timer = setInterval(() => {
								if (countdown == 0) {
									clearInterval(timer)
									this.state.player.powered = false
								}
								countdown --
							}, 1000)
						}
					}
					if (pair.bodyA.bodyType === "question") {
						const q = pair.bodyA.question
						const a = pair.bodyA.answer
						var answer = prompt(q)

						var event = new KeyboardEvent("keyup",{keyCode:37})
						window.dispatchEvent(event)
						event = new KeyboardEvent("keyup",{keyCode:38})
						window.dispatchEvent(event)
						event = new KeyboardEvent("keyup",{keyCode:39})
						window.dispatchEvent(event)

						Matter.Body.setVelocity(this.state.player, {x:0,y:0})
						console.log(this.state.player.velocity);

					}
				}
			})
		})

		Matter.Events.on(this.engine, 'collisionEnd', (event) => {
			var pairs = event.pairs;
			pairs.forEach(pair => {
				if (pair.bodyA === this.state.player) {
					if (pair.bodyB.bodyType === "spring") {
						console.log('test3')
						this.setState({ willBounce: [false,pair.bodyB.fspring] })
					}
				} else if (pair.bodyB === this.state.player) {
					if (pair.bodyA.bodyType === "spring") {
						console.log('test4')
						this.setState({ willBounce: [false,pair.bodyA.fspring] })
					}
				}
			})
		})

		Matter.Events.on(this.engine, 'beforeUpdate', () => {
			if (this.state.willBounce[0] === true) {
				console.log(this.state.player.velocity.y);
				Matter.Body.applyForce(this.state.player, { x: this.state.player.position.x, y: this.state.player.position.y }, { x: 0, y: this.state.willBounce[1] });
			}
			// if(this.engine != undefined) {
			//   var gravity = this.engine.world.gravity;
			//   // alert(gravity)
			//   if (debugBlock.bodyType == "test") {
			//       Matter.Body.applyForce(debugBlock, debugBlock.position, {
			//           x: -gravity.x * gravity.scale * debugBlock.mass,
			//           y: -gravity.y * gravity.scale * debugBlock.mass
			//       });
			//   }
			// }
		});

		Matter.Events.on(this.myRender, 'afterRender', (event) => {
			// if (this.state.player != undefined && (Math.abs(this.state.player.velocity.x) > 1.137 || Math.abs(this.state.player.velocity.y) > 1.137)) {
			if (this.state.player != undefined) {
				// console.log(this.state.player);
				console.log();
				if (true) {
					// console.log(this.state.player.velocity);
					this.state.socket.emit("moving", { uuid: this.state.player.uuid, position: this.state.player.position, velocity: this.state.player.velocity, name: this.state.player.name, powered: this.state.player.powered })
				}
			}
			this.Render.lookAt(this.myRender, this.state.player, {
				x: 400,
				y: 400,
			}, true)
		})

	}

	createPlatform = (x, y, width = 80, height = 10, restitution = 0, bodyType = "", name = undefined, alignHead = false) => {
		if(alignHead) {
			x += width/2
		}
		return this.Bodies.rectangle(x, y, width, height, { isStatic: true, "restitution": restitution, "bodyType": bodyType, "name": name, fspring:bodyType==="spring" ? -0.08:0 })
	}

	createRotatedPlat = (x, y, width = 100, height = 10) => {
		var body = Matter.Bodies.rectangle(x, y, width, height);
		var constraint = Matter.Constraint.create({
			pointA: { x: x, y: y },
			bodyB: body,
			length: 0
		});

		this.Composite.add(this.engine.world, [body, constraint])
		// return [body,constraint]
	}

	createCheckPoint = (x, y, isStart) => {
		var checkpoint = this.Bodies.rectangle(x, y, 287*0.5, 184*0.5, {
			isSensor: true,
			isStatic: true,
			'bodyType': "checkpoint",
			"isStart": isStart,
			render: {
				sprite: {
					texture: checkPointURL,
					xOffset: 0,
					yOffset: 0,
					xScale: 0.5,
					yScale: 0.5
				}
			}
		})
		console.log(checkpoint)
		return checkpoint
	}

	arrive = () => {
		var result = Date.now() - this.state.startTime
		clearInterval(this.timerInterval)
		if(this.state.player.finished !== true){
			this.state.socket.emit("arrive", { 
				name: this.state.player.name, 
				uuid: this.state.player.uuid,
				result: result
			})
		}
		this.state.player.finished  = true
	}

	joinGame = () => {
		var name = this.nameInput.current.value.trim();
		if (!name == "") {
			this.setState({ joined: true }, () => {
				this.renderCanvas(name)
				this.registerSocketListener()
			})
		} else {
			alert("Please enter your name before join the game!")
		}
	}

	resetPos = () => {
		Matter.Body.setPosition(this.state.player, this.state.spawnPoint)
		Matter.Body.setVelocity(this.state.player, Matter.Vector.create(this.state.player.velocity.x, 0))
		Matter.Render.lookAt(this.myRender, this.state.player, {
			x: 400,
			y: 400,
		}, true)
	}

	pushMessage = (name, join = true) => {
		var li = document.createElement("div");
		var nameSpan = document.createElement("span")
		nameSpan.appendChild(document.createTextNode(name))
		nameSpan.style.color = "blue"
		li.appendChild(nameSpan)
		li.appendChild(document.createTextNode(` ${join ? "joined" : "left"} the game`));
		li.style.textAlign = "left"
		this.messageList.current.appendChild(li)
	}

	componentDidMount = () => {
		// this.renderCanvas()
		this.bindKeys()
		// this.nameInput.current.value = "test"
		// if(this.state.player != undefined) {
		// 	window.location.reload();
		// }
		// this.joinGame()
		this.timerInterval = setInterval(()=>{
			if(this.state.startTime != undefined) {
				const d = new Date(Date.UTC(0,0,0,0,0,0,Date.now() - this.state.startTime))
				// Pull out parts of interest
				var parts = [
					d.getUTCMinutes(),
					d.getUTCSeconds(),
					d.getMilliseconds(),
				]
				// Zero-pad
				// formatted = parts.map(s => String(s).padStart(2,'0')).join(':');
				this.timer.current.innerHTML = parts[0]+"m "+String(parts[1]).padStart(2,'0')+"s "+String(parts[2]).padStart(3,'0')+"ms"
			}
		})
	}

	render() {
		return (
			<div className=''>
				<Row className='justify-content-center' style={{ paddingTop: "20px", paddingBottom: "20px", display: this.state.joined ? 'none' : '' }}>
					<Col>
						<Row className='justify-content-end'>
							<input ref={this.nameInput} style={{ width: "250px" }} className="form-control" type="text" placeholder="Your Name" />
						</Row>
					</Col>

					<Col>
						<Row className='justify-content-start'>
							<button onClick={this.joinGame} style={{ width: '100px' }} type="button" className="btn btn-primary">Join Game</button>
						</Row>
					</Col>
				</Row>
				<Row className=''>
					<div style={{ marginTop: "20px", marginBottom: "20px" }}>Welcome to UTS Interactive Game <span style={{ fontWeight: "bold", color: 'Blue' }}>{this.state.player.name}</span>!<span> Your time: <span ref={this.timer}>00m 00s 000ms</span></span></div>
				</Row>
				<div style={{ position: 'relative', display: this.state.joined ? '' : 'none' }}>
					<button onClick={this.resetPos} className="btn btn-success shadow-none" style={{ fontSize: '35px', lineHeight: '0.8', paddingBottom: "15px", position: 'absolute', top: "10px", left: `calc(50% - 390px)`, borderl: 'none' }}>⟳</button>
				</div>
				<Row style={{ display: this.state.joined ? '' : 'none' }}>
					<Col style={{ border: "1px ridge black" }}>
						Current Player: {this.state.players}
						<div ref={this.messageList}>
						</div>
					</Col>
					<Col style={{ border: "1px ridge black" }}>
						<div id="game-canvas" style={{ height: "600px", width: "900px" }} ref={this.gameCanvas}></div>
					</Col>
					<Col style={{ border: "1px ridge black" }}>
						Ranking:
						<div ref={this.rankingList}>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}
