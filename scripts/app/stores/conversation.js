import assign from 'object-assign';
import Authenticator from '../utilities/authenticator';
import Constants from '../constants';
import Dispatcher from '../dispatcher';
import events from 'events';
import reqwest from 'reqwest';

let CHANGE_EVENT = 'change';
let defaults = () => {
	return {
		name: 'conversation',
		message: undefined,
		showMessage: false,
		isWaiting: true,
		showQuestions: false,
		questions: undefined
	};
};
let storage;

let Store = assign({}, events.EventEmitter.prototype, {
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},
	changeIsWaiting: function(value) {
		storage.isWaiting = value;
	},
	changeShowMessage: function(value, message) {
		storage.showMessage = value;

		if(message) {
			storage.message = message;
		}
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

		reqwest({
			method: 'get',
			crossOrigin: true,
			url: Constants.Api.USER_SUGGESTIONS,
			contentType: 'application/json',
			headers: {'X-Session-Token': Authenticator.get(sessionStorage, 'sessionID')},
			complete: response => {
				if(response.status && response.status !== 200) {
					storage.showQuestions = true;
					this.changeShowMessage(true,
						'Sorry, there was an error: ' +
						JSON.parse(response.response).message
					);
				} else {
					storage.showQuestions = true;
					storage.questions = response;
				}

				storage.isWaiting = false;
				this.emitChange();
			}
		});
	},
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
});

Dispatcher.register(function(action) {
	switch(action.actionType) {
		case Constants.Actions.CONVERSATION_CHANGE_IS_WAITING:
			Store.changeIsWaiting(action.value);
			Store.emitChange();
			break;
		case Constants.Actions.CONVERSATION_CHANGE_SHOW_MESSAGE:
			Store.changeShowMessage(action.value, action.message);
			Store.emitChange();
			break;
	}
});

export default Store;