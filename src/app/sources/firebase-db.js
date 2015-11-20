import Firebase from 'firebase';
import UUID from './uuid-source';

const suffix = (process.env.NODE_ENV !== 'production' ? '-dev' : '');
const URL = `https://opencrowdchess${suffix}.firebaseio.com/`;
let dbRef = new Firebase(URL);

const FirebaseDB = {
	url: URL,
	ref: dbRef,
};

export default FirebaseDB;

const amOnline = dbRef.child('/.info/connected');
const userRef = dbRef.child('/presence/' + UUID.get());

amOnline.on('value', function(snapshot) {
  if (snapshot.val()) {
    userRef.onDisconnect().remove();
    userRef.set(true);
  }
});
