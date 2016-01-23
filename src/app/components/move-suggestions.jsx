/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const Table = require('material-ui/lib/table/table');
const TableBody = require('material-ui/lib/table/table-body');
const TableFooter = require('material-ui/lib/table/table-footer');
const TableHeader = require('material-ui/lib/table/table-header');
const TableHeaderColumn = require('material-ui/lib/table/table-header-column');
const TableRow = require('material-ui/lib/table/table-row');
const TableRowColumn = require('material-ui/lib/table/table-row-column');

const MoveSuggestionsRow = React.createClass({
    render: function() {
        return (
          <TableRow selected={false}>
            <TableRowColumn>{this.props.san}</TableRowColumn>
            <TableRowColumn>{this.props.votes}</TableRowColumn>
          </TableRow>
        );
    },
});

const MoveSuggestions = React.createClass({

  getInitialState () {
    return { };
  },

  contextTypes: {
    game: React.PropTypes.object,
  },

  componentDidMount() {
  },

  componentWillMount() {
  },

  componentWillUnmount() {
  },

  onRowSelection(indexes) {
    console.log("onRowSelection", indexes[0]);
  },

  render() {

    const center = {textAlign: 'center'};
    let rows = null;

    // TODO: Allow crowd to be black
    let suggestions = this.context.game.moveSuggestions['w'];
    console.log('MoveSuggestions:', suggestions);

    if (suggestions) {
      const sorted = suggestions.sort(function(a, b) {
        return b.votes - a.votes;
      });

      rows = sorted.map(function(item, index) {
        return <MoveSuggestionsRow key={index} san={item.san} votes={item.votes} />;
      });
    }

    return (
      <Table
        height={this.props.height}
        fixedHeader={true}
        fixedFooter={true}
        selectable={true}
        multiSelectable={false}
        className='centered-table-text'
        onRowSelection={this.onRowSelection}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>
              Move
            </TableHeaderColumn>
            <TableHeaderColumn>
              Votes
            </TableHeaderColumn>
           </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway={true}
          showRowHover={true}
          displayRowCheckbox={false}
          stripedRows={true}>
          {rows}
        </TableBody>
      </Table>  
    );
  },

});

module.exports = MoveSuggestions;
