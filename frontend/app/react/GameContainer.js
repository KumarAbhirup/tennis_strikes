/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */

/* global sndMusic dispatch Koji */

import React, { Component } from 'react'

const { p5 } = window

class GameContainer extends Component {
  componentDidMount() {
    require('script-loader!app/utils.js')
    require('script-loader!app/main.js')
    require('script-loader!app/menu.js')
    require('script-loader!app/cam.js')
    require('script-loader!app/volume.js')
    require('script-loader!app/info.js')
    require('script-loader!app/game.js')
    require('script-loader!app/player.js')
    require('script-loader!app/ball.js')
    require('script-loader!app/opponent.js')
    require('script-loader!app/pickup.js')
    require('script-loader!app/gameOver.js')
    
    let _playerName = Koji.config.strings.defaultPlayerName
    if (localStorage.getItem('playerName')) {
      _playerName = localStorage.getItem('playerName')
    }

    // // eslint-disable-next-line no-global-assign
    // dispatch = new Dispatch({
    //   projectId: Koji.config.metadata.projectId,
    //   options: {
    //     shardName:
    //       roomName.toLowerCase() || Koji.config.strings.defaultRoomName, // the name of the shard you want to connect to. if this key is not present, the user will automatically be placed onto a shard
    //     maxConnectionsPerShard: parseInt(
    //       Koji.config.strings.maxPlayersPerShard
    //     ), // specify how many users to allow on a shard before it is "full" -- once a shard is full, new users will be added to a new shard unless a different shard is explicity set
    //   },
    // })

    // // eslint-disable-next-line no-global-assign
    // dispatchEvent = DISPATCH_EVENT

    // dispatch.setUserInfo({ playerName: _playerName })

    // eslint-disable-next-line new-cap
    this.p5Game = new p5(null, document.getElementById('game-container'))
  }

  componentWillUnmount() {
    // if (sndMusic && sndMusic.isPlaying()) {
    //   sndMusic.dispose()
    // }

    this.p5Game.remove()
  }

  render() {
    return <div id="game-container" />
  }
}

export default GameContainer
