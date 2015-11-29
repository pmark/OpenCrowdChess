const alt = require('../alt');
const GameActions = require('../actions/game-actions');
const ChessUtil = require('../lib/chess-util');

class GameStore {
  constructor() {
    this.game = {
      id: null,
      mainPlayer: {
        name: 'Joe Bishop',
      },
      crowdPlayers: [],
      whiteTakenPieces: 'q,r,b,n,p',
      blackTakenPieces: 'r,r,b,b,n,n,p,q,q',
      whiteScore: 0,
      blackScore: 0,
      turnColor: '',
      fenHistory: [],
    };

    this.game.whiteScore = this.score(this.game.whiteTakenPieces);
    this.game.blackScore = this.score(this.game.blackTakenPieces);

    this.exportPublicMethods({
      getGame: this.getGame,
      whiteTurn: this.whiteTurn,
      blackTurn: this.blackTurn,
      endTurn: this.endTurn,
    });
    
    this.bindActions(GameActions);
  }

  endTurn(fen) {
    this.state.game.fenHistory.push(fen);
    this.state.turnColor = this.inverseTurnColor();
  }

  inverseTurnColor() {
    return (this.state.turnColor === 'w' ? 'b' : 'w');
  }

  score(takenPieces) {
    // TODO: count captured promoted pieces as pawn score.
    return ChessUtil.takenCount(takenPieces, 'q') * 9 +
      ChessUtil.takenCount(takenPieces, 'r') * 5 +
      ChessUtil.takenCount(takenPieces, 'b') * 3 +
      ChessUtil.takenCount(takenPieces, 'n') * 3 +
      ChessUtil.takenCount(takenPieces, 'p') * 1;
  }

  whiteTurn() {
    return (this.state.game.turnColor === 'w');
  }

  blackTurn() {
    return (this.state.game.turnColor === 'b');
  }

  computeScoresFromTaken() {
    const whiteScore = this.score(this.state.whiteTakenPieces);
    const blackScore = this.score(this.state.blackTakenPieces);
    this.setState({whiteScore: whiteScore, blackScore: blackScore});
  }

  getGame() {
    return this.game;
  }

  onUpdateGame(game) {
    this.game = game;
    this.errorMessage = null;
    // optionally return false to suppress the store change event
  }

  onFetchGame(game) {
    // reset the array while we're fetching so React can
    // be smart and render a spinner for us since the data is empty.
    // this.game = {};
  }

  onFetchGameFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

GameActions.fetchCurrentGame();

module.exports = alt.createStore(GameStore, 'GameStore');
