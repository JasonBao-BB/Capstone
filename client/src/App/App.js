import '../../node_modules/materialize-css/dist/css/materialize.min.css';

import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';

import Draw from '../Draw/Draw';
import Guess from '../Guess/Guess';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      playerMod : 0
    }
  }

  render() {
    let playMod;

    switch(this.state.player) {
      case 1:
        playMod = <Draw />;
        break;

      case 2:
        playMod = <Guess />;
        break;
      
      default:
        playMod = (<div>
          <h1>Painting and Guessing</h1>
          <div><a className="Draw waves-effect waves-light btn pulse card-panel red lighten-1" onClick={()=>this.setState({playerMod:1})}>Want to Draw</a></div>
          <div><a className="Guess waves-effect waves-light btn pulse card-panel red lighten-1" onClick={()=>this.setState({playerMod:2})}>Want to Guess</a></div>
        </div>)
    }
    

    return (
      <div className="App row">
        <div className='Paint col s12 card-panel cyan lighten-2'>{playMod}</div>
      </div>
    );
  }
}

export default App;
