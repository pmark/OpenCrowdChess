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
  secondsRemaining: { w: 300, b: 300 },
};

class GameStore {
  constructor() {
    this.game = this.emptyGame();
    this.turnStartedAtMillis = Number(moment().format('x'));

    this.exportPublicMethods({
      getCurrentGame: this.getCurrentGame,
      whiteTurn: this.whiteTurn,
      blackTurn: this.blackTurn,
      emptyGame: () => this.sanitizeGame({}),
    });
    
    this.bindActions(GameActions);
    GameSource.setChangeListener(this.onSourceChange.bind(this));
  }

  onEndTurn(data) {
    const {chessMove, fen} = data;
    const game = this.game;
    const colorThatPlayed = chessMove.color;
    const otherColor = ChessUtil.inverseTurnColor(colorThatPlayed);

    console.log('store endTurn: game:', game);
    console.log('chessMove:', chessMove);

    if (chessMove.captured) {
      game.capturedPieces = game.capturedPieces || {};
      game.capturedPieces[otherColor] = game.capturedPieces[otherColor] || [];
      game.capturedPieces[otherColor].push(chessMove.captured);

      game.scores = game.scores || {};
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

    const secondsSinceTurnStarted = moment().diff(moment(Number(this.turnStartedAtMillis)), 'milliseconds') / 1000;
    console.log('secondsSinceTurnStarted', secondsSinceTurnStarted);

    console.log('1  game.secondsRemaining[colorThatPlayed]', game.secondsRemaining[colorThatPlayed]);
    game.secondsRemaining[colorThatPlayed] = Math.max(0, Number(game.secondsRemaining[colorThatPlayed]) - secondsSinceTurnStarted);
    console.log('2  game.secondsRemaining[colorThatPlayed]', game.secondsRemaining[colorThatPlayed]);

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

  onSourceChange(key, newValue, options={}) {
    // console.log('onSourceChange this', this, '\n\nkey:', key, 'from', this[key], 'to', newValue)
    console.log('new', key);
    const game = this.game;
    let tmpTurnStartedAtMillis = this.turnStartedAtMillis;

    if (options && options.remove) {
      delete game[key];
    }
    else {
      const oldValue = game[key];

      if (key === 'turnColor') {
        tmpTurnStartedAtMillis = Number(moment().format('x'));
        console.log("\n\nNEW TURN!\n\n");
      }

      game[key] = newValue;
    }

    this.setState({
      game: this.sanitizeGame(game),
      turnStartedAtMillis: tmpTurnStartedAtMillis,
    });
  }
}

module.exports = alt.createStore(GameStore, 'GameStore');
