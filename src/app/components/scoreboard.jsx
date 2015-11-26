const React = require('react');
const Paper = require('material-ui/lib/paper');
const AppBar = require('material-ui/lib/app-bar');
const Clock = require('./clock');
const Cemetery = require('./cemetery');
const GameStore = require('../stores/game-store');

const Scoreboard = React.createClass({

  getInitialState () {
    console.log("Scoreboard props:", this.props)
    return { };
  },

  componentDidMount() {
  },

  componentWillMount() {
  },

  componentWillUnmount() {
  },

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <AppBar
              title={`Crowd vs. ${this.props.game.mainPlayer.name}`}
              showMenuIconButton={false}
              iconClassNameRight="muidocs-icon-navigation-expand-more" />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-6" style={{textAlign: 'right'}}>
            <Cemetery color='white' taken={this.props.game.whiteTakenPieces} />
          </div>
          <div className="col-xs-6" style={{textAlign: 'left'}}>
            <Cemetery color='black' taken={this.props.game.blackTakenPieces} />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-3 col-sm-offset-2 col-sm-2 col-lg-offset-2 col-lg-2">
            <Clock running={GameStore.whiteTurn()} seconds="300"/>
          </div>
          <div className="col-xs-3 col-sm-2">
            <h3>{this.props.game.whiteScore}</h3>
          </div>
          <div className="col-xs-3 col-sm-2">
            <h3>{this.props.game.blackScore}</h3>
          </div>
          <div className="col-xs-3 col-sm-2">
            <Clock running={GameStore.blackTurn()} seconds="300" />
          </div>
        </div>

      </div>
    );
  },

});

module.exports = Scoreboard;
