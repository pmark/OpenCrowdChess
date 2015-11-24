/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const GameStore = require('../stores/game-store');
const GameActions = require('../actions/game-actions');
const Chess = require('../lib/jhlywa-chess').Chess;

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
      <div id={"board"} style={{width: '80%', marginTop:'8px', marginBottom:'8px'}}></div>
    );
  },

});

module.exports = Chessboard;






////////////////
/*
const chess = new Chess();

const board = new Chessboard('board', {
  position: ChessUtils.FEN.startId,
  eventHandlers: {
    onPieceSelected: pieceSelected,
    onMove: pieceMove,
  },
});

resetGame();

function resetGame() {
  board.setPosition(ChessUtils.FEN.startId);
  chess.reset();

  updateGameInfo('Next player is white.');
}

function updateGameInfo(status) {
  $('#info-status').html(status);
  $('#info-fen').html(chess.fen());
  $('#info-pgn').html(chess.pgn());
}

function pieceMove(move) {

  let nextPlayer,
    status,
    chessMove = chess.move({
      from: move.from,
      to: move.to,
      promotion: 'q'
    });


  nextPlayer = 'white';
  if (chess.turn() === 'b') {
    nextPlayer = 'black';
  }

  if (chessMove !== null) {
    if (chess.in_checkmate() === true) {
      status = 'CHECKMATE! Player ' + nextPlayer + ' lost.';
    } else if (chess.in_draw() === true) {
      status = 'DRAW!';
    } else {
      status = 'Next player is ' + nextPlayer + '.';

      if (chess.in_check() === true) {
        status = 'CHECK! ' + status;        
      }
    }

    updateGameInfo(status);      
  }

  return chess.fen();
}

function pieceSelected(notationSquare) {
  let i,
    movesNotation,
    movesPosition = [];

  movesNotation = chess.moves({square: notationSquare, verbose: true});
  for (i = 0; i < movesNotation.length; i++) {
    movesPosition.push(ChessUtils.convertNotationSquareToIndex(movesNotation[i].to));
  }
  return movesPosition;
}
*/
