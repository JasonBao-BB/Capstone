import React, { Component } from 'react';
import './Draw.css';

import io from 'socket.io-client';

class Draw extends Component {


    constructor(props) {
        super(props);

        this.state = {
            ctx: null,
            drawing: false,
            thickness: 4,
            color: 'black'
        }

        //this.mouseLeave = this.mouseLeave.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mousePressDown = this.mousePressDown.bind(this);
        this.mousePressUp = this.mousePressUp.bind(this);

        this.resetBoard = this.resetBoard.bind(this);
    }

    //更新数据
    componentDidMount() {
        this.init();
    }

    //按下鼠标
    mousePressDown(e) {
        this.setState({
            drawing: true,
        });
        this.state.ctx.x = e.clientX;
        this.state.ctx.y = e.clientY;
    }
    //松开鼠标
    mousePressUp(e) {
        if (!this.state.drawing) {
            return;
        }
        this.state.drawing = false;
        this.drawLine(this.state.ctx.x, this.state.ctx.y, e.clientX, e.clientY, this.state.color,this.state.thickness, true);
    }
    //移动鼠标
    mouseMove(e) {
        if (!this.state.drawing) {
            return;
        }
        this.drawLine(this.state.ctx.x, this.state.ctx.y, e.clientX, e.clientY, this.state.color,this.state.thickness, true);
        this.state.ctx.x = e.clientX;
        this.state.ctx.y = e.clientY;
    }
    //画线
    drawLine(x0, y0, x1, y1, color, thickness, emit) {
        this.state.ctx.beginPath();
        this.state.ctx.moveTo(x0, y0);
        this.state.ctx.lineTo(x1, y1);
        this.state.ctx.strokeStyle = color;
        this.state.ctx.lineWidth = thickness;
        this.state.ctx.stroke();
        this.state.ctx.closePath();

        if (!emit) { return; }

        let myCanvas = this.refs.myCanvas;
        var w = myCanvas.width;
        var h = myCanvas.height;

        //发送新的画画数据
        this.state.socket.emit('drawing', {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color: color,
            thickness : thickness
        });
    }
    //重制画板
    resetBoard() {
        console.log("Reset board");
        var ctx = this.state.ctx;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        this.state.socket.send('clear');
    }
    //初始化
    init() {
        let myCanvas = this.refs.myCanvas
        let socket;

        socket = io('http://localhost:3000');

        this.setState({
            socket: socket
        });

        //发送请求获取关键字
        socket.send('getKeyWord');

        //接收来自服务器的关键字
        socket.on('keyword', (keyword) => {
            this.setState({
                keyword
            });
            console.log('设置的关键字为: ' + keyword);
        });

        this.setState({
            ctx: myCanvas.getContext("2d")
        });
    }

    render() {
        return (
            <div className='row container'>
                <h1>Drawing</h1>
                <div className='keyWord col s12'>
                    Drawing:<span>{this.state.keyword}</span>
                </div>
                <canvas className='card-panel white col s12' ref='myCanvas'
                    onMouseDown={this.mousePressDown}
                    onMouseMove={this.mouseMove}
                    onMouseUp={this.mousePressUp}
                    onMouseLeave={this.mousePressUp}
                    width="800"
                    height="600"
                    style={{ border: '1px solid #ccc' }}>
                </canvas>

                <div className='tool-bar row'>
                    <div className='reset-btn col s12'>
                        <a onClick={this.resetBoard} className="waves-effect waves-light btn">Reset</a>
                    </div>

                    <div className='pencil-thikness col s3'>
                        <div className='chip'>Thickness</div>
                        <select value={this.state.thickness} onChange={(e) => this.setState({ thickness: e.target.value })} className="browser-default">
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
                        <select value={this.state.color} onChange={(e) => this.setState({ color: e.target.value })} className="browser-default">
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
