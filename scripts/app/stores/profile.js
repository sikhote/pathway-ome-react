import assign from 'object-assign';
//import Authenticator from '../utilities/authenticator';
import Constants from '../constants';
import Dispatcher from '../dispatcher';
import events from 'events';
//import Help from '../data/help';
//import router from '../router';
//import Validator from '../utilities/validator';

let CHANGE_EVENT = 'change';
let defaults = () => {
	return {
		name: 'profile',
		message: undefined,
		showMessage: false,
		isWaiting: true,
		showForm: false
	};
};
let storage;

let Store = assign({}, events.EventEmitter.prototype, {
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},
	changeAgreedToConsent: function(value) {
		storage.agreedToConsent = value;
	},
	changeIsWaiting: function(value) {
		storage.isWaiting = value;
	},
	changeShowConsent: function(value) {
		storage.showConsent = value;
	},
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},
	get: function(keys) {
		let value = storage;

		for(let key in keys) {
			value = value[keys[key]];
		}

		return value;
	},
	initialize: function() {
		storage = defaults();

		console.log('get data via function and emit change');
	},
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
});

Dispatcher.register(function(action) {
	switch(action.actionType) {
		case Constants.Actions.PROFILE_CHANGE_IS_WAITING:
			Store.changeIsWaiting(action.value);
			Store.emitChange();
			break;
		case Constants.Actions.PROFILE_CHANGE_SHOW_MESSAGE:
			Store.changeShowMessage(action.value, action.message);
			Store.emitChange();
			break;
		case Constants.Actions.PROFILE_CLOSE:
			Store.close();
			Store.emitChange();
			break;
		case Constants.Actions.PROFILE_SUBMIT:
			Store.submit(action.fields);
			Store.emitChange();
			break;
	}
});

export default Store;