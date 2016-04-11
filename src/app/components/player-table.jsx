import React from 'react';

import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
    TableHeader,
    TableHeaderColumn,
} from 'material-ui';

export default class PlayerTable extends React.Component {

  constructor() {
    super();
    this.state = { turns: [] };
  }

  onRowSelection(indexes) {
    console.log("onRowSelection", indexes[0]);
  }

  static propTypes = {
    height: React.PropTypes.string,
  }

  render() {
    return (
      <Table
        height={this.props.height}
        fixedHeader
        fixedFooter
        selectable
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
          deselectOnClickaway
          showRowHover
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
  }

}
