

const ChessUtil = {

  capturedCount(captured, pieceType) {
  	if (!captured) return 0;
    let count = 0;
    captured.split(',').forEach(function(p) { count += (p === pieceType) ? 1 : 0; });
    return count;
  },

  inverseTurnColor(c) {
    return (c === 'w' ? 'b' : 'w');
  },

  score(capturedPieces) {
    // TODO: count captured promoted pieces as pawn score.
    return ChessUtil.capturedCount(capturedPieces, 'q') * 9 +
      ChessUtil.capturedCount(capturedPieces, 'r') * 5 +
      ChessUtil.capturedCount(capturedPieces, 'b') * 3 +
      ChessUtil.capturedCount(capturedPieces, 'n') * 3 +
      ChessUtil.capturedCount(capturedPieces, 'p') * 1;
  },

};

export default ChessUtil;