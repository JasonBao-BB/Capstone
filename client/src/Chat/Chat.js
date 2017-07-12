import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Chat.css';

import io from 'socket.io-client';

class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = {
            historyMsg : ReactDOM.findDOMNode(this.refs.historyMsg),
            statue : ReactDOM.findDOMNode(this.refs.statue),
        }

        //this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        let socket = io('http://localhost:3000');
        this.setState({
            socket: socket
        });

        const node1 = ReactDOM.findDOMNode(this.refs.historyMsg);
        const node2 = ReactDOM.findDOMNode(this.refs.statue);

        socket.on('system', function (nickName, userCount, type) {
            

            console.log(node1);
            console.log(node2);
            //判断用户是连接还是离开以显示不同的信息
            let msg = nickName + (type == 'login' ? ' joined' : ' left');
            //创建了一个p元素
            let p = React.createElement('p', null, msg);
            //把p元素append到聊天框内
            ReactDOM.findDOMNode(this.refs.historyMsg).appendChild(p);   
            
        });
    }

    render() {
        return (
            <div className='wrapper card-panel blue lighten-4'>
                <div className='banner'>
                    <span className='statue' ref='statue'>当前在线:10人</span>
                </div>
                <div className='historyMsg' ref='hostoryMsg'></div>
                <div className='controls'>
                    <div className="items">
                        <input className="colorStyle" type="color" placeholder='#000' title="font color" />
                        <input className="emoji" type="button" value="emoji" title="emoji" />
                        <input className="clearBtn" type="button" value="clear" title="clear screen" />
                    </div>

                    <textarea className='messageInput' placeholder='enter to send'></textarea>
                    <input type='button' className='sendBtn' value='SEND' />

                    <div className='emojiWrapper'></div>

                </div>
            </div>
        )
    }
}

export default Chat;