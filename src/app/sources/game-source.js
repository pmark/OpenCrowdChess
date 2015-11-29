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

};

export default GameSource;