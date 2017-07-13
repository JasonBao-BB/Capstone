import React, { Component } from 'react';
import './Guess.css';

import io from 'socket.io-client';
import Chat from '../Chat/Chat';
import RoomStatus from '../RoomStatus/RoomStatus';

class Guess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ctx: null,
            drawing: false,
            thickness: 4,
            color: 'black',

            uniqueID : this.props.uniqueID,
            username : this.props.username,
        }

        this.drawLine = this.drawLine.bind(this);
        this.init = this.init.bind(this);
    }

    componentDidMount() {
        this.init();
    }

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
    }

    init() {
        let myCanvas = this.refs.myCanvas
        var socket = this.props.socket;

        this.setState({
            ctx: myCanvas.getContext("2d")
        });

        //socket = io('http://localhost:3000');
        this.setState({
            socket: socket
        });
        socket.send('getKeyWord');

        socket.on('drawing', (data) => {
            let myCanvas = this.refs.myCanvas
            var w = myCanvas.width;
            var h = myCanvas.height;

            this.drawLine(
                data.x0 * w,
                data.y0 * h,
                data.x1 * w,
                data.y1 * h,
                data.color,
                data.thickness
            );

            console.log('正在移动鼠标： ' + data);

        });

        socket.on('answer', (data) => {
            switch (data.correct) {
                case 1:
                    alert('You are right')
                    break;

                default:
                    alert('Guessing more')
                    break;
            }
            console.log('大神的答案:' + data);
        });

        socket.on('resetBoard', () => {
            this.resetBoard();
        });


    }

    resetBoard() {
        var ctx = this.state.ctx;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    render() {
        return (
            <div className='container row'>
                <h1 className='col s12'>Guessing</h1>

                <div className='keyWord col s12'>
                    <h4>What TA Drawing?</h4>
                </div>

                <div className='paint-area card-panel blue lighten-4 col s10'>
                    <canvas className='card-panel white col s12' ref='myCanvas'
                        width='800'
                        height='780'
                        style={{ border: '1px solid #ccc' }}>
                    </canvas>
                    <div className='input-area col s12'>
                        <input placeholder="Answer" value={this.state.keyword} type="text" className="validate"
                            onChange={(e) => { this.setState({ keyword: e.target.value }) }} />
                        <a className="waves-effect waves-light btn" onClick={() => this.state.socket.emit('submit', this.state.keyword)}>Submit</a>
                    </div>
                </div>

                <div className='col s2'>
                    <Chat socket={this.state.socket} uniqueID={this.state.uniqueID} username={this.state.username}/>
                </div>

            </div>
        );
    }
}

export default Guess;