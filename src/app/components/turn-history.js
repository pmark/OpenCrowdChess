import React from 'react';

import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
    TableHeader,
    TableHeaderColumn,
} from 'material-ui';

export default class TurnHistory extends React.Component {

  constructor() {
    super();
    this.state = { turns: [] };
  }

  static propTypes = {
    sanHistory: React.PropTypes.object,
    height: React.PropTypes.string,
  }

  onRowSelection(indexes) {
    console.log("history move selected:", indexes[0]);
  }

  render() {
    const moves = [];
    let rows = null;

    if (this.props.sanHistory) {      
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
      rows = moves.reverse().map(function(move, index) {
        const wb = move.split(',');
        const white = wb[0];
        const black = wb[1];
        const turnNumber = (moveCount - index);
        // return <TurnHistoryRow key={index} turnNumber={turnNumber} white={white} black={black} />;
        return {
          key: index,
          turnNumber: turnNumber,
          white: white,
          black: black,
        }
      });
    }

    return (
      <Table
        height={this.props.height}
        fixedHeader
        fixedFooter
        selectable
        multiSelectable={false}
        className='centered-table-text'
        onRowSelection={this.onRowSelection}>
        <TableHeader displaySelectAll={false} enableSelectAll={false} adjustForCheckbox={false}>
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
          deselectOnClickaway={false}
          showRowHover
          displayRowCheckbox={false}
          stripedRows>
          {rows && rows.map(function(item, index) {
            return <TableRow key={item.key}>
              <TableRowColumn>{item.turnNumber}</TableRowColumn>
              <TableRowColumn>{item.white}</TableRowColumn>
              <TableRowColumn>{item.black}</TableRowColumn>
            </TableRow>
          })}
        </TableBody>
      </Table>  
    );
  }

}
