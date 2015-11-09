/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const Card = require('material-ui/lib/card');
const List = require('material-ui/lib/lists/list');
const ListItem = require('material-ui/lib/lists/list-item');
const IconPeople = require('material-ui/lib/svg-icons/social/people');
const IconPeopleOutline = require('material-ui/lib/svg-icons/social/people-outline');
const PresenceStore = require('../stores/presence-store');
const PresenceActions = require('../actions/presence-actions');

const Presence = React.createClass({

  getInitialState () {
    return PresenceStore.getState();
  },

  componentDidMount() {
    PresenceActions.fetchPresence();
  },

  componentWillMount() {
    PresenceStore.listen(this.onChange);
  },

  componentWillUnmount() {
    PresenceStore.unlisten(this.onChange);
  },

  onChange(store) {
    this.setState(store);
  },

  render() {
    const players = this.state.presence.players;
    const spectators = this.state.presence.spectators;
  
    return (
      <List style={{textAlign: 'left'}}>
        <ListItem primaryText={`${players} player${players === 1 ? '' : 's'}`} leftIcon={<IconPeople />} />
        <ListItem primaryText={`${spectators} spectator${spectators === 1 ? '' : 's'}`} leftIcon={<IconPeopleOutline />} />
      </List>
    );
  },

  _handleTouchTap() {
    this.refs.superSecretPasswordDialog.show();
  },

});

module.exports = Presence;
