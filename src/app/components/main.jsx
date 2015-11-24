/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const RaisedButton = require('material-ui/lib/raised-button');
const AppBar = require('material-ui/lib/app-bar');
const Dialog = require('material-ui/lib/dialog');
const Tabs = require('material-ui/lib/tabs/tabs');
const Tab = require('material-ui/lib/tabs/tab');
const Paper = require('material-ui/lib/paper');
const SwipeableViews = require('react-swipeable-views');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
// const DarkRawTheme = require('material-ui/lib/styles/raw-themes/dark-raw-theme');
const LightRawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
const Colors = require('material-ui/lib/styles/colors');
const Presence = require('./presence');
const TurnHistory = require('./turn-history');
const MoveSuggestions = require('./move-suggestions');
const Card = require('material-ui/lib/card');
const UUID = require('../sources/uuid-source');
const Chessboard = require('./chessboard');
const Scoreboard = require('./scoreboard');

console.log("uuid:", UUID.get());

const Main = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getInitialState () {
    return {
      muiTheme: ThemeManager.getMuiTheme(LightRawTheme),
      tabIndex: 0,
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

  _handleChangeIndex(arg) {
    console.log('_handleChangeIndex', arg);
  },

  _handleChangeTabs(arg) {
    console.log('_handleChangeTabs', arg, "this.state.tabIndex:", this.state.tabIndex);
    this.setState({ tabIndex: parseInt(arg, 10) });
  },

  render() {
    const containerStyle = {
      textAlign: 'center',
      paddingTop: '10px',
    };

    const tabContentHeight = '180px';

    return (
      <div className="container" style={containerStyle}>
        <Scoreboard />

        <div className="row" style={{textAlign: 'center', marginTop:'8px'}}>
          <div className="col-sm-6">
            <Chessboard />
          </div>

          <div className="col-sm-4">
            <Paper style={{backgroundColor: '#dfdfdf'}}>
              <Tabs 
                  onChange={this._handleChangeTabs} 
                  inkBarStyle={{backgroundColor: 'black'}}
                  value={this.state.tabIndex + ''}>
                <Tab label="History" value="0" />
                <Tab label="Suggestions" value="1" />
              </Tabs>

              <SwipeableViews index={this.state.tabIndex} onChangeIndex={this._handleChangeIndex}>
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

        <div className="row">
          <div className="col-xs-offset-1 col-xs-6">
            <h2>Move a piece to start playing.</h2>
          </div>
          <div className="col-xs-offset-1 col-xs-10">
            <Presence/>
          </div>
        </div>

      </div>
    );
  },

  _handleTouchTap() {
    this.refs.superSecretPasswordDialog.show();
  },

});

module.exports = Main;
