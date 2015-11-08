var DB_URL = 'https://flickering-heat-391.firebaseio.com/';

var DB = {
	_userList: null,
	userList: function() {
		return (_userList ? _userList : new Firebase(DB_URL + 'userList'));
	},

	set: function(data) {
		myDataRef.set(data);
	},

	push: function(data) {
		var myDataRef = new Firebase(DB_URL);

		myDataRef.push(data);
	},

	// fn(snapshot, prevChildKey), snapshot.val()
	addChildAddedEventListener: function(fn) {
		myDataRef.on('child_added', fn);
	},

	// fn(snapshot), snapshot.val()
	addChildChangedEventListener: function(fn) {
		myDataRef.on('child_changed', fn);
	},

	// fn(snapshot), snapshot.val()
	addChildRemovedEventListener: function(fn) {
		myDataRef.on('child_removed', fn);
	},

	addChildMovedEventListener: function(fn) {
		myDataRef.on('child_moved', fn);
	},


}