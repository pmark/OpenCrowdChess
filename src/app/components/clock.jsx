/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const Paper = require('material-ui/lib/paper');

const Clock = React.createClass({

  getInitialState () {
    return { millis: 30000 };
  },

  componentDidMount() {
  },

  componentWillMount() {
  },

  componentWillUnmount() {
  },

  render() {
    return (
      <Paper zDepth={1} className="time">
        {this.props.playerName} has <strong>00</strong>
        <span>:</span>
        <strong>00</strong> to make a move.
      </Paper>
    );
  },

});

module.exports = Clock;
