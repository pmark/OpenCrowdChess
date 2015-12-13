2/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const Table = require('material-ui/lib/table/table');
const TableBody = require('material-ui/lib/table/table-body');
const TableFooter = require('material-ui/lib/table/table-footer');
const TableHeader = require('material-ui/lib/table/table-header');
const TableHeaderColumn = require('material-ui/lib/table/table-header-column');
const TableRow = require('material-ui/lib/table/table-row');
const TableRowColumn = require('material-ui/lib/table/table-row-column');

const TurnHistoryRow = React.createClass({
    render: function() {
        return (
          <TableRow selected={false}>
            <TableRowColumn>{this.props.turnNumber}</TableRowColumn>
            <TableRowColumn>{this.props.white}</TableRowColumn>
            <TableRowColumn>{this.props.black}</TableRowColumn>
          </TableRow>
        );
    },
});

const TurnHistory = React.createClass({

  getInitialState () {
    return { turns: [] };
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

    const moves = [];
    let white = true;
    this.props.sanHistory.forEach(function(san) {
      if (white) {
        moves.push(san);
      }
      else {
        moves[moves.length-1] = `${moves[moves.length-1]},${san}`;
      }
      white = !white;
    });

    const moveCount = moves.length;
    const rows = moves.reverse().map(function(move, index) {
      const wb = move.split(',');
      const white = wb[0];
      const black = wb[1];
      const turnNumber = (moveCount - index);
      return <TurnHistoryRow key={index} turnNumber={turnNumber} white={white} black={black} />;
    });

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
              Turn
            </TableHeaderColumn>
            <TableHeaderColumn>
              White
            </TableHeaderColumn>
            <TableHeaderColumn>
              Black
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

module.exports = TurnHistory;
