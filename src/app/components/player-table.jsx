/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const Table = require('material-ui/lib/table/table');
const TableBody = require('material-ui/lib/table/table-body');
const TableFooter = require('material-ui/lib/table/table-footer');
const TableHeader = require('material-ui/lib/table/table-header');
const TableHeaderColumn = require('material-ui/lib/table/table-header-column');
const TableRow = require('material-ui/lib/table/table-row');
const TableRowColumn = require('material-ui/lib/table/table-row-column');

const PlayerTable = React.createClass({

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
              Name
            </TableHeaderColumn>
            <TableHeaderColumn>
              Location
            </TableHeaderColumn>
           </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway={true}
          showRowHover={true}
          displayRowCheckbox={false}
          stripedRows={false}>
          <TableRow selected={false}>
            <TableRowColumn>Joe Bishop</TableRowColumn>
            <TableRowColumn>Denver</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Phil Knight</TableRowColumn>
            <TableRowColumn>Beaverton</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>  
    );
  },

});

module.exports = PlayerTable;
