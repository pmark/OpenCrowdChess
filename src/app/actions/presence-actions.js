const alt = require('../alt');
const PresenceSource = require('../sources/presence-source');

class PresenceActions {

  constructor() {
    PresenceSource.connect();
  }

  updatePresence(presence) {
    this.dispatch(presence);
  }

  fetchPresence() {
    // we dispatch an event here so we can have "loading" state.
    this.dispatch();

    PresenceSource.setPresenceChangeListener(this.actions.updatePresence);
    PresenceSource.fetch()
    .then((presence) => {
        // we can access other actions within our action through `this.actions`
        this.actions.updatePresence(presence);

      })
    .catch((errorMessage) => {
      this.actions.presenceFailed(errorMessage);
    });
  }

  presenceFailed(errorMessage) {
    console.log("presence fetch errorMessage:", errorMessage)
    this.dispatch(errorMessage);
  }
};

const altered = alt.createActions(PresenceActions);
module.exports = altered;

