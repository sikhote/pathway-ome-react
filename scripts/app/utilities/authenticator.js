import _ from 'lodash';
import {Api} from '../constants';
import assign from 'object-assign';
import {Buffer} from 'buffer';
import crypto from 'crypto';
import reqwest from 'reqwest';
import uuid from 'node-uuid';

export default {
	activate: function(data, callback) {
		reqwest({
			method: 'post',
			crossOrigin: true,
			url: Api.USER_ACTIVATE,
			data: JSON.stringify(data),
			contentType: 'application/json',
			headers: {'X-Session-Token': this.get(sessionStorage, 'sessionID')},
			complete: callback
		});
	},
	create: function(data, callback) {
		let deviceID = this.getDeviceID();

		reqwest({
			method: 'post',
			crossOrigin: true,
			url: Api.USER_REGISTER,
			data: JSON.stringify({deviceID}),
			contentType: 'application/json'
		}).then(response => {
			let decryptedResponse = this.decrypt(response);
console.log("decryptedResponse:");
console.log(decryptedResponse);
			this.save(sessionStorage, 'sessionID', decryptedResponse.sessionID);
			this.save(sessionStorage, 'userKey', decryptedResponse.userKey);

			this.request({
				method: 'post',
				url: Api.USER_CREATE,
				data,
				complete: callback
			});
		}).fail(callback);
	},
	encrypt: function(payload, keyBuf, ivBuf) {
		let cipher = crypto.createCipheriv('aes-128-cbc', keyBuf, ivBuf);
		let encoded = cipher.update(JSON.stringify(_.trim(payload, '\0')), 'utf8', 'base64');

		encoded += cipher.final('base64');

		return encoded;
	},
	decrypt: function(response) {
		const ivBuf = new Buffer(response.iv, 'base64');
		const dataBuf = new Buffer(response.encryptedPayload, 'base64');
		const keyBuf = new Buffer(Api.KEY, 'base64');
		let decipher = crypto.createDecipheriv('aes-128-cbc', keyBuf, ivBuf);

		decipher.setAutoPadding(false);

		let dec = decipher.update(dataBuf, 'base64', 'utf8');
		dec += decipher.final('utf-8');

		return JSON.parse(_.trim(dec, '\0'));
	},
	decryptUser: function(response) {
		const ivBuf = new Buffer(response.iv, 'base64');
		const dataBuf = new Buffer(response.encryptedPayload, 'base64');
		const keyBuf = new Buffer(this.get(sessionStorage, 'userKey'), 'base64');
		let decipher = crypto.createDecipheriv('aes-128-cbc', keyBuf, ivBuf);

		let dec = decipher.update(dataBuf, 'base64', 'utf-8');
		dec += decipher.final('utf-8');

		return JSON.parse(dec);
	},
	get: function(storage, key) {
		if(storage.authentication) {
			return JSON.parse(storage.authentication)[key];
		} else {
			return undefined;
		}
	},
	getDeviceID: function() {
		let deviceID = this.get(localStorage, 'deviceID');

		if(!deviceID) {
			this.save(localStorage, 'deviceID', uuid.v4());
			deviceID = this.get(localStorage, 'deviceID');
		}

		return deviceID;
	},
	request: function(options) {
		let ivBuf = new Buffer(crypto.randomBytes(16));
		let userKeyBuf = new Buffer(
			this.get(sessionStorage, 'userKey'), 'base64'
		);
		let data = assign({}, options.data, {
			deviceID: this.get(localStorage, 'deviceID')
		});
var string = JSON.stringify({
				iv: ivBuf.toString('base64'),
				encryptedPayload: this.encrypt(data, userKeyBuf, ivBuf)
			});
console.log("string, data, userKeyBuf, ivBuf");
console.log(string);
console.log(data);
console.log(userKeyBuf.toString('base64'));
console.log(ivBuf.toString('base64'));
console.log("--------------");
		reqwest({
			method: options.method,
			crossOrigin: true,
			url: options.url,
			contentType: 'application/json',
			headers: {'X-Session-Token': this.get(sessionStorage, 'sessionID')},
			data: string,
			complete: options.complete
		});

console.log("Decrypted:");
console.log(this.decryptUser({
	iv: ivBuf.toString('base64'),
	encryptedPayload: this.encrypt(data, userKeyBuf, ivBuf)
}));

	},
	save: function(storage, key, value) {
		let data = {};

		if(storage.authentication) {
			data = JSON.parse(storage.authentication);
		}

		data[key] = value;

		storage.authentication = JSON.stringify(data);
	}
};