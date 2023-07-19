import { BlurFilter } from 'pixi.js';
import { Stage, Container, Sprite, Text, PixiComponent, useTick, Graphics, AppContext } from '@pixi/react';
import { useMemo } from 'react';
import logo from './logo.svg';
import { Component,createRef } from 'react';

export class MyComponenta extends Component{
  constructor() {
    super();
    this.ref1 = createRef();
    this.ref2 = createRef();
  }

  state = {
    x:0,
    y:0,
    vx:0,
    vy:0.5,
    speed:1,
    gravityInterval:undefined
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
      if (event.keyCode === 38) {
        if (key.isUp && key.press) {
          key.press();
          // this.setState({x:this.state.x + this.state.vx, y:this.state.y + this.state.vy})
        }
        key.isDown = true;
        key.isUp = false;
      }else if (event.keyCode === key.code) {
        if (key.isUp && key.press) {
          key.press();
          key.interval = setInterval(() => {
            this.setState({x:this.state.x + this.state.vx, y:this.state.y + this.state.vy})
          });
        }
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
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
      event.preventDefault();
    };
  
    //Attach event listeners
    document.addEventListener(
      "keydown", key.downHandler.bind(key), false
    );
    document.addEventListener(
      "keyup", key.upHandler.bind(key), false
    );
    return key;
  }

  componentDidMount = () => {
      //重力和碰撞检测
      setInterval(()=>{
        if(this.hitTestRectangle(this.ref1.current, this.ref2.current)) { //没碰撞
          this.setState({y:this.state.y + this.state.vy})
        }else {
          // this.setState({vy:0})
        }
      })
      
      console.log(this.state.x,this.state.y);
      //Capture the keyboard arrow keys
      let 
      left = this.keyboard(37),
      up = this.keyboard(38),
      right = this.keyboard(39);
      // down = this.keyboard(40);

      //Left arrow key `press` method
      left.press = () => {
        //Change the cat's velocity when the key is pressed
        console.log("Key pressed");
        let x = this.state.x
        this.setState({vx:-this.state.speed});
      };

      //Left arrow key `release` method
      left.release = () => {
        //If the left arrow has been released, and the right arrow isn't down,
        //and the cat isn't moving vertically:
        //Stop the cat
        if (!right.isDown && this.state.vy === 0) {
          this.setState({vx:0});
        }
      };

      //Up
      up.press = () => {
        this.setState({y:this.state.y - 50})

      };
      // up.release = () => {
      //   if (this.state.vy === 0) {
      //     this.setState({vy:0});
      //   }
      // };

      //Right
      right.press = () => {
        let x = this.state.x
        this.setState({vx:this.state.speed});
      };
      right.release = () => {
        if (!left.isDown && this.state.vy === 0) {
          this.setState({vx:0});
        }
      };

      // //Down
      // down.press = () => {
      //   let y = this.state.y
      //   this.setState({vx:0,vy:this.state.speed});
      // };
      // down.release = () => {
      //   if (!up.isDown && this.state.vy === 0) {
      //     this.setState({vy:0});
      //   }
      // };

  }

  draw = (g) => {
    g.lineStyle(2, 0xff00ff, 1);
    g.beginFill(0xff00bb, 0.25);
    g.drawRect(-10, 200, 1000, 200); //x,y,width,height
    g.endFill();
  }

  hitTestRectangle(r1, r2) {
    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  
    //hit will determine whether there's a collision
    hit = false;
  
    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;
  
    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;
  
    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
  
    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  
    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
  
      //A collision might be occuring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
  
        //There's definitely a collision happening
        hit = true;
      } else {
  
        //There's no collision on the y axis
        hit = false;
      }
    } else {
  
      //There's no collision on the x axis
      hit = false;
    }
  
    //`hit` will be either `true` or `false`
    return hit;
  }

  render() {
    return (
      <Stage width={1000} height={500} options={{ backgroundColor: 0xeeeeee}}>
          <Container position={[0, 250]}>
            <Sprite anchor={0.5} x={this.state.x} y={this.state.y} image={logo} ref={this.ref1} />
            <Graphics x={0} y={0} draw={this.draw} ref={this.ref2}/>
          </Container>
        {/* <Container x={400} y={330}>
          <Text text="Hello World" anchor={{ x: 0.5, y: 0.5 }}/>
        </Container> */}
      </Stage>
    );
  }
}
