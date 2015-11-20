import FirebaseDB from './firebase-db';
import UUID from './uuid-source';

console.log("firebase FirebaseDB URL:", FirebaseDB.url);

const GameSource = {
  _currentGame: null,
  _currentGameRef: null,
  _gamesRef: null,

  gamesRef() {
    if (!GameSource._gamesRef) {
      GameSource._gamesRef = FirebaseDB.ref().child('games');
    }
    return GameSource._gamesRef;
  },

  getCurrentGame() {
    if (GameSource._currentGame) {
      return new Promise(function(resolve, reject) {
        resolve(GameSource._currentGame);
      })
    }
    else {
      FirebaseDB.ref().child('currentGameId').once('value', function(snapshot) {  
        return snapshot.val();
      })
      .then(function(id) {
        GameSource._currentGameRef = GameSource.gamesRef().child(id);
        GameSource._currentGameRef.once('value', function(snapshot) {  
          _currentGame = snapshot.val();
        });
      });
    }
  },

  getCurrentGameRef() {
    if (!GameSource._currentGameRef) {

      if (!_currentGame) {
      }
      else {
        return new Promise(function(resolve, reject) {
          resolve(GameSource._currentGameRef = GameSource.gamesRef().child(_currentGame.id))
        })
      }
    }
    return GameSource._currentGameRef;
  },

  fetch() {
    return new Promise(function(resolve, reject) {
      let gameData = null;
      let playerCount = 0;
      let totalCount = 0;
      GameSource.activeUsersRef().once('value', function(snapshot) {
          
        snapshot.forEach((childSnapshot) => {
          let uuid = childSnapshot.key();
          let isPlayer = childSnapshot.val();
          GameSource._activeUserCache[uuid] = isPlayer;

          if (isPlayer) {
            playerCount = playerCount + 1;
          }

          totalCount = totalCount + 1;
        });

        gameData = { players: playerCount, spectators: (totalCount-playerCount) };
        resolve(gameData);
      });

    });
  },

  connect() {
    GameSource._connectedRef = new Firebase(`${FirebaseDB.url}/.info/connected`);

    GameSource._connectedRef.on("value", function(isOnline) {
      if (isOnline.val()) {
        // If we lose our internet connection, we want ourselves removed from the list.
        GameSource.gameRef().onDisconnect().remove();
        console.log("\n\n you're connected \n\n");
        
        GameSource.userRef().once("value", function(snapshot) {
          let userData = null;
          if (snapshot.exists()) {
            // We've seen this user before
            userData = snapshot.val();

          }
          else {
            userData = { isPlayer: false, uuid: UUID.get() };
            GameSource.userRef().set(userData);
          }

          GameSource.gameRef().set(userData.isPlayer);
          GameSource._userData = userData;

          GameSource.userRef().on('child_changed', function(snapshot) {
            GameSource._userData = snapshot.val();
          });
        });
      }
      else {
        // We need to catch anytime we are marked as offline and then set the correct status. We
        // could be marked as offline 1) on page load or 2) when we lose our internet connection
        // temporarily.
        console.log("\n\n you went offline \n\n");
        // GameSource.setUserStatus(GameSource._currentStatus);
      }
    });
  },

  activeUsersRef() {
    if (!GameSource._activeUsersRef) {
      GameSource._activeUsersRef = new Firebase(FirebaseDB.url + 'activeUsers');
    }
    return GameSource._activeUsersRef;
  },

  gameRef() {
    if (!GameSource._gameRef) {
      GameSource._gameRef = new Firebase(`${FirebaseDB.url}/activeUsers/${UUID.get()}`);
    }
    return GameSource._gameRef;
  },

  setGameChangeListener(cb) {
    if (!cb) {
      throw new Error('Empty callback')
    }
    if (typeof(cb) !== 'function') {
      throw new Error('Invalid callback type: ' + typeof(cb) + ' ' + cb);
    }

    GameSource.activeUsersRef().off();
    GameSource.activeUsersRef().on('child_removed', function(snapshot) {
      console.log("activeUsers child removed:", snapshot.key(), snapshot.val());
      delete(GameSource._activeUserCache[snapshot.key()]);
      cb(GameSource.generateGame());
    });
    GameSource.activeUsersRef().on('child_added', function(snapshot) {
      console.log("activeUsers child added:", snapshot.key(), snapshot.val());
      GameSource._activeUserCache[snapshot.key()] = snapshot.val();
      cb(GameSource.generateGame());
    });
    GameSource.activeUsersRef().on('child_changed', function(snapshot) {
      console.log("activeUsers child changed:", snapshot.key(), snapshot.val());
      GameSource._activeUserCache[snapshot.key()] = snapshot.val();
      cb(GameSource.generateGame());
    });
  },

  generateGame() {
    let playerCount = 0;
    const users = Object.keys(GameSource._activeUserCache);
    const totalCount = users.length;
    console.log(`${totalCount} active users: ${users}`);

    users.forEach((uuid) => {
      let isPlayer = GameSource._activeUserCache[uuid];
      if (isPlayer) {
        playerCount = playerCount + 1;
      }
    });

    return { players: playerCount, spectators: (totalCount-playerCount) };
  },
};

export default GameSource;