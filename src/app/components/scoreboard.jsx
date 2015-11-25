const React = require('react');
const Paper = require('material-ui/lib/paper');
const AppBar = require('material-ui/lib/app-bar');
const Clock = require('./clock');
const Cemetery = require('./cemetery');

const Scoreboard = React.createClass({

  getInitialState () {
    return { };
  },

  componentDidMount() {
  },

  componentWillMount() {
  },

  componentWillUnmount() {
  },

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <AppBar
              title="Crowd vs. Johnny Knight"
              showMenuIconButton={false}
              iconClassNameRight="muidocs-icon-navigation-expand-more" />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-6" style={{textAlign: 'right'}}>
            <Cemetery color='white' taken='q,r,b,n,p' />
          </div>
          <div className="col-xs-6" style={{textAlign: 'left'}}>
            <Cemetery color='black' taken='r,r,b,b,n,n,p,q,q,q,q,q,q,q,q' />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-3 col-sm-offset-2 col-sm-2 col-lg-offset-2 col-lg-2">
            <Clock />
          </div>
          <div className="col-xs-3 col-sm-2">
            <h3>15</h3>
          </div>
          <div className="col-xs-3 col-sm-2">
            <h3>3</h3>
          </div>
          <div className="col-xs-3 col-sm-2">
            <Clock />
          </div>
        </div>

      </div>
    );
  },

});

module.exports = Scoreboard;
