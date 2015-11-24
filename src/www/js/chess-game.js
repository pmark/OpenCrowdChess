var __chess = new Chess();

var __board = new Chessboard('board', {
  position: ChessUtils.FEN.startId,
  eventHandlers: {
    onPieceSelected: pieceSelected,
    onMove: pieceMove
  }
});

resetGame();

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

  return __chess.fen();
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