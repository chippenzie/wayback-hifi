//import { render } from '@testing-library/react';
import React from 'react';
import axios from 'axios';
import './App.css';

class RemoteControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      streams: []
    }
  }

  componentDidMount() {
    console.log('cdm')
    fetch('/data/streams.json').then(response => {
      if (response.ok) {
        return response.json(); 
      }
      throw response;
    }).then(data => {
      this.setState({
        streams: data.streams.sort((a,b) => {
          return (a.airdate > b.airdate) ? 1 : -1
        })
      });
    })
  }

  render() {
    let streems = '';

    if (this.state.streams.length) {
      console.log(this.state.streams);
      streems = this.state.streams.map(st => <option val={st.url} key={st.url} >{st.station} {st.location} {st.airdate}</option>);
    }

    return (
      <div>
        <select id="streamDropdown">
            {streems}                
        </select>
        <button /* onClick={() => Radio.playStream()} */ > Play </button>
      </div>
    )
  }
}


class Radio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStream: null
    }
  } 
  
  playStream() {
    console.log('play stream');
  }

  render() {
    return(
      <div className="radio">
        radio radio
        <RemoteControl />
        <div>player</div>
      </div>
    )
  }
}



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Radio />
      </header>
    </div>
  );
}


export default App;
