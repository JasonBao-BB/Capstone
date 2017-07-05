import '../../node_modules/materialize-css/dist/css/materialize.min.css';
import '../../node_modules/materialize-css/dist/js/materialize.min.js';

import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';

import Draw from '../Draw/Draw';
import Guess from '../Guess/Guess';

class App extends Component {

  constructor(props){
        super(props);
        this.state = {
            player : 0
        }
    }

    render(){
        let playMod;
        switch (this.state.player) {
            case 1:
                playMod = <Draw/>
                break;
            case 2:
                playMod = <Guess/>
               break;
            default:
                playMod = (<div className="flex-box">
                              <h1 className='myTitle'>Drawing and Guessing</h1>
                              <div className='Draw'><a className='waves-effect waves-light btn'
                              onClick={()=>this.setState({player:1})} title="Want to Draw">Want to Draw</a></div>
                              <div className='Guess'><a className='waves-effect waves-light btn'
                              onClick={()=>this.setState({player:2})} title="Want to Guess">Want to Guess</a></div>
                            </div>)
        }

        return (
          <div className='App card-panel blue lighten-4 row'>
            {playMod}
          </div>

        );
    }
}

export default App;
