//import { render } from '@testing-library/react';
import React from 'react';
import './App.css';


function Filter(props) {
  let propValues = Object.keys(props.values).sort();
  
  let options = propValues.map((v) => {
   // console.log('v', v, props.values[v]);
    return(<option key={v} value={v}>{v} ({props.values[v]} streams)</option>);
  });

  return (
    <div>
      <label htmlFor={props.id}>
        {props.label}
      </label>
      <select id={props.id} onChange={props.filterFn}>
        <option value="">Choose one</option>
        {options}

      </select>
    </div>
  );
}

class RemoteControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        station: null,
        location: null,
        decade: null,
        genre: null
      }
    }
    this.filterByStation = this.filterByStation.bind(this);
    this.filterByLocation = this.filterByLocation.bind(this);
    this.filterByDecade = this.filterByDecade.bind(this);
    this.filterByGenre = this.filterByGenre.bind(this);
  }

  filterByStation(v) {
    let currentFilters = this.state.filters;
    currentFilters.station = v.target.value;
    this.setState({
      filters: currentFilters
    });
  }
  
  filterByLocation(v) {
    let currentFilters = this.state.filters;
    currentFilters.location = v.target.value;
    this.setState({
      filters: currentFilters
    });
  }

  filterByDecade(v) {
    let currentFilters = this.state.filters;
    currentFilters.decade = v.target.value;
    this.setState({
      filters: currentFilters
    });
  }

  filterByGenre(v) {
    let currentFilters = this.state.filters;
    currentFilters.genre = v.target.value;
    this.setState({
      filters: currentFilters
    });
  }

  render() {
    let stations = {},
        locations = {},
        decades = {},
        genres = {},
        currentFilters = this.state.filters,
        streems = 'ppp',
        streamDisp = '';

    if (this.props.streams.length) {
      for (let i=0; i < this.props.streams.length; i++) {
        const st = this.props.streams[i];
        if (stations[st.station]) {
          stations[st.station]++;
        } else {
          stations[st.station] = 1
        }
        if (locations[st.location]) {
          locations[st.location]++;
        } else {
          locations[st.location] = 1
        }
        if (decades[st.decade]) {
          decades[st.decade]++;
        } else {
          decades[st.decade] = 1
        }
        if (genres[st.genre]) {
          genres[st.genre]++;
        } else {
          genres[st.genre] = 1
        }
      }

      let filters = ['station', 'location', 'decade', 'genre'],
        filterUsed = false;
      streems = this.props.streams;

      for (let i=0; i<filters.length; i++) {
        //console.log('check ', filters[i]);
        if (currentFilters[filters[i]]) {
          filterUsed = true;
          streems = streems.map((st) => {
            if ((st) && (st.url)) {
              if ((st[filters[i]] === currentFilters[filters[i]])) {
                //console.log('ass', st);
                //const title = st.title ? st.title : st.station + ' ' + st.location + ' ' + st.airdate;
                //return (<option value={st.url} key={st.url} >{title}</option>);
                return st
              }        
            }
          });
        }
      }

      if (filterUsed) {
        streems = streems.map((st) => {
          if ((st) && (st.url)) {
            const title = st.title ? st.title : st.station + ' ' + st.location + ' ' + st.airdate;

            return (<option value={st.url} key={st.url} >{title}</option>);                    
          } else {
            return null;
          }
        });     
      } else {
        streems = [];
      }
    }

    if (streems.length > 0) {
      streamDisp = (<div className="streams"><label htmlFor="streamDropdown">Streams</label><select id="streamDropdown">{streems}</select><button onClick={() => this.props.play()} > Play </button></div>);
    }

    return (
      <div>
        <Filter id="station" label="Station" values={stations} filterFn={this.filterByStation} />
        <Filter id="location" label="Locations" values={locations} filterFn={this.filterByLocation} />
        <Filter id="decades" label="Decade" values={decades} filterFn={this.filterByDecade } />
        <Filter id="genres" label="Genre" values={genres} filterFn={this.filterByGenre} />
        {streamDisp}      
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
    fetch('/wayback-hifi/build/data/streams.json').then(response => {
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
    let archiveSrc = '', archiveLink = '';

    if (currentStream.url) {
      const urlFormatted = currentStream.url + '&autoplay=1';
      archiveSrc = (<iframe src={urlFormatted} title="radioPlayer" width="500" height="210" frameBorder="0"></iframe>);
      archiveLink = (<a href={currentStream.url}>view on archive.org</a>);
    }

    return(
      <div>
        <div>{archiveSrc}</div>
        <div>{archiveLink}</div>
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
