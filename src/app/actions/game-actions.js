const alt = require('../alt');
const GameSource = require('../sources/game-source');
const ChessUtil = require('../lib/chess-util');
const chess = new Chess();

class GameActions {

  constructor() {
  }

  updateGame(game) {
    console.log("updateGame dispatching", game);
    this.dispatch(game);
  }

  fetchCurrentGame() {
    // GameSource.connect();

    // we dispatch an event here so we can have "loading" state.
    this.dispatch();

    GameSource.getCurrentGame().then((game) => {
        // we can access other actions within our action through `this.actions`
        // console.log("Fetched game:", game);
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
    __board.setPosition(ChessUtils.FEN.startId);
    chess.reset();
  }

  pieceMoved(move) {
    // console.log('moving piece:', move);
    let nextPlayer,
      status,
      chessMove = chess.move({
        from: move.from,
        to: move.to,
        promotion: 'q',
      });

    nextPlayer = (chess.turn() === 'b' ? 'black' : 'white');

    if (chessMove !== null) {
      if (chess.in_checkmate() === true) {
        status = 'CHECKMATE! Player ' + nextPlayer + ' lost.';
      }
      else if (chess.in_draw() === true) {
        status = 'DRAW!';
      }
      else {
        status = 'Next player is ' + nextPlayer + '.';

        if (chess.in_check() === true) {
          status = 'CHECK! ' + status;        
        }
      }

      // updateGameInfo(status);      
    }

    const fen = chess.fen();
    
    console.log('chessMove', chessMove)
    // console.log("fen:", fen)
    // console.log("position:", __board.getPosition(ChessUtils.NOTATION.id));

    // window.chess = window.chess || {};
    // window.chess.fen = fen;
    // window.chess.lastMove = chessMove;


    // TODO: Show move confirmation instead of ending move right away.
    this.actions.endTurn(chessMove, fen);

    return fen;
  }

  pieceSelected(notationSquare) {
    let i,
      movesNotation,
      movesPosition = [];

    movesNotation = chess.moves({square: notationSquare, verbose: true});
    for (i = 0; i < movesNotation.length; i++) {
      movesPosition.push(ChessUtils.convertNotationSquareToIndex(movesNotation[i].to));
    }
    return movesPosition;
  }

  endTurn(chessMove, fen) {
    this.dispatch({ chessMove: chessMove, fen: fen });
  }
};

export default alt.createActions(GameActions);

