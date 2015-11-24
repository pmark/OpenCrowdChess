import FirebaseDB from './firebase-db';
import UUID from './uuid-source';

console.log("firebase FirebaseDB URL:", FirebaseDB.url);

const GameSource = {
  _currentGame: null,
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
            const currentGameId = snapshot.val();
            console.log('Got currentGameId:', currentGameId);

            GameSource._currentGameRef = GameSource.gamesRef().child(currentGameId);
            GameSource._currentGameRef.once('value', function(snapshot) {  
              GameSource._currentGame = snapshot.val();
              console.log('Got current game:', GameSource._currentGame);
              resolve(GameSource._currentGame);
            });          
          }
          else {
            console.log("currentGameId dne")

            if (!GameSource._currentGameId) {
              const gameRef = GameSource.gamesRef().push({ createdAt: Firebase.ServerValue.TIMESTAMP })
              GameSource._currentGameId = gameRef.key();
              FirebaseDB.ref.child('currentGameId').set(GameSource._currentGameId);
              console.log('GameSource.getCurrentGame recursing with game ID:', GameSource._currentGameId);
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

};

export default GameSource;