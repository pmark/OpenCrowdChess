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
          <TableRow
            key={this.props.san}
            displayBorder={true}
            selectable={true}>
            <TableRowColumn>{this.props.san}</TableRowColumn>
            <TableRowColumn>{this.props.votes}</TableRowColumn>
          </TableRow>
        );
    },
});

const MoveSuggestions = React.createClass({

  getInitialState () {
    return {
      fixedHeader: true,
      fixedFooter: true,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      displaySelectAll: false,

      stripedRows: false,
      deselectOnClickaway: false,
      showRowHover: false,
      displayRowCheckbox: true,
    };
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
    let rows = null;
    let suggestions = this.context.game.moveSuggestions['w'];
    if (suggestions) {
      rows = suggestions.sort(function(a, b) {
        return b.votes - a.votes;
      });
    }

    return (
      <Table
        height={this.props.height}
        fixedHeader={true}
        fixedFooter={true}
        selectable={true}
        multiSelectable={false}
        onRowSelection={this.onRowSelection}>
        <TableHeader displaySelectAll={false} enableSelectAll={false}  adjustForCheckbox={true}>
          <TableRow>
            <TableHeaderColumn className="center">
              Move
            </TableHeaderColumn>
            <TableHeaderColumn className="center">
              Votes
            </TableHeaderColumn>
           </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway={false}
          showRowHover={true}
          displayRowCheckbox={true}
          preScanRows={false}
          stripedRows={false}>
          {rows && rows.map(function(row) {
            return <TableRow
              key={row.san}
              displayBorder={true}
              selectable={true}>
              <TableRowColumn className="center">{row.san}</TableRowColumn>
              <TableRowColumn className="center">{row.votes}</TableRowColumn>
            </TableRow>
          })}
        </TableBody>
      </Table>  
    );
  },

});

module.exports = MoveSuggestions;
