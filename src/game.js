import logo from './logo.svg';
import { Component, createFactory, createRef } from 'react';
import Matter from 'matter-js';
import io from 'socket.io-client';
import axios from "axios";
import {url, isSocket} from "./Api.js";
import { v4 } from 'uuid';
import MyRender from './MyRender';
import { Col, Row, Form } from 'react-bootstrap';

export class MyComponent extends Component {
  Engine;
  Render;
  Bodies;
  Composite;
  Runner;
  engine;
  constructor() {
    super();
    this.gameCanvas = createRef();
    this.nameInput = createRef();
  }

  state = {
    onGround:true,
    joined: false,
    socket: io.connect(isSocket? "https://api.paulduan.tk/" : "http://127.0.0.1:8888/", isSocket ? {path :'/uts-interactive/socket.io'} : {}),
    player:Matter.Bodies.rectangle(200, 200, 80, 80, {inertia: Infinity}),
    other_player: {}
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
      console.log(key.code,this.state.onGround);
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) {
          if (key.code === 38) {
            if (this.state.onGround) {
              key.press();
            }
          }else {
            // key.interval = setInterval(() => {
            //   key.press();
            // });
            key.press();
          }
        }
        key.isDown = true;
        key.isUp = false;
      }
      // event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) {
          key.release()
          clearInterval(key.interval)
        };
        key.isDown = false;
        key.isUp = true;
      }
      // event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
      "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
      "keyup", key.upHandler.bind(key), false
    );
    return key;
  }

  registerSocketListener = () => {
    this.state.socket.on("ok", (data) => {
      let boxC = this.Bodies.rectangle(200, 200, 45, 125, {
        inertia: Infinity,
        render: {
          lineWidth: 3
        }
      })
      console.log("北京正常",boxC);
      boxC.bodyType = "player"
      boxC.uuid = data.uuid
      boxC.name = data.name
      boxC.friction = 0
      boxC.frictionAir = 0
      boxC.collisionFilter = {
        category: 0x0002,
        mask: 0x0001
      }
      this.setState({player: boxC}, () => {
        Matter.World.add(this.engine.world, boxC)
      })
      this.state.socket.emit("joined",{name:boxC.name, uuid:boxC.uuid, position: boxC.position, velocity: boxC.velocity})
    })

    this.state.socket.on("update", (data) => {
      
      var bodies = this.Composite.allBodies(this.engine.world)
      var bodiesUUID = []
      bodies.forEach(body => {
        if (body.uuid != undefined) {
          bodiesUUID.push(body.uuid)
        }
      });
      
      console.log("update bodies", data, bodiesUUID);
      var new_other_player = this.state.other_player
      Object.keys(data).forEach((player)=>{
        if(!bodiesUUID.includes(player)) {
          console.log("------",data[player]);
          let boxD = this.Bodies.rectangle(200, 200, 45, 125, {inertia: Infinity})
          boxD.uuid = player
          boxD.bodyType = "player"
          boxD.name = data[player].name
          boxD.collisionFilter = {
            category: 0x0002,
            mask: 0x0001
          }
          Matter.World.add(this.engine.world, boxD)
          new_other_player[boxD.uuid] = boxD
        }
      })
      this.setState({other_player: new_other_player}, () => {
        setInterval(() => {
          if (this.state.player != undefined) {
            // console.log(this.state.player);
            this.state.socket.emit("moving", {uuid: this.state.player.uuid, position: this.state.player.position, velocity: this.state.player.velocity})
          }  
        });
      })
    })
    
    this.state.socket.on("updatePosition", (data) => {
      if(Object.keys(this.state.other_player).length !== 0) {
        // console.log("update position",data);
        Object.keys(data).forEach((player)=>{
          if(player != this.state.player.uuid) {
            var position = data[player].position;
            // console.log(this.state.other_player);
            Matter.Body.setPosition(this.state.other_player[player],position)
            this.state.other_player[player].velocity = data[player].velocity
          }
        })
      }
    })

    this.state.socket.on("playerLeaved", (uuid) => {
      var leaved = this.state.other_player[uuid]
      var new_other_player = this.state.other_player
      delete new_other_player[uuid]
      this.setState({other_player: new_other_player}, () => {
        if(leaved != undefined) {
          Matter.World.remove(this.engine.world,leaved)
        }
      })
    });
  }
  
  bindKeys = () => {
    let left = this.keyboard(37)
    let up = this.keyboard(38)
    let right = this.keyboard(39)
  
    left.press = () => {
      // console.log("test");
      // Matter.Body.setPosition(this.state.player,{x:this.state.player.position.x-1, y:this.state.player.position.y})
      Matter.Body.setVelocity(this.state.player, Matter.Vector.create(-8,this.state.player.velocity.y))
    }
  
    left.release = () => {
      if(!right.isDown) {
        Matter.Body.setVelocity(this.state.player, Matter.Vector.create(0,this.state.player.velocity.y))
      }
    }
  
    right.press = () => {
      // console.log("test");
      // Matter.Body.setPosition(this.state.player,{x:this.state.player.position.x+1, y:this.state.player.position.y})
      Matter.Body.setVelocity(this.state.player, Matter.Vector.create(8,this.state.player.velocity.y))
    }
  
    right.release = () => {
      if(!left.isDown) {
        Matter.Body.setVelocity(this.state.player, Matter.Vector.create(0,this.state.player.velocity.y))
      }
    }
  
    up.press = () => {
      // console.log("test");
      this.setState({onGround: false})
      Matter.Body.applyForce(this.state.player, { x: this.state.player.position.x, y: this.state.player.position.y }, { x: 0, y: -0.2 });
    }
    
    up.release = () => {
  
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
        background:"white"
      }
    })
  
    // 5-1. 创建两个正方形
    let boxA = this.Bodies.rectangle(400, 200, 80, 80, {inertia: Infinity})
    let boxB = this.Bodies.rectangle(450, 50, 80, 80)
  
    boxA.collisionFilter = {
      category: 0x0002,
      mask: 0x0001
    }
    boxA.bodyType = "map"
    boxB.collisionFilter = {
      category: 0x0002,
      mask: 0x0001
    }
    boxB.bodyType = "map"
  
    // 5-2. 创建地面，将isStatic设为true，表示物体静止
    let ground = this.Bodies.rectangle(400, 610, 810, 30, { isStatic: true })
    ground.friction = 0
    let ground2 = this.Bodies.rectangle(1220, 610, 500, 30, { isStatic: true })
    // let ground3 = Bodies.rectangle(400, 6, 400, 30, { isStatic: true })
    // let ground4 = Bodies.rectangle(400, 610, 100, 30, { isStatic: true })
  
    // ground.collisionFilter = {
    //   category: 0x0004,
    //   mask: 0x0002
    // }
  
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      this.setState({onGround: true})
    })
  
    setInterval(() => {
      Matter.Render.lookAt(render, this.state.player,{
        x: 500,
        y: 500
      })
    })
  
    // 6. 将所有物体添加到世界中
    // this.Composite.add(this.engine.world, [boxA, boxB, ground, ground2])
    this.Composite.add(this.engine.world, [ground, ground2])
    // 7. 执行渲染操作
    this.Render.run(render)
    // 8. 创建运行方法
    var runner = this.Runner.create()
    // 9. 运行渲染器
    this.Runner.run(runner, this.engine)
    this.state.socket.emit("joinRoom", {name:name,uuid: v4()})
  }

  joinGame = () => {
    var name = this.nameInput.current.value.trim();
    if (!name == ""){
      this.setState({joined:true}, () => {
        this.renderCanvas(name)
        this.registerSocketListener()
      }) 
    }else{
      alert("Please enter your name before join the game!")
    }
  }

  componentDidMount = () => {
    // this.renderCanvas()
    this.bindKeys()
  }

  render() {
    return (
      <div className=''>
        <Row className='justify-content-center' style={{paddingTop:"20px", paddingBottom:"20px",display: this.state.joined ? 'none': ''}}>
          <Col>
            <Row className='justify-content-end'>
              <input ref = {this.nameInput} style= {{width:"250px"}} className = "form-control" type="text" placeholder="Your Name"/>
            </Row>
          </Col>

          <Col>
            <Row className='justify-content-start'>
              <button onClick = {this.joinGame} style={{width:'100px'}} type="button" className="btn btn-primary">Join Game</button>
            </Row>
          </Col>
        </Row>
        <Row className=''>
          <div style={{marginTop:"20px", marginBottom:"20px"}}>Welcome to UTS Interactive Game <span style={{fontWeight:"bold", color:'Blue'}}>{this.state.player.name}</span>!</div>
        </Row>
        <div id="game-canvas" ref={this.gameCanvas}>
          HAHAH
        </div>
      </div>
    );
  }
}
