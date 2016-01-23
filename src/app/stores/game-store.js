const alt = require('../alt');
const GameActions = require('../actions/game-actions');
const GameSource = require('../sources/game-source');
const ChessUtil = require('../lib/chess-util');
const moment = require('moment');

const EMPTY_GAME = {
  id: null,
  turnColor: 'w',
  mainPlayer: { name: '' },
  fenHistory: null,
  sanHistory: null,
  turnTimes: [],
  moveSuggestions: null,
  crowdPlayers: null,
  capturedPieces: { w: [], b: [] },
  scores: { w: 0, b: 0 },
  secondsRemaining: { w: 10, b: 10 },
  firstMoveAt: null,
  winner: null,
  draw: null,
  check: false,
};

class GameStore {
  constructor() {
    this.game = this.emptyGame();

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
    const { chessMove, fen, status } = data;
    const game = this.game;
    const colorThatPlayed = chessMove.color;
    const otherColor = ChessUtil.inverseTurnColor(colorThatPlayed);

    if (chessMove.captured) {
      game.capturedPieces = game.capturedPieces || {};
      game.capturedPieces[otherColor] = game.capturedPieces[otherColor] || [];
      game.capturedPieces[otherColor].push(chessMove.captured);

      game.scores = game.scores || {};
      game.scores[colorThatPlayed] = ChessUtil.score(game.capturedPieces[otherColor]);
    }

    game.firstMoveAt = game.firstMoveAt || Firebase.ServerValue.TIMESTAMP;

    game.sanHistory = game.sanHistory || [];
    game.sanHistory.push(chessMove.san);

    game.fenHistory = game.fenHistory || [];
    game.fenHistory.push(fen);

    game.moveSuggestions = [];
    game.turnColor = otherColor;

    game.turnTimes = game.turnTimes || [];
    const lastTurnTime = game.turnTimes[game.turnTimes.length-1];
    const serverTimestamp = GameSource.serverTimestampMillis();
    const elapsedSeconds = parseInt((lastTurnTime ? (serverTimestamp - lastTurnTime.endedAt) : 0) / 100) / 10;

    game.turnTimes.push({
      endedAt: serverTimestamp,
      turnColor: colorThatPlayed,
      elapsed: elapsedSeconds,
    });

    if (elapsedSeconds > 0) {
      game.secondsRemaining[colorThatPlayed] = Math.max(0, Number(game.secondsRemaining[colorThatPlayed]) - elapsedSeconds);
    }

    game.winner = status.winner;
    game.check = status.check;
    game.checkmate = status.checkmate;
    game.draw = status.draw;

    if (status.check) {
      console.log('check!')
    }

    if (status.checkmate) {
      console.log('checkmate!')
    }

    if (status.winner) {
      console.log('winner:', status.winner)
    }
    
    if (status.draw) {
      console.log('draw!')
    }

    this.setState({ game: game });

    GameSource.updateCurrentGame(game, function(err, idunno) {
      console.log('onEndTurn updateCurrentGame:', err, idunno);
    });
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
        w: ChessUtil.score(this.state.capturedPieces['w']),
        b: ChessUtil.score(this.state.capturedPieces['b']),
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
    this.errorMessage = null;
    // optionally return false to suppress the store change event
  }

  onResetGame() {
    const game = this.emptyGame();
    this.setState({ game: game });

    GameSource.newGame(function(err) {
    });
  }

  onBeginNewGame() {
    const game = this.emptyGame();
    this.setState({ game: game });

    GameSource.newGame(function(err) {
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

  onSourceChange(newValue, options={}) {
    this.setState({
      game: this.sanitizeGame(newValue),
    });
  }
/*
  onSourceKeyChange(key, newValue, options={}) {
    // console.log('onSourceChange this', this, '\n\nkey:', key, 'from', this[key], 'to', newValue)
    console.log('new', key);
    const game = this.game;
    let tmpTurnStartedAt = this.turnStartedAt;

    if (options && options.remove) {
      delete game[key];
    }
    else {
      const oldValue = game[key];

      if (key === 'turnColor') {
        console.log("\n\nNEW TURN!\n\n");
        tmpTurnStartedAt = Number(moment().format('x'));
      }

      game[key] = newValue;
    }

    this.setState({
      // game: this.sanitizeGame(game),
      turnStartedAt: tmpTurnStartedAt,
    });
  }
*/

}

module.exports = alt.createStore(GameStore, 'GameStore');
