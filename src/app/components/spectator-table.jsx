import React from 'react';

import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
    TableHeader,
    TableHeaderColumn,
} from 'material-ui';

export default class SpectatorTable extends React.Component {
  constructor() {
    super();
    this.state = { turns: [] };
  }

  static propTypes = {
    height: React.PropTypes.string,
  }

  componentDidMount() {
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  onRowSelection(indexes) {
    console.log("onRowSelection", indexes[0]);
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
            <TableRowColumn>Akaylee</TableRowColumn>
            <TableRowColumn>Portland</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Akaisha</TableRowColumn>
            <TableRowColumn>Mexico</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>  
    );
  }

}
