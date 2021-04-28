//import { render } from '@testing-library/react';
import React from 'react';
import './App.css';


function Filter(props) {  
  let options = Object.keys(props.values).map((v) => {
    console.log('v', v, props.values[v]);
    return(<option key={v}>{v} ({props.values[v]} streams)</option>);
  });

  return (
    <div>
      <label htmlFor={props.id}>
        {props.label}
      </label>
      <select id={props.id}>
        <option value="">Choose one</option>
        {options}

      </select>
    </div>
  );
}

class RemoteControl extends React.Component {
  render() {
    let streems = '',
        stations = {};

    if (this.props.streams.length) {
      for (let i=0; i < this.props.streams.length; i++) {
        const st = this.props.streams[i];
        if (stations[st.station]) {
          stations[st.station]++;
        } else {
          stations[st.station] = 1
        }
      }

      streems = this.props.streams.map((st) => {
        if (st.url) {
          const title = st.title ? st.title : st.station + ' ' + st.location + ' ' + st.airdate;
          return (<option value={st.url} key={st.url} >{title}</option>);
        }
      });
    }

    return (
      <div>
        <Filter id="station" label="Station" values={stations} />
        <label htmlFor="streamDropdown">Streams</label>
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
