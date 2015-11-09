/** In this file, we create a React component which incorporates components provided by material-ui */

const React = require('react');
const Table = require('material-ui/lib/table');

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

  onRowSelection(a, b) {
    console.log(onRowSelection, a, b);
  },

  render() {
    return (
      <Table.Table
        height='200px'
        fixedHeader={true}
        fixedFooter={true}
        selectable={true}
        multiSelectable={false}
        onRowSelection={this.onRowSelection}>
        <Table.TableBody
          deselectOnClickaway={true}
          showRowHover={true}
          stripedRows={true}>
          <Table.TableRow selected={true}>
            <Table.TableRowColumn>1</Table.TableRowColumn>
            <Table.TableRowColumn>e4</Table.TableRowColumn>
            <Table.TableRowColumn>c5</Table.TableRowColumn>
          </Table.TableRow>
          <Table.TableRow>
            <Table.TableRowColumn>2</Table.TableRowColumn>
            <Table.TableRowColumn>nf3</Table.TableRowColumn>
            <Table.TableRowColumn>d6</Table.TableRowColumn>
          </Table.TableRow>
        </Table.TableBody>
      </Table.Table>  
    );
  },

});

module.exports = TurnHistory;
