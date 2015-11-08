const alt = require('../alt');
const PresenceActions = require('../actions/presence-actions');

class PresenceStore {
  constructor() {
    this.presence = {
      players: 0,
      watchers: 0,
    };

    this.bindListeners({
      handleUpdatePresence: PresenceActions.UPDATE_PRESENCE,
      handleFetchPresence: PresenceActions.FETCH_PRESENCE,
      handlePresenceFailed: PresenceActions.PRESENCE_FAILED,
    });
  }

  handleUpdatePresence(presence) {
    this.presence = presence;
    this.errorMessage = null;
    // optionally return false to suppress the store change event
  }

  handleFetchPresence() {
    // reset the array while we're fetching so React can
    // be smart and render a spinner for us since the data is empty.
    this.presence = {};
  }

  handlePresenceFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

module.exports = alt.createStore(PresenceStore, 'PresenceStore');
