import { Component, PropTypes } from 'react';
import Firebase from 'firebase';
import { firebase } from 'redux-react-firebase';
import Main from './main';

@firebase([
  'currentGameId'
])
export default class CurrentGame extends Component {
  constructor() {
    super();
  }

  static propTypes = {
    currentGameId: PropTypes.string,
    firebase: PropTypes.object,
  };

  render() {
    const { currentGameId, firebase } = this.props;

    if (currentGameId) {
      return this.renderGame(currentGameId);
    }

    console.log('No currentGameId yet.');

    // create currentGameId
    const gameRef = firebase.push('/games', { createdAt: Firebase.ServerValue.TIMESTAMP });
    const newGameId = gameRef.key();
    console.log('newGameId:', newGameId);
    firebase.set('currentGameId', newGameId);
    return this.renderGame(newGameId);
  }

  renderGame(gameId) {
    console.log('Rendering game', gameId);
    return <Main gameId={gameId} />;
  }
}
