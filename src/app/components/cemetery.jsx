/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const Paper = require('material-ui/lib/paper');
const Chessmen = require('../lib/unicode-chessmen');
const ChessUtil = require('../lib/chess-util');
const Cemetery = React.createClass({

  getInitialState () {
    return { };
  },

  componentDidMount() {
  },

  componentWillMount() {
  },

  componentWillUnmount() {
  },

  taken() {
    return (this.props.taken ? this.props.taken : '');
  },

  takenPieceIcons(pieceType) {
    let html = '';
    const count = ChessUtil.takenCount(this.taken(), pieceType);
    for (let i=0; i < count; i+=1) {
        html += Chessmen[this.props.color][pieceType];
    }
    return html;
  },

  render() {
    return (
      <h6 style={{marginBottom: '12px'}}>
        <span style={{letterSpacing: '-0.1em'}}>
          {this.takenPieceIcons('q')}
        </span>
        <span>
          {this.takenPieceIcons('r')}
        </span>

        <span>
          {this.takenPieceIcons('b')}
        </span>

        <span>
          {this.takenPieceIcons('n')}
        </span>

        <span style={{letterSpacing: '-0.4em'}}>
          {this.takenPieceIcons('p')}
        </span>
      </h6>
    );
  },

});

module.exports = Cemetery;
