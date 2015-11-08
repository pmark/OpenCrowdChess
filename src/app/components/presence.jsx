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
    this.setState(store.presence);
  },

  render() {

    let containerStyle = {
      textAlign: 'center',
      paddingTop: '10px',
    };

    return (
      <Card.Card>
        <List style={{width: '200px', textAlign: 'left', float: 'left'}}>
          <ListItem primaryText={`${this.state.players} players`} leftIcon={<IconPeople />} />
          <ListItem primaryText={`${this.state.watchers} watchers`} leftIcon={<IconPeopleOutline />} />
        </List>
      </Card.Card>
    );
  },

  _handleTouchTap() {
    this.refs.superSecretPasswordDialog.show();
  },

});

module.exports = Presence;
