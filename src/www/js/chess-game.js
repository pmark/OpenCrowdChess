// var __chess = new Chess();

var __board = null;

$(function() {
  console.log("\nDOCUMENT READY\n", window.pieceSelected, window.pieceMoved)
  __board = new Chessboard('board', {
    position: ChessUtils.FEN.startId,
    eventHandlers: {
      onPieceSelected: window.pieceSelected,
      onMove: window.pieceMoved
    }
  });

  window.resetGame();
});


/*
function resetGame() {
  __board.setPosition(ChessUtils.FEN.startId);
  __chess.reset();

  updateGameInfo('Next player is white.');
}

function updateGameInfo(status) {
  $('#info-status').html(status);
  $('#info-fen').html(__chess.fen());
  $('#info-pgn').html(__chess.pgn());
}

function pieceMove(move) {
  var nextPlayer,
    status,
    chessMove = __chess.move({
      from: move.from,
      to: move.to,
      promotion: 'q'
    });

  nextPlayer = 'white';
  if (__chess.turn() === 'b') {
    nextPlayer = 'black';
  }

  if (chessMove !== null) {
    if (__chess.in_checkmate() === true) {
      status = 'CHECKMATE! Player ' + nextPlayer + ' lost.';
    } else if (__chess.in_draw() === true) {
      status = 'DRAW!';
    } else {
      status = 'Next player is ' + nextPlayer + '.';

      if (__chess.in_check() === true) {
        status = 'CHECK! ' + status;        
      }
    }

    updateGameInfo(status);      
  }

  const fen = __chess.fen();
  
  // console.log('chessMove', chessMove)
  // console.log("fen:", fen)
  // console.log("position:", __board.getPosition(ChessUtils.NOTATION.id));

  window.chess = window.chess || {};
  window.chess.fen = fen;
  window.chess.lastMove = chessMove;

  return fen;
}

function pieceSelected(notationSquare) {
  var i,
    movesNotation,
    movesPosition = [];

  movesNotation = __chess.moves({square: notationSquare, verbose: true});
  for (i = 0; i < movesNotation.length; i++) {
    movesPosition.push(ChessUtils.convertNotationSquareToIndex(movesNotation[i].to));
  }
  return movesPosition;
}
*/