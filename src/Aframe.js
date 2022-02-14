import React, { Component } from 'react'

// import AFRAME from 'aframe'
// import 'aframe-react'
// require('aframe-htmlembed-component')
import { io } from 'socket.io-client'

const socket = io('http://localhost:4000/');

class Aframe extends Component {
  constructor(props) {
    super(props)
    window.App = this
    this.state = { tokens: [], keywords: {} }
  }

  componentDidMount() {
    this.setState({ hoge: '123' })

    let defaultTranscript = "There's no way it's not better than 2021, right? Right? Hi, what's up? MKBHD here. We made it to 2022, all right? So, there was tech happening still in the past year. In 2021, we had some truly great new computers. We had plenty of interesting and unique smartphones. The mirrorless camera world took a step up. There were good EVs and a bunch of even better EV promises. The PS5 is a whole year old and still impossible to get. But now, it's time to look forward. This is a little tradition I've started, at sort of the beginning of each new year, where I look forward at the next year in tech.";
    socket.emit('message', defaultTranscript)

    socket.on('message', (message) => {
      let json = JSON.parse(message)
      let res = JSON.stringify(json, null, 2)

      this.setState({ tokens: json.tokens, keywords: json.keywords }, () => {
        let els = document.querySelectorAll('.htmlembed')
        for (let el of els) {
          el.components.htmlembed.forceRender()
        }
      })
    })

  }

  getClassName(token) {
    let className = `tag-${token.tag.toLowerCase()}`
    if (token.keyword_rank > 0) {
      className += ` keyword`
    }
    return className
  }

  render() {
    return (
      <a-scene>

        <a-entity className="htmlembed" htmlembed="ppu:225" position="0 2 -5">
          <div className="ui middle aligned very relaxed animated list">
            <div id="keyword-list">
              fjaej oajfoajeof ae
            </div>
          </div>
        </a-entity>


        <a-entity id="transcript" className="htmlembed" htmlembed="ppu:225" position="0 0 -5">
          <div>
            <div className="ui message">
              <div className="header">
              </div>
              <p id="result">{ this.state.tokens.map((token, i) => {
                return (
                  <span key={ i } className={ this.getClassName(token) }>{ token.text }</span>
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