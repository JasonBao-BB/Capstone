// RoomStatus聊天室状态
import React, {Component} from 'react';
import io from 'socket.io-client';

class RoomStatus extends Component {
    
    constructor(props){
        super(props);

       console.log("状态栏里人数显示+列表"+ this.props.onlineCount + this.props.userhtml);
    }

    render() {
        return(<div className="room-status">在线人数: {this.props.onlineCount}, 在线列表: {this.props.userhtml}</div>)
    }
}

export default RoomStatus;