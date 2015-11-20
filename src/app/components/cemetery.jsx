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
      <div className="row">
        <div className="col-xs-12">
          <h5s>
            {Chessmen[this.props.color].q}
            &nbsp; &nbsp;
            {Chessmen[this.props.color].r}
            {Chessmen[this.props.color].r}
            &nbsp; &nbsp;
            {Chessmen[this.props.color].b}
            {Chessmen[this.props.color].b}
            &nbsp; &nbsp;
            {Chessmen[this.props.color].n}
            {Chessmen[this.props.color].n}
            &nbsp; &nbsp;
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
          </h5s>
        </div>        
      </div>
    );
  },

});

module.exports = Cemetery;
