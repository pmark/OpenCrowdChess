const alt = require('../alt');
const GameActions = require('../actions/game-actions');

class GameStore {
  constructor() {
    this.game = {
      id: null,
      mainPlayer: null,
      crowdPlayers: [],
    };

    this.bindActions();
    // this.bindListeners({
    //   handleUpdateGame: GameActions.UPDATE_GAME,
    //   handleFetchCurrentGame: GameActions.FETCH_CURRENT_GAME,
    //   handleFetchGameFailed: GameActions.FETCH_GAME_FAILED,
    // });
  }

  onUpdateGame(game) {
    this.game = game;
    this.errorMessage = null;
    // optionally return false to suppress the store change event
  }

  onFetchGame(game) {
    // reset the array while we're fetching so React can
    // be smart and render a spinner for us since the data is empty.
    this.game = {};
  }

  onFetchGameFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

module.exports = alt.createStore(GameStore, 'GameStore');
