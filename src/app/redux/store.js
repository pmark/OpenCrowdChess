import { createStore, compose } from 'redux'
import { reduxReactFirebase } from 'redux-react-firebase'
import initialState from './modules/initialState';
import reducer from './modules/reducer';

const suffix = ''; // TODO: (process.env.NODE_ENV !== 'production' ? '-dev' : '');
const firebaseURL = `https://occ${suffix}.firebaseio.com/`;

const createStoreWithFirebase = compose(
    reduxReactFirebase(firebaseURL),
)(createStore);
  
export default function configureStore() {
  return createStoreWithFirebase(reducer, initialState);
}
