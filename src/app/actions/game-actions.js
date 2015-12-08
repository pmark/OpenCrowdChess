const alt = require('../alt');
const GameSource = require('../sources/game-source');
const ChessUtil = require('../lib/chess-util');

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

  endTurn(chessMove, fen) {
    console.log('endTurn...', GameSource._currentGame)

    GameSource.getCurrentGame().then((game) => {
        console.log('got current game:', game);

        const colorThatPlayed = chessMove.color;
        const otherColor = ChessUtil.inverseTurnColor(colorThatPlayed);

        if (chessMove.captured) {
          game.capturedPieces = game.capturedPieces || {};
          game.capturedPieces[otherColor].push(chessMove.captured);
          game.scores[colorThatPlayed] = ChessUtil.score(game.capturedPieces[otherColor]);
        }

        // Set move history
        game.fenHistory = game.fenHistory || [];
        game.fenHistory.push(fen);

        game.turnColor = otherColor;
        this.actions.updateGame(game);
      })
    .catch((errorMessage) => {
      console.log("endTurn Error fetching game:", errorMessage)
    });

  }
};

export default alt.createActions(GameActions);

