const alt = require('../alt');
const GameActions = require('../actions/game-actions');
const GameSource = require('../sources/game-source');
const ChessUtil = require('../lib/chess-util');
const moment = require('moment');

const EMPTY_GAME = {
  id: null,
  lastMoveAt: null,
  turnColor: 'w',
  mainPlayer: { name: '' },
  fenHistory: null,
  sanHistory: null,
  moveSuggestions: null,
  crowdPlayers: null,
  capturedPieces: { w: [], b: [] },
  scores: { w: 0, b: 0 },
};

class GameStore {
  constructor() {
    this.game = this.emptyGame();

    this.exportPublicMethods({
      getCurrentGame: this.getCurrentGame,
      whiteTurn: this.whiteTurn,
      blackTurn: this.blackTurn,
      emptyGame: () => this.sanitizeGame({}),
      // endTurn: this.endTurn,
    });
    
    this.bindActions(GameActions);
    GameSource.setChangeListener(this.onSourceChange.bind(this));
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
      game.capturedPieces[otherColor] = game.capturedPieces[otherColor] || [];
      game.capturedPieces[otherColor].push(chessMove.captured);
      game.scores[colorThatPlayed] = ChessUtil.score(game.capturedPieces[otherColor]);
    }

    game.sanHistory = game.sanHistory || [];
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

    game.fenHistory = game.fenHistory || [];
    game.fenHistory.push(fen);
    game.moveSuggestions = [];
    game.turnColor = otherColor;
    game.lastMoveAt = moment().toString();

    this.setState({ game: game });

    GameSource.updateCurrentGame(game, function(err, idunno) {
      console.log('onEndTurn updateCurrentGame:', err, idunno);
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
    return Object.assign({}, EMPTY_GAME, game);
  }

  emptyGame() {
    return this.sanitizeGame({});
  }

  onUpdateGame(game) {
    game = this.sanitizeGame(game);
    this.setState({game: game});
    console.log('onUpdateGame:', game);
    this.errorMessage = null;
    // optionally return false to suppress the store change event
  }

  onResetGame() {
    const game = this.emptyGame();
    this.setState({ game: game });

    console.log('reset!!', game);
    GameSource.updateCurrentGame(game, function(err, idunno) {
      console.log('self:', self, 'onResetGame update:', err, idunno);
    });

  }

  onFetchGame(game) {
    // reset the array while we're fetching so React can
    // be smart and render a spinner for us since the data is empty.
    // this.game = {};
  }

  onFetchGameFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }

  onSourceChange(key, value, options={}) {
    // console.log('onSourceChange this', this, '\n\nkey:', key, 'from', this[key], 'to', value)
    const game = this.game;
    if (options && options.remove) {
      delete game[key];
    }
    else {
      game[key] = value;      
    }

    this.setState({ game: this.sanitizeGame(game) });
  }
}

module.exports = alt.createStore(GameStore, 'GameStore');
