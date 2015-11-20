import uuidlib from 'uuid';

const UUID = {
	get() {
		return window.localStorage.uuid = window.localStorage.uuid || uuidlib.v1();
	},
};

export default UUID;