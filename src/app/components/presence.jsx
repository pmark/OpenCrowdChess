/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const Card = require('material-ui/lib/card');
const List = require('material-ui/lib/lists/list');
const ListItem = require('material-ui/lib/lists/list-item');
const IconPeople = require('material-ui/lib/svg-icons/social/people');
const IconPeopleOutline = require('material-ui/lib/svg-icons/social/people-outline');

const Presence = React.createClass({

  getInitialState () {
    return {
      players: 0,
      watchers: 0,
    };
  },

  componentWillMount() {
    // this.setState({
    //   players: 0,
    //   watchers: 1,
    // });
  },

  render() {

    let containerStyle = {
      textAlign: 'center',
      paddingTop: '10px',
    };

    return (
      <Card.Card>
        <List style={{width: '200px', textAlign: 'left', float: 'left'}}>
          <ListItem primaryText={`${this.state.players} Players`} leftIcon={<IconPeople />} />
          <ListItem primaryText={`${this.state.watchers} Watchers`} leftIcon={<IconPeopleOutline />} />
        </List>
      </Card.Card>
    );
  },

  _handleTouchTap() {
    this.refs.superSecretPasswordDialog.show();
  },

});

module.exports = Presence;
