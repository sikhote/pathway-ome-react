import {React, TweenMax} from '../../libs';
import Actions from '../actions';
import Validator from '../utilities/validator';
import Help from '../data/help';
import input from './input';
import CreateStore from '../stores/create';

function getState() {
	return {
		isEmailValid: CreateStore.isValid('email'),
		emailHelp: CreateStore.getHelp('email'),
		shouldShowEmailHelp: CreateStore.shouldShowHelp('email'),
		isPasswordValid: CreateStore.isValid('password'),
		passwordHelp: CreateStore.getHelp('password'),
		shouldShowPaswordHelp: CreateStore.shouldShowHelp('password'),
		isRepeatPasswordValid: CreateStore.isValid('repeatPassword'),
		repeatPasswordHelp: CreateStore.getHelp('repeatPassword'),
		shouldShowRepeatPaswordHelp: CreateStore.shouldShowHelp('repeatPassword')
	};
}

export default React.createClass({
	displayName: 'Create',
	mixins: [React.addons.PureRenderMixin, React.addons.LinkedStateMixin],
	getInitialState: function() {
		// Get states from store
		let state = getState();

		// Add in states from props
		state.showExpanded = this.props.showExpanded;

		return state;
	},
	componentDidMount: function() {
		CreateStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		CreateStore.removeChangeListener(this._onChange);
	},
	toggleAction: function() {
		if(this.props.collapsible) {
			this.setState({showExpanded: !this.state.showExpanded});
		}
	},
	createAction: function(event) {
		event.preventDefault();

		// Create if all valid
		if(
			this.state.isEmailValid &&
			this.state.isPasswordValid &&
			this.state.isRepeatPasswordValid
		) {
			console.log('subbmited');
		}
	},
	verifyAction: function() {
		console.log('go to verify');
	},
	render: function() {
		let self = this;
		let inner = [];
		let props = {
			className: 'create'
		};

		// Add class if collapsible
		if(this.props.collapsible) {
			props.className += ' collapsible';
		}

		// Add h2
		inner.push(React.DOM.h2({
			key: 0,
			onClick: this.toggleAction
		}, 'Create an Account'));

		// Create form inner
		let formInner = [];

		// Add email input
		let emailInput;

		emailInput = React.createElement(input, {
			key: 0,
			type: 'email',
			placeholder: 'Email',
			shouldValidate: true,
			isValid: this.state.isEmailValid,
			help: this.state.emailHelp,
			shouldShowHelp: this.state.shouldShowEmailHelp,
			onKeyUpCallback: function(value) {
				Actions.Create.validateField('email', value);
			},
			toggleShowHelpCallback: function() {
				Actions.Create.toggleShowHelp('email');
			}
		});

		formInner.push(emailInput);

		// Add password input
		formInner.push(React.createElement(input, {
			key: 1,
			type: 'password',
			placeholder: 'Password',
			shouldValidate: true,
			isValid: this.state.isPasswordValid,
			help: this.state.passwordHelp,
			shouldShowHelp: this.state.shouldShowPaswordHelp,
			onKeyUpCallback: function(value) {
				Actions.Create.validateField('password', value);
			},
			toggleShowHelpCallback: function() {
				Actions.Create.toggleShowHelp('password');
			}
		}));

		// Add repeat password input
		formInner.push(React.createElement(input, {
			key: 2,
			type: 'password',
			placeholder: 'Repeat Password',
			shouldValidate: true,
			isValid: this.state.isRepeatPasswordValid,
			help: this.state.repeatPasswordHelp,
			shouldShowHelp: this.state.shouldShowRepeatPaswordHelp,
			onKeyUpCallback: function(value) {
				Actions.Create.validateField('repeatPassword', value);
			},
			toggleShowHelpCallback: function() {
				Actions.Create.toggleShowHelp('repeatPassword');
			}
		}));

		formInner.push(React.DOM.input({
			key: 3,
			type: 'submit',
			value: 'Create',
			className: 'button positive medium',
			onClick: this.createAction
		}));

		inner.push(React.DOM.form({key: 1}, formInner));

		inner.push(React.DOM.p({key: 2}, [
			'Need to verify your email address? ',
			React.DOM.a({
				key: 4,
				onClick: this.verifyAction
			}, 'Click here'),
			'.'
		]));

		return React.DOM.div(props, inner);
	},
	_onChange: function() {
		// Get new states from store
		let state = getState();

		// Add in states not controlled by store
		state.showExpanded = this.state.showExpanded;

		this.setState(state);
	}
});