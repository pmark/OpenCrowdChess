/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const GameStore = require('../stores/game-store');
const GameActions = require('../actions/game-actions');
const Chess = require('../lib/jhlywa-chess').Chess;
const Paper = require('material-ui/lib/paper');

const Chessboard = React.createClass({

  getInitialState () {
    return GameStore.getState();
  },

  componentDidMount() {
  },

  componentWillMount() {
    GameStore.listen(this.onChange);
  },

  componentWillUnmount() {
    GameStore.unlisten(this.onChange);
  },

  onChange(store) {
    this.setState(store);
  },

  render() {
    return (
      <div id={"board"} style={{width: '85%', marginTop:'8px', marginBottom:'8px'}}></div>
    );
  },

});

module.exports = Chessboard;
