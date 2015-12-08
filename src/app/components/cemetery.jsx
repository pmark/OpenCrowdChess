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

  captured() {
    return (this.props.captured ? this.props.captured : '');
  },

  capturedPieceIcons(pieceType) {
    let html = '';
    const count = ChessUtil.capturedCount(this.captured(), pieceType);
    for (let i=0; i < count; i+=1) {
        html += Chessmen[this.props.color][pieceType];
    }
    return html;
  },

  render() {
    return (
      <h6 style={{marginBottom: '12px'}}>
        <span style={{letterSpacing: '-0.1em'}}>
          {this.capturedPieceIcons('q')}
        </span>
        <span>
          {this.capturedPieceIcons('r')}
        </span>

        <span>
          {this.capturedPieceIcons('b')}
        </span>

        <span>
          {this.capturedPieceIcons('n')}
        </span>

        <span style={{letterSpacing: '-0.4em'}}>
          {this.capturedPieceIcons('p')}
        </span>
      </h6>
    );
  },

});

module.exports = Cemetery;
