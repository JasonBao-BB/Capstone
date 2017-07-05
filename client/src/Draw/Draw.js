import React, { Component } from 'react';
import './Draw.css';

class Draw extends Component {


    constructor(props) {
        super(props);

        this.state = {
            ctx : null,
            mousePressed : false,
            thickness : 4,
            color : 'black',
            startX : 0,
            startY : 0,
            endX : 0,
            endY : 0
        }

        this.mouseLeave = this.mouseLeave.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mousePressDown = this.mousePressDown.bind(this);
        this.mousePressUp = this.mousePressUp.bind(this);

        this.resetBoard = this.resetBoard.bind(this);
    }

    componentDidMount(){
        this.ready();
    }

    mousePressDown(e){
      this.setState({
          mousePressed : true
      });
      this.drawing(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop, false);
    }

    mouseMove(e){
      if (this.state.mousePressed) {
            this.drawing(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop, true);
      }
    }

    mousePressUp() {
      this.mouseLeave();
      //this.hasProps('drawEnd')();
    }

    mouseLeave(){
      this.setState({
            mousePressed : false
      })
    }

    drawing(x, y, isDown) {
        var ctx,timer;
        if (isDown) {
            ctx = this.state.ctx;
            ctx.beginPath();
            ctx.strokeStyle = this.state.color;
            ctx.lineWidth = this.state.thickness;
            ctx.lineJoin = "round";
            ctx.moveTo(this.state.startX, this.state.startY);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
            //this.drawUpdate({x,y});
        }
        this.setState({
            startX : x,
            startY : y
        })
    }

    drawUpdate(path){
        let change = this.hasProps('change');
        if(change){
            change({
                ...this.state
            });
        }

        this.state.socket.emit('drawPath',{
            startX : this.state.startX,
            startY : this.state.startY,
            endX : path.x,
            endY : path.y,
            thickness : this.state.thickness,
            color : this.state.color
        })
    }

    resetBoard() {
      console.log("Reset board");
      var ctx = this.state.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      //this.state.socket.send('clear');
    }

    ready() {
        // let ready = this.hasProps('ready')
        let myCanvas = this.refs.myCanvas
        //     socket;
        // if(ready){
        //     socket = ready();
        //     this.setState({
        //         socket : socket
        //     });
        //     socket.send('getKeyWord');
        //     socket.on('keyword', (keyword)=>{
        //         this.setState({
        //             keyword
        //         })
        //     })
        // }
        myCanvas = this.refs.myCanvas;
        this.setState({
            ctx : myCanvas.getContext("2d")
        });
    }

    hasProps(prop){
        if(!prop){
            return false
        };

        var propName;
        if( this.props.route && this.props.route[prop] ){
            propName = this.props.route[prop];
        }

        if (this.props[prop]) {
            propName = this.props[prop];
        }

        if(propName){
            return propName;
        }

        return false;
    }

    render() {
        return(
            <div className='row container'>
                <div className='keyWord col s12'>
                    Drawing:<span>{this.state.keyword}</span>
                </div>
                <canvas className='card-panel white col s12' ref='myCanvas'
                    onMouseDown={this.mousePressDown}
                    onMouseMove={this.mouseMove}
                    onMouseUp={this.mousePressUp}
                    onMouseLeave={this.mouseLeave}
                    width="800"
                    height="600"
                    style={{border:'1px solid #ccc'}}>
                </canvas>

                <div className= 'tool-bar row'>
                  <div className='reset-btn col s12'>
                    <a onClick={this.resetBoard} className="waves-effect waves-light btn">Reset</a>
                  </div>

                  <div className='pencil-thikness col s3'>
                    <div className='chip'>Thickness</div>
                    <select value={this.state.thickness} onChange={(e)=>this.setState({thickness : e.target.value})} className="browser-default">
                            <option value="" disabled selected>Thickness</option>
                            <option value="1">#1</option>
                            <option value="3">#3</option>
                            <option value="5">#5</option>
                            <option value="7">#7</option>
                            <option value="9">#9</option>
                            <option value="11">#11</option>
                    </select>
                  </div>

                  <div className='pencil-color col s3'>
                    <div className='chip'>Color</div>
                    <select value={this.state.color} onChange={(e)=>this.setState({color : e.target.value})} className="browser-default">
                            <option value="" disabled selected>Color</option>
                            <option value="black">Black</option>
                            <option value="blue">Blue</option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="yellow">Yellow</option>
                            <option value="gray">Gray</option>
                    </select>
                  </div>
                </div>

            </div>

        );
    }
}

export default Draw;
