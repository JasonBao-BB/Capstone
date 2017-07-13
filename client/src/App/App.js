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
            username: '',
            uniqueID: '',
        }

        //this.submit = this.submit.bind(this);
    }

    componentDidMount(){
        let socket = io('http://localhost:3000');
        this.setState({
            socket : socket
        });
    }


    //随机生成一个uid
    generateUid() {
        return new Date().getTime() + "" + Math.floor(Math.random() * 9 + 1);
    }

    //登陆
    handleLogin() {
        let username = this.state.username;
        let uniqueID = this.generateUid();

        if (!username) {
            username = 'Guest' + uniqueID;
        }

        this.setState({
            uniqueID: uniqueID,
            username: username
        });

        this.state.socket.emit('login', {
            uniqueID : uniqueID,
            username: this.state.username,
            
        });

        console.log('用户：'+this.state.username+this.state.uniqueID+" 进入游戏");
    }
    //处理点击事件
    handleClick(e) {
        e.preventDefault();
        this.handleLogin();
    }

    //处理键盘事件
    handlePress(e) {
        if (e.key == 'Enter') {
            this.handleLogin();
        }
        return false;
    }

    render() {
        let playMod;
        switch (this.state.player) {
            case 1:
                playMod = (<div className='row'>
                    <div className='leftPanel col s12'>
                        <Draw uniqueID={this.state.uniqueID} username={this.state.username} socket={this.state.socket}/>
                    </div>
                </div>)
                break;
            case 2:
                playMod = (<div className='row'>
                    <div className='leftPanel col s10'>
                        <Guess uniqueID={this.state.uniqueID} username={this.state.username} socket={this.state.socket}/>
                    </div>
                </div>)
                break;
            default:
                console.log(this.state.username +' '+this.state.uid);
                if (!this.state.uniqueID) {
                    playMod = (
                        <div className='loginWrapper' ref='loginWrapper'>
                            <h1 className='info' ref='titleInfo'>Please Input Your Name: </h1>
                            <div className='nickInfo row'>
                                <input className='nicknameInput'
                                    onChange={(e) => { this.setState({ username: e.target.value }) }}
                                    onKeyPress={this.handlePress.bind(this)}
                                    placeholder='username' />

                                <a className="waves-effect waves-light btn"
                                    onClick={this.handleClick.bind(this)}
                                >OK</a>
                            </div>
                        </div>
                    )
                } else {
                    playMod = (
                        <div>
                            <h1 className='myTitle'>Drawing and Guessing</h1>
                            <h4 className='myTitle'>Welcome, {this.state.username}</h4>
                            <div className='Draw'><a className='waves-effect waves-light btn'
                                onClick={() => this.setState({ player: 1 })} title="Want to Draw">Want to Draw</a></div>
                            <div className='Guess'><a className='waves-effect waves-light btn'
                                onClick={() => this.setState({ player: 2 })} title="Want to Guess">Want to Guess</a></div>
                        </div>
                    )
                }
        }

        return (
            <div className='App card-panel blue lighten-2 row'>
                {playMod}
            </div>

        );
    }
}

export default App;
