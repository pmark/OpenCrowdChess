/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
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

const Presence = require('./presence');
const TurnHistory = require('./turn-history');
const MoveSuggestions = require('./move-suggestions');
const Chessboard = require('./chessboard');
const Scoreboard = require('./scoreboard');
const UUID = require('../sources/uuid-source');

const Main = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getInitialState () {
    console.log('GameStore.getState():', GameStore.getState())

    return {
      muiTheme: ThemeManager.getMuiTheme(LightRawTheme),
      usersTabIndex: 0,
      game: GameStore.getState().game,
    };
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
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

    return (
      <div className="container" style={containerStyle}>
        <Scoreboard game={this.state.game} />

        <div className="row" style={{textAlign: 'center', marginTop:'8px'}}>
          <div className="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
            <Chessboard />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <h2>Move a piece to start playing.</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-offset-2 col-sm-4 col-md-offset-3 col-md-3">
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
                  <TurnHistory height={tabContentHeight} />
                </div>
                <div>
                  <MoveSuggestions height={tabContentHeight} />
                </div>
              </SwipeableViews>
            </Paper>
          </div>

          <div className="col-sm-4 col-md-3">
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
                  <TurnHistory height={tabContentHeight} />
                </div>
                <div>
                  <MoveSuggestions height={tabContentHeight} />
                </div>
              </SwipeableViews>
            </Paper>
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
