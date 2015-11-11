/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const Table = require('material-ui/lib/table/table');
const TableBody = require('material-ui/lib/table/table-body');
const TableFooter = require('material-ui/lib/table/table-footer');
const TableHeader = require('material-ui/lib/table/table-header');
const TableHeaderColumn = require('material-ui/lib/table/table-header-column');
const TableRow = require('material-ui/lib/table/table-row');
const TableRowColumn = require('material-ui/lib/table/table-row-column');

const MoveSuggestions = React.createClass({

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

    const center = {textAlign: 'center'};

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
              Votes
            </TableHeaderColumn>
            <TableHeaderColumn>
              Move
            </TableHeaderColumn>
           </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway={true}
          showRowHover={true}
          displayRowCheckbox={false}
          stripedRows={true}>
          <TableRow selected={false}>
            <TableRowColumn>25</TableRowColumn>
            <TableRowColumn>e4</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>14</TableRowColumn>
            <TableRowColumn>Nf3</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>10</TableRowColumn>
            <TableRowColumn>a6</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>10</TableRowColumn>
            <TableRowColumn>a6</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>10</TableRowColumn>
            <TableRowColumn>a6</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>  
    );
  },

});

module.exports = MoveSuggestions;
