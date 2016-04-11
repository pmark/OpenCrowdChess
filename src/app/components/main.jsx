import React from 'react';
import ChessUtil from '../lib/chess-util';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import SwipeableViews from 'react-swipeable-views';

const { Component, PropTypes } = React;
const { dataToJS } = helpers;

import {
    RaisedButton,
    Styles,
    Tabs,
    Tab,
    Paper,
} from 'material-ui';

import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';
import Scoreboard from './scoreboard';
import PlayerTable from './player-table';
import SpectatorTable from './spectator-table';
import Chessboard from './chessboard';
import MoveSuggestions from './move-suggestions';

import GameStore from '../stores/game-store';
import GameActions from '../actions/game-actions';
import TurnHistory from './turn-history';
// import Presence from './presence';

// import UUID from '../sources/uuid-source';
// import Chess from 'chess.js';  // TODO: use npm module

const { getMuiTheme, Colors } = Styles;

const NEXT_GAME_TRANSITION_SEC = 5;
let nextGameCountdownTicker = null;

@firebase(
  props => ([
    `games/${props.gameId}`
  ])
)
@connect(
  (state, props) => ({
    game: dataToJS(state.firebase, `games/${props.gameId}`)
  })
)
export default class Main extends React.Component {
  constructor() {
    super();

    this._handleChangeMovesTabs = this._handleChangeMovesTabs.bind(this);
    this._handleChangeUsersTabs = this._handleChangeUsersTabs.bind(this);

    this.state = {
      // game: GameStore.emptyGame(),
      usersTabIndex: 0,
      movesTabIndex: 0,
      nextGameCountdown: NEXT_GAME_TRANSITION_SEC,
    };
  }

  static propTypes = {
    gameId: PropTypes.string,
    game: PropTypes.object,
  }

  static childContextTypes = {
    game: PropTypes.object,
  }

  getChildContext() {
    return {
      game: this.props.game,
    };
  }

  componentDidMount() {
    GameStore.listen(this._onChange);
    GameActions.fetchCurrentGame();

    window.pieceSelected = GameActions.pieceSelected;
    window.pieceMoved = GameActions.pieceMoved;
    window.resetGame = GameActions.resetGame;
  }

  componentWillUnmount() {
    GameStore.unlisten(this._onChange);
  }

  _onChange(arg) {
    const game = GameStore.getState().game;
    this.setState({
      game: game,
    });

    let fen = null;
    if (game.fenHistory && game.fenHistory.length > 0) {
      fen = game.fenHistory[game.fenHistory.length-1];
      __chess = new Chess(fen);
    }
    else {
      fen = ChessUtils.FEN.startId;
      __chess = new Chess();
    }
    __board.setPosition(fen);

    if (game.checkmate || game.draw) {
      if (!nextGameCountdownTicker) {
        nextGameCountdownTicker = setInterval(this._nextGameCountdownTick, 1000);
      }
    }
  }

  componentWillMount() {
  }

  _handleChangeMovesTabIndex(arg) {
    console.log('_handleChangeMovesTabIndex', arg);
  }

  _handleChangeMovesTabs(arg) {
    this.setState({ movesTabIndex: parseInt(arg, 10) });
    console.log('_handleChangeMovesTabs', arg);
    console.log("this.state.movesTabIndex:", this.state.movesTabIndex);
  }

  _handleChangeUsersTabIndex(arg) {
    console.log('_handleChangeUsersTabIndex', arg);
  }

  _handleChangeUsersTabs(arg) {
    this.setState({ usersTabIndex: parseInt(arg, 10) });
    console.log('_handleChangeUsersTabs', arg, "this.state.usersTabIndex:", this.state.usersTabIndex);
  }

  _nextGameCountdownTick() {
    let value = this.state.nextGameCountdown;

    if (parseInt(value) === 0) {
      value = NEXT_GAME_TRANSITION_SEC + 1;
    }

    value = value - 1;

    this.setState({ 
      nextGameCountdown: value,
    });

    if (value <= 0) {
      clearInterval(nextGameCountdownTicker);
      nextGameCountdownTicker = null;

      // transition now
      // How? Clear current game ID
      GameActions.beginNewGame();
    }

  }

  render() {
    const containerStyle = {
      textAlign: 'center',
      paddingTop: '10px',
    };

    const tabContentHeight = '180px';

    let statusText = null;
    let substatusText = null;

    const g = this.props.game;
    const turnColorName = ChessUtil.colorName(g.turnColor);

    if (g.check) {
      statusText = `Check! ${turnColorName}'s turn.`;
    }
    else if (g.checkmate) {
      statusText = `Checkmate! ${ChessUtil.colorName(g.winner)} wins.`;
      substatusText = `Next game starts in ${this.state.nextGameCountdown}`;
    }
    else if (g.draw) {
      statusText = 'Game ended in a draw.';
    }
    else {
      statusText = `${turnColorName}'s turn.`;      
    }

    // This replaces the textColor value on the palette
    // and then update the keys for each component that depends on it.
    // More on Colors: http://www.material-ui.com/#/customization/colors
    const muiTheme = getMuiTheme({
      accent1Color: Colors.deepOrange500,
      // palette: {
      //   textColor: Colors.cyan500,
      // },
      // appBar: {
      //   height: 50,
      // },
    });

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="container" style={containerStyle}>
          <Scoreboard />

          <div className="row" style={{textAlign: 'center', marginTop:'8px'}}>
            <div className="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
              <Chessboard />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12">
              <h2>{ statusText }</h2>
              {substatusText}
            </div>
          </div>

          <div className="row">
            <div className="col-sm-offset-1 col-sm-5 col-md-offset-2 col-md-4">
              <Paper style={{backgroundColor: '#afafaf', margin: '20px 0'}}>
                <Tabs 
                    onChange={this._handleChangeMovesTabs} 
                    inkBarStyle={{backgroundColor: 'black'}}
                    value={this.state.movesTabIndex + ''}>
                  <Tab label="History" value="0" />
                  <Tab label="Suggestions" value="1" />
                </Tabs>

                <SwipeableViews index={this.state.movesTabIndex} onChangeIndex={this._handleChangeMovesTabsIndex}>
                  <div>
                    <TurnHistory height={tabContentHeight} sanHistory={this.props.game.sanHistory} />
                  </div>
                  <div>
                    <MoveSuggestions height={tabContentHeight} />
                  </div>
                </SwipeableViews>
              </Paper>
            </div>

            <div className="col-sm-5 col-md-4">
              <Paper style={{backgroundColor: '#afafaf', margin: '20px 0'}}>
                <Tabs 
                  onChange={this._handleChangeUsersTabs} 
                  inkBarStyle={{backgroundColor: 'black'}}
                  value={this.state.usersTabIndex + ''}>
                  <Tab label="Players" value="0" />
                  <Tab label="Spectators" value="1" />
                </Tabs>

                <SwipeableViews index={this.state.usersTabIndex} onChangeIndex={this._handleChangeUsersTabIndex}>
                  <div>
                    <PlayerTable height={tabContentHeight} />
                  </div>
                  <div>
                    <SpectatorTable height={tabContentHeight} />
                  </div>
                </SwipeableViews>
              </Paper>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12">
              <RaisedButton label="Reset" onClick={GameActions.resetGame} />
            </div>
          </div>

        </div>
      </MuiThemeProvider>
    );
  }

  // _handleTouchTap() {
  //   this.refs.superSecretPasswordDialog.show();
  // }

}
