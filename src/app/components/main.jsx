
const React = require('react');
const ReactDOM = require('react-dom');
const RaisedButton = require('material-ui/lib/raised-button');
const AppBar = require('material-ui/lib/app-bar');
const Dialog = require('material-ui/lib/dialog');
const Tabs = require('material-ui/lib/tabs/tabs');
const Tab = require('material-ui/lib/tabs/tab');
const Paper = require('material-ui/lib/paper');
const Card = require('material-ui/lib/card');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
const LightRawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
const Colors = require('material-ui/lib/styles/colors');
const SwipeableViews = require('react-swipeable-views');

const GameStore = require('../stores/game-store');
const GameActions = require('../actions/game-actions');

const Presence = require('./presence');
const TurnHistory = require('./turn-history');
const MoveSuggestions = require('./move-suggestions');
const Chessboard = require('./chessboard');
const Scoreboard = require('./scoreboard');
const PlayerTable = require('./player-table');
const SpectatorTable = require('./spectator-table');
const UUID = require('../sources/uuid-source');
const ChessUtil = require('../lib/chess-util');

const Main = React.createClass({

  getInitialState () {
    return {
      muiTheme: ThemeManager.getMuiTheme(LightRawTheme),
      game: GameStore.emptyGame(),
      usersTabIndex: 0,
      movesTabIndex: 0,
    };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object,
    game: React.PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
      game: this.state.game,
    };
  },

  componentDidMount() {
    GameStore.listen(this._onChange);
    GameActions.fetchCurrentGame();

    window.pieceSelected = GameActions.pieceSelected;
    window.pieceMoved = GameActions.pieceMoved;
    window.resetGame = GameActions.resetGame;
  },

  componentWillUnmount: function() {
    GameStore.unlisten(this._onChange);
  },

  _onChange: function(arg) {
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
  },

  componentWillMount() {
    let newMuiTheme = ThemeManager.modifyRawThemePalette(this.state.muiTheme, {
      accent1Color: Colors.deepOrange500,
    });
    
    this.setState({muiTheme: newMuiTheme});
  },

  _handleChangeMovesTabIndex(arg) {
    console.log('_handleChangeMovesTabIndex', arg);
  },

  _handleChangeMovesTabs(arg) {
    console.log('_handleChangeMovesTabs', arg, "this.state.movesTabIndex:", this.state.movesTabIndex);
    this.setState({ movesTabIndex: parseInt(arg, 10) });
  },

  _handleChangeUsersTabIndex(arg) {
    console.log('_handleChangeUsersTabIndex', arg);
  },

  _handleChangeUsersTabs(arg) {
    console.log('_handleChangeUsersTabs', arg, "this.state.usersTabIndex:", this.state.usersTabIndex);
    this.setState({ usersTabIndex: parseInt(arg, 10) });
  },

  render() {
    const containerStyle = {
      textAlign: 'center',
      paddingTop: '10px',
    };

    const tabContentHeight = '180px';

    let statusText = null;

    const g = this.state.game;
    const turnColorName = ChessUtil.colorName(g.turnColor);

    if (g.check) {
      statusText = `Check! ${turnColorName}'s turn.`;
    }
    else if (g.checkmate) {
      statusText = `Checkmate! ${ChessUtil.colorName(g.winner)} wins.`;
    }
    else if (g.draw) {
      statusText = 'Game ended in a draw.';
    }
    else {
      statusText = `${turnColorName}'s turn.`;      
    }

    return (
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
          </div>
        </div>

        <div className="row">
          <div className="col-sm-offset-1 col-sm-5 col-md-offset-2 col-md-4">
            <Paper style={{backgroundColor: '#dfdfdf', margin: '20px 0'}}>
              <Tabs 
                  onChange={this._handleChangeMovesTabs} 
                  inkBarStyle={{backgroundColor: 'black'}}
                  value={this.state.movesTabIndex + ''}>
                <Tab label="History" value="0" />
                <Tab label="Suggestions" value="1" />
              </Tabs>

              <SwipeableViews index={this.state.movesTabIndex} onChangeIndex={this._handleChangeMovesTabsIndex}>
                <div>
                  <TurnHistory height={tabContentHeight} sanHistory={this.state.game.sanHistory} />
                </div>
                <div>
                  <MoveSuggestions height={tabContentHeight} moves={this.state.game.moveSuggestions} />
                </div>
              </SwipeableViews>
            </Paper>
          </div>

          <div className="col-sm-5 col-md-4">
            <Paper style={{backgroundColor: '#dfdfdf', margin: '20px 0'}}>
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
    );
  },

  // _handleTouchTap() {
  //   this.refs.superSecretPasswordDialog.show();
  // },

});

module.exports = Main;
