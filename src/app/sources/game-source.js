import FirebaseDB from './firebase-db';
import UUID from './uuid-source';

// console.log("firebase FirebaseDB URL:", FirebaseDB.url);

const GameSource = {
  _currentGame: null,
  _currentGameId: null,
  _currentGameRef: null,
  _gamesRef: null,
  _changeListener: null,

  gamesRef() {
    if (!GameSource._gamesRef) {
      GameSource._gamesRef = FirebaseDB.ref.child('games');
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
      return new Promise(function(resolve, reject) {
        FirebaseDB.ref.child('currentGameId').once('value', function(snapshot) {  
          if (snapshot.exists()) {
            GameSource._currentGameId = snapshot.val();
            console.log('GameSource._currentGameId:', GameSource._currentGameId);

            GameSource.currentGameRef().once('value', function(snapshot) {  
              GameSource._currentGame = snapshot.val();
              resolve(GameSource._currentGame);
            });
          }
          else {
            if (!GameSource._currentGameId) {
              const firstGameRef = GameSource.gamesRef().push({ createdAt: Firebase.ServerValue.TIMESTAMP })
              GameSource._currentGameId = firstGameRef.key();
              FirebaseDB.ref.child('currentGameId').set(GameSource._currentGameId);
              return GameSource.getCurrentGame();            
            }
            else {
              reject("Exception starting first game.");
            }
          }
        });
      });
    }
  },

  currentGameRef() {
    if (!GameSource._currentGameRef && GameSource._currentGameId) {
      GameSource._currentGameRef = new Firebase(`${FirebaseDB.url}/games/${GameSource._currentGameId}`);
      GameSource.assignChangeListenerToCurrentGameRef();
    }
    return GameSource._currentGameRef;
  },

  updateCurrentGame(data, done) {
    GameSource.currentGameRef().set(data, done);
  },

  assignChangeListenerToCurrentGameRef() {
    const ref = GameSource.currentGameRef();
    if (ref && GameSource._changeListener) {
      ref.off();
      ref.on('child_added', function(snapshot) {
        console.log("game child_added:", snapshot.key(), snapshot.val());
        GameSource._changeListener(snapshot.key(), snapshot.val());
      });
      ref.on('child_changed', function(snapshot) {
        // console.log("game child_changed:", snapshot.key(), snapshot.val());      
        GameSource._changeListener(snapshot.key(), snapshot.val());
      });
      ref.on('child_removed', function(snapshot) {
        console.log("game child_removed:", snapshot.key(), snapshot.val());
        GameSource._changeListener(snapshot.key(), snapshot.val(), { remove: true });
      });
    }
  },

  setChangeListener(cb) {
    if (!cb) {
      throw new Error('Empty callback')
    }
    if (typeof(cb) !== 'function') {
      throw new Error('Invalid callback type: ' + typeof(cb) + ' ' + cb);
    }

    GameSource._changeListener = cb;
    GameSource.assignChangeListenerToCurrentGameRef();
  },  

};

export default GameSource;