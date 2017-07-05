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

    mousePressDown(e){
        this.setState({
            mousePressed : true
        });
    
    }

    mouseMove(){

    }

    mousePressUp() {

    }

    mouseLeave(){

    }

    resetBoard() {

    }

    render() {
        return(
            <div className='container'>
                <div className='keyWord'>
                    Drawing:<span>猪</span>
                </div>
                <canvas ref='myCanvas'
                    onMouseDown={this.mousePressDown}
                    onMouseMove={this.mouseMove}
                    onMouseUp={this.mousePressUp}
                    onMouseLeave={this.mouseLeave}
                    width="500"
                    height="600"
                    style={{border:'1px solid #ccc'}}>

                </canvas>
                <div className='editor'>
                    <div className='resetBtn'>
                        <button onClick={this.resetBoard}>Reset Board</button>
                    </div>

                    <div className='pencil input-field col s5'>
                        Pencil Thickness:
                        <select>
                            <option value="" disabled selected>Choose your pencil</option>
                            <option value="2">#2</option>
                            <option value="4">#4</option>
                            <option value="6">#6</option>
                            <option value="8">#8</option>
                        </select>
                    </div>

                    <div className='pencil-color input-field col s5'>
                        Pencil Color
                        <select>
                            <option value="" disabled selected>Choose your color</option>
                            <option value="black">Black</option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="yellow">Yellow</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}

export default Draw;

