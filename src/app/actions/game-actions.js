const alt = require('../alt');
const GameSource = require('../sources/game-source');

class GameActions {

  constructor() {
  }

  updateGame(game) {
    console.log("updateGame dispatching", game);
    this.dispatch(game);
  }

  fetchCurrentGame() {
    GameSource.connect();

    // we dispatch an event here so we can have "loading" state.
    this.dispatch();

    GameSource.setGameChangeListener(this.actions.updateGame);
    GameSource.fetch()
    .then((game) => {
        // we can access other actions within our action through `this.actions`
        // console.log("Fetched game:", game);
        this.actions.updateGame(GameSource.generateGame());

      })
    .catch((errorMessage) => {
      this.actions.fetchGameFailed(errorMessage);
    });
  }

  fetchGameFailed(errorMessage) {
    console.log("game fetch errorMessage:", errorMessage)
    this.dispatch(errorMessage);
  }
};

const altered = alt.createActions(GameActions);
module.exports = altered;

