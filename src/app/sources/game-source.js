import FirebaseDB from './firebase-db';
import UUID from './uuid-source';

// console.log("firebase FirebaseDB URL:", FirebaseDB.url);

const GameSource = {
  _currentGame: null,
  _currentGameId: null,
  _currentGameRef: null,
  _gamesRef: null,

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
    if (!GameSource._currentGameRef) {
      GameSource._currentGameRef = new Firebase(`${FirebaseDB.url}/games/${GameSource._currentGameId}`);
    }
    return GameSource._currentGameRef;
  },

  updateCurrentGame(data, done) {
    GameSource.currentGameRef().set(data, done);
  },

  setChangeListener(cb) {
    if (!cb) {
      throw new Error('Empty callback')
    }
    if (typeof(cb) !== 'function') {
      throw new Error('Invalid callback type: ' + typeof(cb) + ' ' + cb);
    }

    const ref = GameSource.currentGameRef();
    ref.off();
    // ref.on('child_removed', function(snapshot) {
    //   console.log("activeUsers child removed:", snapshot.key(), snapshot.val());
    //   delete(GameSource._activeUserCache[snapshot.key()]);
    //   cb(GameSource.generatePresence());
    // });
    // ref.on('child_added', function(snapshot) {
    //   console.log("activeUsers child added:", snapshot.key(), snapshot.val());
    //   GameSource._activeUserCache[snapshot.key()] = snapshot.val();
    //   cb(GameSource.generatePresence());
    // });

    ref.on('child_changed', function(snapshot) {
      console.log("game child_changed:", snapshot.key(), snapshot.val());      
      cb(snapshot.key(), snapshot.val());

      // const game = GameSource.getCurrentGame().then(function(game) {
      //   // console.log('self:', self);
      //   cb(snapshot.key(), snapshot.val());
      // });
    });
  },  

};

export default GameSource;