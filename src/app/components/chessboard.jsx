import React from 'react';
// import Chessboardjs from 'chessboardjs';

// __board is defined globally in chess-game.js 
// TODO: use Chessboardjs another npm module.
export default class Chessboard extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
  }

  render() {
    return (
      <div id={"board"} style={{width: '85%', marginTop:'8px', marginBottom:'8px'}}></div>
    );
  }

}
