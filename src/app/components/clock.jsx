/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const Paper = require('material-ui/lib/paper');

const TICK_INTERVAL = 100;
let ticker = null;

const Clock = React.createClass({

  getInitialState () {
    return {
      millis: this.props.seconds * 1000,
      ticker: null,
    };
  },

  componentDidMount() {
    ticker = setInterval(this.tick, TICK_INTERVAL);
  },

  componentWillReceiveProps(newProps, ) {
    this.setState({ millis: newProps.seconds * 1000});
  },

  render() {
    const minutes = (this.state.millis / 1000 / 60);
    const mm = parseInt(minutes, 10);
    const seconds = ((minutes - mm) * 60);
    const ss = parseInt(seconds, 10);
    let t = null;
    const eoClass = (isEven(ss) ? 'even' : 'odd');
    const clockClasses = `clock ${eoClass}`;
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
    if (this.props.running) {
      let newTime = this.state.millis - TICK_INTERVAL;
      if (newTime < 0) {
        newTime = 0;
        clearInterval(ticker);
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
