/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const RaisedButton = require('material-ui/lib/raised-button');
const AppBar = require('material-ui/lib/app-bar');
const Dialog = require('material-ui/lib/dialog');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
const LightRawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
const Colors = require('material-ui/lib/styles/colors');
const Presence = require('./presence');
const TurnHistory = require('./turn-history');
const Clock = require('./clock');
const Card = require('material-ui/lib/card');
const UUID = require('../sources/uuid-source');

console.log("uuid:", UUID.get());

const Main = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getInitialState () {
    return {
      muiTheme: ThemeManager.getMuiTheme(LightRawTheme),
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

  render() {

    let containerStyle = {
      textAlign: 'center',
      paddingTop: '10px',
    };

    return (
      <div className="container" style={containerStyle}>
        <div className="row">
          <div className="col-sm-offset-1 col-sm-10">
            <AppBar
              title="Crowd vs. Johnny Knight"
              showMenuIconButton={false}
              iconClassNameRight="muidocs-icon-navigation-expand-more" />
          </div>
        </div>

        <div className="row" style={{textAlign: 'center', marginTop:'8px'}}>
          <div className="col-sm-offset-1 col-sm-6">
            <Clock playerName="Johnny Knight" />
            <div id={"board"} style={{width: '80%', marginTop:'8px', marginBottom:'8px'}}></div>
            <Clock playerName="The crowd" />
          </div>
          <div className="col-sm-4">
            <TurnHistory />
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
