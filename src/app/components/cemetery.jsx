/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const Paper = require('material-ui/lib/paper');
const Chessmen = require('../lib/unicode-chessmen');

const Cemetery = React.createClass({

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
      <h5 style={{marginBottom: '12px'}}>
        {Chessmen[this.props.color].q}
        <span>
          {Chessmen[this.props.color].r}
          {Chessmen[this.props.color].r}
        </span>

        <span>
          {Chessmen[this.props.color].b}
          {Chessmen[this.props.color].b}
        </span>

        <span>
          {Chessmen[this.props.color].n}
          {Chessmen[this.props.color].n}
        </span>

        <span style={{letterSpacing: '-0.4em'}}>
          {Chessmen[this.props.color].p}
          {Chessmen[this.props.color].p}
          {Chessmen[this.props.color].p}
          {Chessmen[this.props.color].p}
          {Chessmen[this.props.color].p}
          {Chessmen[this.props.color].p}
          {Chessmen[this.props.color].p}
          {Chessmen[this.props.color].p}
        </span>
      </h5>
    );
  },

});

module.exports = Cemetery;
