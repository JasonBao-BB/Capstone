import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './Chat.css';

import RoomStatus from '../RoomStatus/RoomStatus';
import Messages from '../Messages/Messages';
import ChatInput from '../ChatInput/ChatInput';

import io from 'socket.io-client';

export default class ChatRoom extends Component {
    constructor(props) {
        super(props);
        const socket = this.props.socket;
        this.state = {
            myId: this.props.uniqueID,
            myName: this.props.username,
            uniqueID: this.props.uniqueID,
            username: this.props.username,
            socket: io('http://localhost:3000'),
            messages: [],
            onlineUsers: {},
            onlineCount: 0,
            userhtml: '',
        }
        
    }

    componentDidMount() {
        this.ready();
        console.log(this.state.myName);
        
    }

    // 处理在线人数及用户名
    handleUsers() {
        const users = this.state.onlineUsers;
        let userhtml = '';
        let separator = '';
        for (let key in users) {
            if (users.hasOwnProperty(key)) {
                userhtml += separator + users[key];
                separator = '、';
            }
        }
        this.setState({ userhtml: userhtml })
    }

    // 生成消息id
    generateMsgId() {
        return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
    }

    // 更新系统消息
    updateSysMsg(o, action) {
        let messages = this.state.messages;
        const newMsg = {
            type: 'system',
            username: o.user.username,
            uniqueID: o.user.uniqueID,
            action: action,
            msgId: this.generateMsgId(),
            time: this.generateTime()
        }
        messages = messages.concat(newMsg)

        this.setState({
            onlineCount: o.onlineCount,
            onlineUsers: o.onlineUsers,
            messages: messages
        });
        this.handleUsers();
    }

    // 发送新消息
    updateMsg(obj) {
        let messages = this.state.messages;
        const newMsg = {
            type: 'chat',
            username: obj.username,
            uniqueID: obj.uniqueID,
            action: obj.message,
            msgId: this.generateMsgId(),
            time: this.generateTime()
        };
        messages = messages.concat(newMsg);
        this.setState({ messages: messages })
    }

    // 生成时间
    generateTime() {
        let hour = new Date().getHours(),
            minute = new Date().getMinutes();
        hour = (hour == 0) ? '00' : hour;
        minute = (minute < 10) ? '0' + minute : minute;
        return hour + ':' + minute;
    }

    handleLogout() {
        window.location.reload();
    }
    // 开始监控socket
    ready() {
        const socket = this.state.socket;
        socket.on('login', (obj) => {
            this.updateSysMsg(obj, 'login');
        })
        socket.on('logout', (obj) => {
            this.updateSysMsg(obj, 'logout');
        })
        socket.on('chatmessage', (obj) => {
            this.updateMsg(obj)
        })
    }

    render() {
        return (
            <div className="card-panel blue lighten-4 chat-room">
                <div className="welcome">
                    <div className="room-name">Welcome, {this.state.myName}</div>
                    <a className="waves-effect waves-light btn" onClick={this.handleLogout.bind(this)}>Lougout</a>
                </div>
                <div>
                    <RoomStatus onlineCount={this.state.onlineCount} userhtml={this.state.userhtml}/>
                </div>
                <div className='chatArea' ref="chatArea">

                    <div className='chatHistory card-panel white'>
                        <Messages messages={this.state.messages} myId={this.state.myId} />
                    </div>

                    <div className='userInput'>
                        <ChatInput myId={this.state.myId} myName={this.state.myName} socket={this.state.socket} />
                    </div>
                    
                </div>
            </div>)
    }
}