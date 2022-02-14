import React, { Component } from 'react'

import AFRAME from 'aframe'
// import 'aframe-react'
import 'aframe-htmlembed-component'
import 'aframe-mapbox-component';

import { io } from 'socket.io-client'

const socket = io('http://localhost:4000/');
const accessToken = 'pk.eyJ1IjoibWF0dHJlIiwiYSI6IjRpa3ItcWcifQ.s0AGgKi0ai23K5OJvkEFnA'
const mapStyle = 'mapbox://styles/mapbox/light-v10'

class Aframe extends Component {
  constructor(props) {
    super(props)
    window.App = this
    this.state = { tokens: [], keywords: [], map: null, weather: null, current: null }
  }

  componentDidMount() {
    this.setState({ test: '123' })

    let defaultTranscript = "Hey! It’s been so long. I heard you were backpacking in Alps ! How was it? It was a wonderful trip! I had a great time! What about you? I went to Mexico with my family. Saw one of the seven wonders of the world. Chichen Itza .  Wow It’s on my bucket list!   If you ever go there, do visit the Warrior’s Temple.  I see! it’s pretty close to Chichen Itza.  great! I’m not used to the Calgary cold. Mexico City was much warmer! haha, I think it will take more than just 2-3 days. Ok, I’ll catch up with you next Monday at the management meeting. See ya!"
    socket.emit('message', defaultTranscript)

    socket.on('message', (message) => {
      let json = JSON.parse(message)
      let res = JSON.stringify(json, null, 2)

      console.log(json)

      let keywords = []
      for (let token of json.tokens) {
        if (token.keyword_rank > 0) {
          keywords.push(token)
        }
      }
      this.setState({ tokens: json.tokens, keywords: keywords }, this.updateHtml )
    })

    // AFRAME.registerComponent('gaze-event', {
    //   init: () => {
    //     console.log('hoge')
    //   }
    // })

  }

  onMouseEnterHandler(keyword) {
    let text = keyword.text
    console.log(keyword)

    let map = this.state.map
    let weather = this.state.weather
    let info = { text: text, description: text, images: ['https://semantic-ui.com/images/avatar2/large/kristy.png'] }

    if (text === 'Alps') {
      map = '8.4276074, 45.8883756'
    }
    if (text === 'Mexico City') {
      map = '-99.1332, 19.4326'
    }

    if (text === 'the Calgary cold') {
      weather = [
        { date: 'Mon', temperature: '-2', type: 'sunny' },
        { date: 'Tue', temperature: '2', type: 'cloudy' },
        { date: 'Wed', temperature: '4', type: 'partly_cloudy' },
        { date: 'Thu', temperature: '3', type: 'rain' },
        { date: 'Fri', temperature: '10', type: 'cloudy' },
        { date: 'Sat', temperature: '8', type: 'sunny' },
        { date: 'Sun', temperature: '5', type: 'snow_s_rain' },
      ]
    }
    this.setState({ current: info, map: map, weather: weather }, this.updateHtml )

  }

  updateHtml() {
    let els = document.querySelectorAll('a-entity')
    for (let el of els) {
      if (el.components.htmlembed) {
        try {
          el.components.htmlembed.forceRender()
        } catch (err) {
          console.log(err)
        }
      }
    }
  }

  getClassName(token) {
    let className = `tag-${token.tag.toLowerCase()}`
    if (token.ent_type) {
      className += ` entity-${token.ent_type.toLowerCase()}`
    }
    if (token.keyword_rank > 0) {
      className += ` keyword`
    }
    return className
  }

  render() {
    return (
      <a-scene>
        <a-camera position="0 0 0" rotation="-45 0 0">
          <a-cursor
            id="a-cursor"
            color="black"
            geometry="primitive: ring; radiusInner: 0.002; radiusOuter: 0.004"
          ></a-cursor>
        </a-camera>

        { this.state.map &&
          <a-entity
            id="map"
            geometry="primitive: plane; width: 3; height: 2;"
            material="color: #ffffff; shader: flat; side: both; transparent: true;"
            mapbox={ `center: ${this.state.map}; zoom: 4; accessToken: ${accessToken}; style: ${mapStyle}` }
            position="-3 2 -6"
          ></a-entity>
        }

        { this.state.weather &&
          <a-entity className="htmlembed" htmlembed="ppu:225" position="3 2 -5">
            <div className="ui raised segment">
              <div className="ui statistics">
                <div className="statistic">
                  <div className="value">
                    <img className="ui circular small inline image" src={`/images/${this.state.weather[0].type}.png`} />
                    { this.state.weather[0].temperature } °C
                  </div>
                  <div className="label">
                    Calgary
                  </div>
                </div>
              </div>
              <table className="ui table">
                <thead>
                  { this.state.weather.map((item, i) => {
                    return (
                      <th key={ i }>{ item.date }</th>
                    )
                  })}
                </thead>
                <tbody>
                  <tr>
                    { this.state.weather.map((item, i) => {
                      return (
                        <td key={ i }>{ item.temperature }</td>
                      )
                    })}
                  </tr>
                  <tr>
                    { this.state.weather.map((item, i) => {
                      return (
                        <td key={ i }><img src={`/images/${item.type}.png`} /></td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </a-entity>
        }

        { this.state.current &&
          <a-entity className="htmlembed" htmlembed="ppu:225" position="0 2 -5">
            <div className="ui card">
              <div className="image">
                <img src={ this.state.current.images[0] } />
              </div>
              <div className="content">
                <a className="header">{ this.state.current.text }</a>
                <p className="description">{ this.state.current.description }</p>
              </div>
              <div className="ui tiny images">
                { this.state.current.images.map((image, i) => {
                  return <img key={ i } src={ image } />
                })}
              </div>
            </div>
          </a-entity>
        }

        <a-entity className="htmlembed" htmlembed="ppu:225" position="0 0 -5">
          <div className="ui cards">
            { this.state.keywords.map((keyword, i) => {
              return (
                <div className="ui card" key={ i } onMouseEnter={this.onMouseEnterHandler.bind(this, keyword)}>
                  <div className="content">
                    <a className="header">{ keyword.text }</a>
                  </div>
                </div>
              )
            })}
          </div>
        </a-entity>

        <a-entity id="transcript" className="htmlembed" htmlembed="ppu:225" position="0 -1.5 -5">
          <div>
            <div className="ui message">
              <div className="header">
              </div>
              <p id="result">{ this.state.tokens.map((token, i) => {
                return (
                  <span key={ i }>
                    <span className={ this.getClassName(token) }>{ token.text }</span><span>  </span>
                  </span>
                )
              }) }</p>
            </div>
           </div>
        </a-entity>
      </a-scene>
    )
  }
}

export default Aframe