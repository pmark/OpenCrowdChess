const alt = require('../alt');
const GameSource = require('../sources/game-source');
const ChessUtil = require('../lib/chess-util');

class GameActions {

  constructor() {
  }

  updateGame(game) {
    this.dispatch(game);
  }

  fetchCurrentGame() {
    // GameSource.connect();

    // we dispatch an event here so we can have "loading" state.
    this.dispatch();

    GameSource.getCurrentGame().then((game) => {
        // we can access other actions within our action through `this.actions`
        this.actions.updateGame(game);
      })
    .catch((errorMessage) => {
      this.actions.fetchGameFailed(errorMessage);
    });
  }

  fetchGameFailed(errorMessage) {
    console.log("game fetch errorMessage:", errorMessage)
    this.dispatch(errorMessage);
  }

  addMoveSuggestion(chessMove, crowdPlayer) {
    console.log("TODO: addMoveSuggestion");
  }

  resetGame() {
    // __board.setPosition(ChessUtils.FEN.startId);
    // __chess.reset();
    this.dispatch();
  }

  pieceMoved(move) {
    let nextPlayer;
    let status;
    let chessMove = __chess.move({
      from: move.from,
      to: move.to,
      promotion: 'q',
    });

    nextPlayer = (__chess.turn() === 'b' ? 'black' : 'white');

    if (chessMove !== null) {
      if (__chess.in_checkmate() === true) {
        status = 'CHECKMATE! Player ' + nextPlayer + ' lost.';
      }
      else if (__chess.in_draw() === true) {
        status = 'DRAW!';
      }
      else {
        status = 'Next player is ' + nextPlayer + '.';

        if (__chess.in_check() === true) {
          status = 'CHECK! ' + status;        
        }
      }

      // updateGameInfo(status);      
    }

    const fen = __chess.fen();
    
    // console.log("fen:", fen)
    // console.log("position:", __board.getPosition(ChessUtils.NOTATION.id));

    // __chess = __chess || {};
    // __chess.fen = fen;
    // __chess.lastMove = chessMove;


    // TODO: Show move confirmation instead of ending move right away.
    this.actions.endTurn(chessMove, fen);

    return fen;
  }

  endTurn(chessMove, fen) {
    this.dispatch({ chessMove: chessMove, fen: fen });
  }

  pieceSelected(notationSquare) {
    let i,
      movesNotation,
      movesPosition = [];

    movesNotation = __chess.moves({square: notationSquare, verbose: true});
    for (i = 0; i < movesNotation.length; i++) {
      movesPosition.push(ChessUtils.convertNotationSquareToIndex(movesNotation[i].to));
    }
    return movesPosition;
  }

};

export default alt.createActions(GameActions);

