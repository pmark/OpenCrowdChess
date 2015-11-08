/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const RaisedButton = require('material-ui/lib/raised-button');
const AppBar = require('material-ui/lib/app-bar');
const Dialog = require('material-ui/lib/dialog');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
const LightRawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
const Colors = require('material-ui/lib/styles/colors');
const Presence = require('./presence');
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
      <div style={containerStyle}>
        <AppBar
          title="The chess boss is: Johnny Knight"
          showMenuIconButton={false}
          iconClassNameRight="muidocs-icon-navigation-expand-more" />

        <div id={"board"} style={{width: '35%', marginTop:'10px'}}></div>

        <Presence />
        <h2>Move a piece to start playing.</h2>

        <RaisedButton label="Button" primary={true} onTouchTap={this._handleTouchTap} />

      </div>
    );
  },

  _handleTouchTap() {
    this.refs.superSecretPasswordDialog.show();
  },

});

module.exports = Main;
