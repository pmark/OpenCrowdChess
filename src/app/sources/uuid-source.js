import uuidlib from 'uuid';

const UUIDx = {
	get() {
		return window.localStorage.uuid = window.localStorage.uuid || uuidlib.v1();
	},
};

export default UUIDx; 