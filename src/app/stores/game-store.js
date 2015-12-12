const alt = require('../alt');
const GameActions = require('../actions/game-actions');
const GameSource = require('../sources/game-source');
const ChessUtil = require('../lib/chess-util');
const moment = require('moment');

const EMPTY_GAME = {
  id: null,
  lastMoveAt: null,
  turnColor: '',
  mainPlayer: { name: '' },
  fenHistory: [],
  sanHistory: [],
  moveSuggestions: [],
  crowdPlayers: [],
  capturedPieces: { w: [], b: [] },
  scores: { w: 0, b: 0 },
};

class GameStore {
  constructor() {
    this.game = Object.assign({}, EMPTY_GAME);
    // this.game.scores['w'] = ChessUtil.score(this.game.capturedPieces['b']);
    // this.game.scores['b'] = ChessUtil.score(this.game.capturedPieces['w']);

    this.exportPublicMethods({
      getCurrentGame: this.getCurrentGame,
      whiteTurn: this.whiteTurn,
      blackTurn: this.blackTurn,
      emptyGame: () => EMPTY_GAME,
      // endTurn: this.endTurn,
    });
    
    this.bindActions(GameActions);
  }

  onEndTurn(data) {
    // Networking:
    // ???

    const {chessMove, fen} = data;
    const game = this.game;
    console.log('store endTurn: game:', game);
    console.log('chessMove:', chessMove);

    const colorThatPlayed = chessMove.color;
    const otherColor = ChessUtil.inverseTurnColor(colorThatPlayed);

    if (chessMove.captured) {
      game.capturedPieces = game.capturedPieces || {};
      game.capturedPieces[otherColor].push(chessMove.captured);
      game.scores[colorThatPlayed] = ChessUtil.score(game.capturedPieces[otherColor]);
    }

    game.sanHistory.push(chessMove.san);
/*
    if (colorThatPlayed === 'w') {
      game.sanHistory.push(chessMove.san);
    }
    else {
      let lastItem = game.sanHistory[game.sanHistory.length-1];
      console.log(game.sanHistory.length-1, '------------lastItem:', lastItem, '\n\n')
      lastItem = `${lastItem},${chessMove.san}`;
      game.sanHistory[game.sanHistory.length-1] = lastItem;
    }
console.log('\n\ncolorThatPlayed', colorThatPlayed, game.sanHistory[game.sanHistory.length-1])
*/

    game.fenHistory.push(fen);
    game.moveSuggestions = [];
    game.turnColor = otherColor;
    game.lastMoveAt = moment().toString();

    this.setState({ game: game });

    GameSource.updateCurrentGame(game, function(err, idunno) {
      console.log('fb game update:', err, idunno);
    });
  }

  // inverseTurnColor() {
  //   return ChessUtil.inverseTurnColor(this.state.turnColor);
  // }

  whiteTurn() {
    return (this.state.game.turnColor === 'w');
  }

  blackTurn() {
    return (this.state.game.turnColor === 'b');
  }

  computeScoresFromTaken() {
    console.log('computeScoresFromTaken:', this.state)
    this.setState({
      scores: {
        white: ChessUtil.score(this.state.capturedPieces['w']),
        black: ChessUtil.score(this.state.capturedPieces['b']),
      },
    });
  }

  getCurrentGame() {
    return this.state.game;
  }

  sanitizeGame(game) {
    return Object.assign(EMPTY_GAME, game);
  }

  onUpdateGame(game) {
    game = this.sanitizeGame(game);
    this.setState({game: game});
    console.log('onUpdateGame:', game);
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

module.exports = alt.createStore(GameStore, 'GameStore');
