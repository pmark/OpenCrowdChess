const React = require('react');
const Paper = require('material-ui/lib/paper');
const AppBar = require('material-ui/lib/app-bar');
const Clock = require('./clock');
const Cemetery = require('./cemetery');
const GameStore = require('../stores/game-store');

const Scoreboard = React.createClass({

  // getInitialState () {
  //   // return Object.assign({}, this.props, { turnColor: this.props.game.turnColor });
  //   return this.props.game;
  // },

  // componentDidMount() {
  // },

  // componentWillReceiveProps(newProps) {
  //   console.log('props:', newProps);
  //   console.log('state:', this.state);
  //   this.setState(this.props.game);
  // },

  // componentWillUnmount() {
  // },

  render() {
    const capturedPieces = this.props.game.capturedPieces || {};
    const scores = this.props.game.scores || {};
console.log('Scoreboard render', this.props, 'state:', this.state);

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <AppBar
              title={`Crowd vs. ${this.props.game.mainPlayer && (this.props.game.mainPlayer.name || 'Nobody')}`}
              showMenuIconButton={false}
              iconClassNameRight="muidocs-icon-navigation-expand-more" />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-6" style={{textAlign: 'right', height: '35px'}}>
            <Cemetery color='w' captured={capturedPieces['w']} />
          </div>
          <div className="col-xs-6" style={{textAlign: 'left'}}>
            <Cemetery color='b' captured={capturedPieces['b']} />
          </div>
        </div>

        <div className="row scores">
          <div className="col-xs-3 col-sm-offset-2 col-sm-2 col-lg-offset-2 col-lg-2">
            <Clock running={this.props.game.turnColor === 'w'} seconds={this.props.game.secondsRemaining.w}/>
          </div>
          <div className="col-xs-3 col-sm-2">
            <h3>{scores['w']}</h3>
          </div>
          <div className="col-xs-3 col-sm-2">
            <h3>{scores['b']}</h3>
          </div>
          <div className="col-xs-3 col-sm-2">
            <Clock running={this.props.game.turnColor === 'b'} seconds={this.props.game.secondsRemaining.b} />
          </div>
        </div>

      </div>
    );
  },

});

module.exports = Scoreboard;
