const DB_URL = 'https://flickering-heat-391.firebaseio.com/';
import UUID from './uuid-source';

const PresenceSource = {
  _activeUserCache: {},
  _activeUsersRef: null,
  _presenceRef: null,
  _connectedRef: null,
  _currentStatus: null,
  _userRef: null,
  _userData: null,
  _dbRef: null,

  dbRef() {
    if (!PresenceSource._dbRef) {
      PresenceSource._dbRef = new Firebase(DB_URL);
    }
    return PresenceSource._dbRef;
  },

  userRef() {
    if (!PresenceSource._userRef) {
      PresenceSource._userRef = new Firebase(`${DB_URL}/users/${UUID.get()}`);
    }
    return PresenceSource._userRef;
  },

  fetch() {
    return new Promise(function(resolve, reject) {
      let presenceData = null;
      let playerCount = 0;
      let totalCount = 0;
      PresenceSource.activeUsersRef().once('value', function(snapshot) {
          
        snapshot.forEach((childSnapshot) => {
          let uuid = childSnapshot.key();
          let isPlayer = childSnapshot.val();
          PresenceSource._activeUserCache[uuid] = isPlayer;

          if (isPlayer) {
            playerCount = playerCount + 1;
          }

          totalCount = totalCount + 1;
        });

        presenceData = { players: playerCount, watchers: (totalCount-playerCount) };
        resolve(presenceData);
      });

    });
  },

  connect() {
    PresenceSource._connectedRef = new Firebase(`${DB_URL}/.info/connected`);

    PresenceSource._connectedRef.on("value", function(isOnline) {
      if (isOnline.val()) {
        // If we lose our internet connection, we want ourselves removed from the list.
        PresenceSource.presenceRef().onDisconnect().remove();
        console.log("\n\n you're connected \n\n");
        
        PresenceSource.userRef().once("value", function(snapshot) {
          let userData = null;
          if (snapshot.exists()) {
            // We've seen this user before
            userData = snapshot.val();

          }
          else {
            userData = { isPlayer: false, uuid: UUID.get() };
            PresenceSource.userRef().set(userData);
          }

          PresenceSource.presenceRef().set(userData.isPlayer);
          PresenceSource._userData = userData;

          PresenceSource.userRef().on('child_changed', function(snapshot) {
            PresenceSource._userData = snapshot.val();
          });
        });
      }
      else {
        // We need to catch anytime we are marked as offline and then set the correct status. We
        // could be marked as offline 1) on page load or 2) when we lose our internet connection
        // temporarily.
        console.log("\n\n you went offline \n\n");
        // PresenceSource.setUserStatus(PresenceSource._currentStatus);
      }
    });
  },

  activeUsersRef() {
    if (!PresenceSource._activeUsersRef) {
      PresenceSource._activeUsersRef = new Firebase(DB_URL + 'activeUsers');
    }
    return PresenceSource._activeUsersRef;
  },

  presenceRef() {
    if (!PresenceSource._presenceRef) {
      PresenceSource._presenceRef = new Firebase(`${DB_URL}/activeUsers/${UUID.get()}`);
    }
    return PresenceSource._presenceRef;
  },

  setPresenceChangeListener(cb) {
    if (!cb) {
      throw new Error('Empty callback')
    }
    if (typeof(cb) !== 'function') {
      throw new Error('Invalid callback type: ' + typeof(cb) + ' ' + cb);
    }

    PresenceSource.activeUsersRef().off();
    PresenceSource.activeUsersRef().on('child_removed', function(snapshot) {
      console.log("activeUsers child removed:", snapshot.key(), snapshot.val());
      PresenceSource._activeUserCache[snapshot.key()] = null;
      cb(PresenceSource.generatePresence());
    });
    PresenceSource.activeUsersRef().on('child_added', function(snapshot) {
      console.log("activeUsers child added:", snapshot.key(), snapshot.val());
      PresenceSource._activeUserCache[snapshot.key()] = snapshot.val();
      cb(PresenceSource.generatePresence());
    });
    PresenceSource.activeUsersRef().on('child_changed', function(snapshot) {
      console.log("activeUsers child added:", snapshot.key(), snapshot.val());
      PresenceSource._activeUserCache[snapshot.key()] = snapshot.val();
      cb(PresenceSource.generatePresence());
    });
  },

  generatePresence() {
    let playerCount = 0;
    const users = Object.keys(PresenceSource._activeUserCache);
    const totalCount = users.length;
    users.forEach((uuid) => {
      let isPlayer = PresenceSource._activeUserCache[uuid];
      if (isPlayer) {
        playerCount = playerCount + 1;
      }
    });

    return { players: playerCount, watchers: (totalCount-playerCount) };
  },
};

export default PresenceSource;