import React, { Component } from 'react';
import './Guess.css';

import io from 'socket.io-client';

class Guess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ctx: null,
            mousePressed: false,
            thickness: 4,
            color: 'red',
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0
        }

        this.drawing = this.drawing.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    drawing(x, y, startX, startY, color, thickness) {
        var ctx = this.state.ctx;
        ctx = this.state.ctx;
        ctx.beginPath();
        ctx.strokeStyle = this.state.color;
        ctx.lineWidth = this.state.thickness;
        ctx.lineJoin = "round";
        ctx.moveTo(this.state.startX, this.state.startY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }

    init() {
        let myCanvas = this.refs.myCanvas
        var socket;

        this.setState({
            ctx: myCanvas.getContext("2d")
        });

        socket = io('http://localhost:3000');
        this.setState({
            socket: socket
        });
        socket.send('getKeyWord');

        socket.on('showPath', (path) => {
            this.drawing(
                path.endX,
                path.endY,
                path.startX,
                path.startY,
                path.color,
                path.thickness
            );

            console.log('正在移动鼠标： ' + path);

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

    render() {
        return (
            <div className='container row'>
                <h1>Guessing</h1>

                <div className='keyWord col s12'><h4>What TA Drawing?</h4></div>

                <canvas className='card-panel white col s12' ref='myCanvas'
                    width='800'
                    height='600'
                    style={{ border: '1px solid #ccc' }}>
                </canvas>

                <div className='col s12'>
                    <input placeholder="Answer" value={this.state.keyword} type="text" className="validate"
                        onChange={(e) => { this.setState({ keyword: e.target.value }) }} />
                </div>

                <div className='col s12'>
                    <a className="waves-effect waves-light btn" onClick={() => this.state.socket.emit('submit', this.state.keyword)}>Submit</a>
                </div>
            </div>
        );
    }
}

export default Guess;