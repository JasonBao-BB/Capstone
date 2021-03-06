import React, { Component } from 'react';
import './Guess.css';

import io from 'socket.io-client';

class Guess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ctx: null,
            drawing: false,
            thickness: 4,
            color: 'black'
        }

        this.drawLine = this.drawLine.bind(this);
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
        var socket;

        this.setState({
            ctx: myCanvas.getContext("2d")
        });

        socket = io('http://localhost:3000');
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