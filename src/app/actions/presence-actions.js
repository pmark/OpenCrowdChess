const alt = require('../alt');
const PresenceSource = require('../sources/presence-source');

class PresenceActions {

  constructor() {
  }

  updatePresence(presence) {
    console.log("updatePresence dispatching", presence);
    this.dispatch(presence);
  }

  fetchPresence() {
    // PresenceSource.connect();

    // we dispatch an event here so we can have "loading" state.
    this.dispatch();

    PresenceSource.setPresenceChangeListener(this.actions.updatePresence);
    PresenceSource.fetch()
    .then((presence) => {
        // we can access other actions within our action through `this.actions`
        // console.log("Fetched presence:", presence);
        this.actions.updatePresence(PresenceSource.generatePresence());

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

