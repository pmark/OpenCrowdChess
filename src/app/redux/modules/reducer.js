import { combineReducers } from 'redux';
import { firebaseStateReducer } from 'redux-react-firebase';
// import user from './user';
// import game from './game';

export default combineReducers({
  firebase: firebaseStateReducer,
  // user: user.reducer,
  // game: game.reducer,
});
