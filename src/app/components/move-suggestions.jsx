import React from 'react';

import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
    TableHeader,
    TableHeaderColumn,
} from 'material-ui';

export default class MoveSuggestionsRow extends React.Component {
  static propTypes = {
    san: React.PropTypes.string,
    votes: React.PropTypes.number,
  }

  render() {
      return (
        <TableRow
          key={this.props.san}
          displayBorder
          selectable>
          <TableRowColumn>{this.props.san}</TableRowColumn>
          <TableRowColumn>{this.props.votes}</TableRowColumn>
        </TableRow>
      );
  }
}

export default class MoveSuggestions extends React.Component {
  constructor() {
    super();
    this.state = {
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
  }

  static propTypes = {
    height: React.PropTypes.string,
  }

  static contextTypes = {
    game: React.PropTypes.object,
  }

  onRowSelection(indexes) {
    console.log("onRowSelection", indexes[0]);
  }

  render() {
    let rows = null;
    const suggestions = (this.context.game && this.context.game.moveSuggestions ? this.context.game.moveSuggestions.w : []);
    if (suggestions) {
      rows = suggestions.sort(function(a, b) {
        return b.votes - a.votes;
      });
    }

    return (
      <Table
        height={this.props.height}
        fixedHeader
        fixedFooter
        selectable
        multiSelectable={false}
        onRowSelection={this.onRowSelection}>
        <TableHeader displaySelectAll={false} enableSelectAll={false}  adjustForCheckbox>
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
          showRowHover
          displayRowCheckbox
          preScanRows={false}
          stripedRows={false}>
          {rows && rows.map(function(row) {
            return <TableRow
              key={row.san}
              displayBorder
              selectable>
              <TableRowColumn className="center">{row.san}</TableRowColumn>
              <TableRowColumn className="center">{row.votes}</TableRowColumn>
            </TableRow>
          })}
        </TableBody>
      </Table>  
    );
  }

}
