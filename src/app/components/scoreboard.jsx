import React from 'react';

import { AppBar } from 'material-ui';

// import Clock from './clock';
import Cemetery from './cemetery';

export default class Scoreboard extends React.Component {

  static contextTypes = {
    game: React.PropTypes.object,
  }

  render() {
    const capturedPieces = this.context.game.capturedPieces || {};
    const scores = this.context.game.scores || {};

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <AppBar
              title={`Crowd vs. ${this.context.game.mainPlayer && (this.context.game.mainPlayer.name || 'Nobody')}`}
              showMenuIconButton={false}
              iconClassNameRight="muidocs-icon-navigation-expand-more" />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-6" style={{textAlign: 'right', height: '35px'}}>
            <Cemetery color='w' captured={capturedPieces['w']} />
          </div>
          <div className="col-xs-6" style={{textAlign: 'left'}}>
            <Cemetery color='b' captured={capturedPieces['b']} />
          </div>
        </div>

        <div className="row scores">
          <div className="col-xs-3 col-sm-offset-2 col-sm-2 col-lg-offset-2 col-lg-2">
            {/* <Clock color={'w'}/> */}
          </div>
          <div className="col-xs-3 col-sm-2">
            <h3>{scores['w']}</h3>
          </div>
          <div className="col-xs-3 col-sm-2">
            <h3>{scores['b']}</h3>
          </div>
          <div className="col-xs-3 col-sm-2">
            {/* <Clock color={'b'} > */}
          </div>
        </div>

      </div>
    );
  }

}
