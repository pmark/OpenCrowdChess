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
      capturedPieces: {
        w: 'q,r,b,n,p',
        b: 'r,r,b,b,n,n,p,q,q',
      },
      scores: {
        w: 0,
        b: 0,
      },
      turnColor: '',
      fenHistory: [],
    };

    this.game.scores['w'] = ChessUtil.score(this.game.capturedPieces['b']);
    this.game.scores['b'] = ChessUtil.score(this.game.capturedPieces['w']);

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
    this.state.game.turnColor = this.inverseTurnColor();
  }

  inverseTurnColor() {
    return ChessUtil.inverseTurnColor(this.state.turnColor);
  }

  whiteTurn() {
    return (this.state.game.turnColor === 'w');
  }

  blackTurn() {
    return (this.state.game.turnColor === 'b');
  }

  computeScoresFromTaken() {
    this.setState({
      scores: {
        white: ChessUtil.score(this.state.capturedPieces['w']),
        black: ChessUtil.score(this.state.capturedPieces['b']),
      },
    });
  }

  getGame() {
    return this.state.game;
  }

  onUpdateGame(game) {
    this.setState({game: game});
    console.log('onUpdateGame state', this.state);
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
