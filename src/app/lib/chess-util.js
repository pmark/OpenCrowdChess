export default {

  takenCount(taken, pieceType) {
  	if (!taken) return 0;
    let count = 0;
    taken.split(',').forEach(function(p) { count += (p === pieceType) ? 1 : 0; });
    return count;
  },

};