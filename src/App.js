//import { render } from '@testing-library/react';
import React from 'react';
import './App.css';

class RemoteControl extends React.Component {
  render() {
    let streems = '';

    if (this.props.streams.length) {
      streems = this.props.streams.map(st => <option value={st.url} key={st.url} >{st.station} {st.location} {st.airdate}</option>);
    }

    return (
      <div>
        <select id="streamDropdown">
            {streems}                
        </select>
        <button onClick={() => this.props.play()} > Play </button>
      </div>
    )
  }
}


class Radio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      streams: [],
      currentStream: null
    }
    this.playStream = this.playStream.bind(this);
  } 
  
  componentDidMount() {
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
  
  getStreamByUrl(url) {
    const streams = this.state.streams;
    for (let i = 0; i < streams.length; i++) {
      if (streams[i].url === url) {
        return streams[i];
      }
    }
  }

  playStream() {
    const selectedUrl = document.querySelector('#streamDropdown').value;
    const currentStream = this.getStreamByUrl(selectedUrl);
    this.setState({
      currentStream: currentStream
    })
    console.log('play called', selectedUrl,  currentStream, new Date());
  }

  render() {
    return(
      <div className="radio">
        radio radio
        <RemoteControl streams={this.state.streams} play={this.playStream}/>
        <Player stream={this.state.currentStream} />
      </div>
    )
  }
}

class Player extends React.Component {
  render() {
    const currentStream = this.props.stream || {};
    let archiveSrc = '';

    if (currentStream.url) {
      const urlFormatted = currentStream.url + '&autoplay=1';
      archiveSrc = (<iframe src={urlFormatted} title="radioPlayer" width="500" height="210" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen></iframe>);
    }

    return(
      <div>
        <div>{archiveSrc}</div>
        <a href={currentStream.url}>view on archive.org</a>
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
