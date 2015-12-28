/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const Paper = require('material-ui/lib/paper');
const GameSource = require('../sources/game-source');
const GameActions = require('../actions/game-actions');

const TICK_INTERVAL = 100;
let ticker = null;

const Clock = React.createClass({

  getInitialState () {
    return this.stateWithProps(this.props, this.context);
  },

  contextTypes: {
    game: React.PropTypes.object,
  },

  componentDidMount() {
    ticker = setInterval(this.tick, TICK_INTERVAL);
  },

  componentWillReceiveProps(newProps, newContext) {
    this.setState(this.stateWithProps(newProps, newContext));
  },

  stateWithProps(deezProps, context) {
    const g = context.game;
    let running = (
      g.turnColor === deezProps.color && 
      g.fenHistory && 
      g.fenHistory.length > 0 &&
      !g.draw &&
      !g.checkmate
    );

    let secondsRemaining = g.secondsRemaining[deezProps.color];

    if (running) {
      let serverTimestamp = GameSource.serverTimestampMillis();
      if (serverTimestamp === null) {
        console.log('\n\nClock: serverTimestamp is null!!\n\n')
        serverTimestamp = 0;
      }

      const lastTurnTime = g.turnTimes[g.turnTimes.length-1];
      const elapsedMillis = Number(lastTurnTime ? (serverTimestamp - lastTurnTime.endedAt) : 0);
      const elapsedSeconds = (elapsedMillis / 1000);
      secondsRemaining = (secondsRemaining - elapsedSeconds);
    }

    secondsRemaining = Math.max(0, secondsRemaining);

    if (secondsRemaining === 0) { running = false; }

    return {
      millis: parseInt(secondsRemaining * 1000),
      running: running,
    }
  },

  render() {
    const minutes = (this.state.millis / 1000 / 60);
    const mm = parseInt(minutes, 10);
    const seconds = ((minutes - mm) * 60);
    const ss = parseInt(seconds, 10);
    let t = null;
    const eoClass = (isEven(ss) ? 'even' : 'odd');
    const clockClasses = `clock ${eoClass} ${this.state.running ? 'running' : ''}`;
    const zeroPaddedSeconds = (ss < 10 && mm > 0) ? `0${ss}` : ss;
    const jsxSeconds = (<strong>{ zeroPaddedSeconds }</strong>);
    const jsxMinutes = (minutes < 1) ? '' : (<strong>{ mm }</strong>);
    const separator = (mm === 0) ? '' : (<span className='separator'>:</span>);
    const tenths = (mm === 0) ? parseInt((seconds - ss) * 10, 10) : null;

    if (tenths !== null) {
      t = (
        <strong>.{ tenths }</strong>
      );
    }

    return (
      <Paper zDepth={1} className={clockClasses} style={{lineHeight: '60px'}}>          
        {jsxMinutes}
        {separator}
        {jsxSeconds}
        {t}
      </Paper>
    );
  },

  tick() {
    if (this.state.running) {
      let newTime = this.state.millis - TICK_INTERVAL;
      if (newTime < 0) {
        newTime = 0;
        clearInterval(ticker);
        GameActions.clockExpired(this.props.color);
      }
      this.setState({ millis: newTime })
    }
  },

});

function isEven(value) {
  if (value%2 === 0)
    return true;
  else
    return false;
}


module.exports = Clock;
