import '../../node_modules/materialize-css/dist/css/materialize.min.css';
import '../../node_modules/materialize-css/dist/js/materialize.min.js';

import io from 'socket.io-client';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './App.css';

import Draw from '../Draw/Draw';
import Guess from '../Guess/Guess';
import Chat from '../Chat/Chat';



class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            player: 0,
            nickname: ''
        }

        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        let socket = io('http://localhost:3000');

        this.setState({
            socket: socket
        });

        
        socket.on('nickExisted', function () {
            alert('Nickname is already exist');
        });

        socket.on('loginSuccess', function(){
            console.log('跳转到主界面');
        });
    }

    submit() {
        let nickName = this.state.nickname;
        ReactDOM.findDOMNode(this.refs.loginWrapper).style.border = '5px solid red';
        ReactDOM.findDOMNode(this.refs.loginWrapper).style.display = 'none';
        if (nickName != '') {
            this.state.socket.emit('login', nickName);
            console.log("发送nickName: " + nickName);
        } else {
            console.log('username is empty');
        }

    }

    render() {
        let playMod;
        switch (this.state.player) {
            case 1:
                playMod = (<div className='row'>
                    <div className='leftPanel col s12'>
                        <Draw nickName={this.state.nickname}/>
                    </div>
                </div>)
                break;
            case 2:
                playMod = (<div className='row'>
                    <div className='leftPanel col s10'>
                        <Guess nickName={this.state.nickname}/>
                    </div>
                    <div className='rightPanel col s2'>
                        <Chat nickName={this.state.nickname}/>
                    </div>
                </div>)
                break;
            default:
                playMod = (<div className="flex-box">
                    <div>
                        <h1 className='myTitle'>Drawing and Guessing</h1>
                        <h4 className='myTitle'>Welcome, {this.state.nickname}</h4>
                        <div className='Draw'><a className='waves-effect waves-light btn'
                            onClick={() => this.setState({ player: 1 })} title="Want to Draw">Want to Draw</a></div>
                        <div className='Guess'><a className='waves-effect waves-light btn'
                            onClick={() => this.setState({ player: 2 })} title="Want to Guess">Want to Guess</a></div>
                    </div>

                    <div className='loginWrapper' ref='loginWrapper'>
                        <h1 className='info' ref='titleInfo'>Please Input Your Name: </h1>
                        <div className='nickInfo row'>
                            <input className='nicknameInput'
                                value={this.state.nickname}
                                onChange={(e) => { this.setState({ nickname: e.target.value }) }}
                                placeholder='nickname' />

                            <a className="waves-effect waves-light btn"
                                onClick={() => this.submit()}
                            >OK</a>
                        </div>
                    </div>

                </div>)
        }

        return (
            <div className='App card-panel blue lighten-2 row'>
                {playMod}
            </div>

        );
    }
}

export default App;
