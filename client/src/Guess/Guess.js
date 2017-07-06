import React, { Component } from 'react';
import './Guess.css';

import io from 'socket.io-client';

class Guess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ctx : null,
            mousePressed : false,
            thickness : 4,
            color : 'red',
            startX : 0,
            startY : 0,
            endX : 0,
            endY : 0
        }
    }

    componentDidMount(){
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
        let ready = this.hasProps('ready')
        let myCanvas = this.refs.myCanvas
        const socket = io('http://localhost:3000');

        this.setState({
            ctx : myCanvas.getContext("2d")
        });

        if(ready){
            socket.send('getKeyWord');
            
            socket.on('showPath', (path)=>{
                this.drawing(
                    path.endX,
                    path.endY,
                    path.startX,
                    path.startY,
                    path.color,
                    path.thickness
                );
            });

            socket.on('answer', (data)=>{
                switch(data.correct) {
                    case 1:
                        alert('You are right')
                        break;
                    
                    default:
                        alert('Guessing more')
                        break;
                }
            });

            socket.on('resetBoard', ()=>{
                this.resetBoard();
            });
        }
        
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
        const socket = io('http://localhost:3000');

        return (
            <div className='container row'>
                <h1>Guessing</h1>
                
                <div className='keyWord col s12'><h4>What TA Drawing?</h4></div>
                
                <canvas className='card-panel white col s12' ref='myCanvas'
                        width='800'
                        height='600'
                        style={{border: '1px solid #ccc'}}>
                </canvas>

                <div className='col s12'>
                    <input placeholder="Answer" value={this.state.keyword} type="text" className="validate" 
                    onChange={(e)=>{this.setState({keyword : e.target.value})}} />
                </div>

                <div className='col s12'>
                    <a className="waves-effect waves-light btn" onClick={socket.emit('submit', this.state.keyword)}>Submit</a>
                </div>
            </div>
        );
    }
}

export default Guess;