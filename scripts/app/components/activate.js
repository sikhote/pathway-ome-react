import {React, ReactRouter, Velocity, assign} from '../../libs';
import Actions from '../actions';
import Validator from '../utilities/validator';
import Help from '../data/help';
import input from './input';
import CreateStore from '../stores/create';
import TransitionGroup from '../utilities/velocityTransitionGroup.js';

let getState = () => {
	return {
		isWaiting: CreateStore.get(['isWaiting']),
		isEmailValid: CreateStore.get(['fields', 'email', 'isValid']),
		emailHelp: CreateStore.get(['fields', 'email', 'help']),
		showEmailHelp: CreateStore.get(['fields', 'email', 'showHelp']),
		emailValue: CreateStore.get(['fields', 'email', 'value']),
		isPasswordValid: CreateStore.get(['fields', 'password', 'isValid']),
		passwordHelp: CreateStore.get(['fields', 'password', 'help']),
		showPaswordHelp: CreateStore.get(['fields', 'password', 'showHelp']),
		passwordValue: CreateStore.get(['fields', 'password', 'value']),
		isRepeatPasswordValid: CreateStore.get(
			['fields', 'repeatPassword', 'isValid']
		),
		repeatPasswordHelp: CreateStore.get(['fields', 'repeatPassword', 'help']),
		showRepeatPaswordHelp: CreateStore.get(
			['fields', 'repeatPassword', 'showHelp']
		),
		repeatPasswordValue: CreateStore.get(
			['fields', 'repeatPassword', 'value']
		)
	};
};

export default React.createClass({
	displayName: 'Create',
	mixins: [React.addons.PureRenderMixin, React.addons.LinkedStateMixin],
	getInitialState: function() {
		// Set initial form height
		let formHeight;

		if(this.props.showExpanded) {
			formHeight = 'auto';
		} else {
			formHeight = 0;
		}

		return assign({}, getState(), {formHeight});
	},
	componentDidMount: function() {
		CreateStore.addChangeListener(this._onChange);

		// Get form's expanded height, reset
		let form = this.getDOMNode().getElementsByTagName('form')[0];
		form.style.height = 'auto';
		let formHeight = form.offsetHeight;
		form.style.height = this.state.formHeight;

		// Save, causing a needless render
		this.setState({formHeight: formHeight});
	},
	componentWillUnmount: function() {
		CreateStore.removeChangeListener(this._onChange);
	},
	componentDidUpdate: function() {
		// Get form node
		let create = this.getDOMNode();
		let form = create.getElementsByTagName('form')[0];

		// Animate height after update
		if(this.props.showExpanded) {
			Velocity(form, {height: this.state.formHeight}, {
				duration: 100,
				easing: 'linear',
				complete: () => {
					form.style.overflow = 'visible';
				}
			});
		} else {
			form.style.overflow = 'hidden';
			Velocity(form, {height: 0}, {
				duration: 100,
				easing: 'linear'
			});
		}
	},
	submitAction: function(event) {
		event.preventDefault();

		// Submit if all valid
		if(
			this.state.isEmailValid &&
			this.state.isPasswordValid &&
			this.state.isRepeatPasswordValid
		) {
			Actions.Create.submit();
		} else {
			Actions.Create.validateAll();
		}
	},
	render: function() {
		let inner = [];
		let props = {
			className: 'create'
		};

		// Add class if collapsible for hover effects and pointer
		if(this.props.collapsible) {
			props.className += ' collapsible';
		}

		// Add h2
		inner.push(React.DOM.h2({
			key: 0,
			onClick: () => {
				Actions.Create.hideAllHelp();
				Actions.Start.toggleShowExpanded('create');
			},
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
			value: this.state.emailValue,
			showHelp: this.state.showEmailHelp,
			onChangeCallback: event => {
				Actions.Create.onFieldChange('email', event.target.value);
			},
			toggleShowHelpCallback: () => {
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
			showHelp: this.state.showPaswordHelp,
			onChangeCallback: event => {
				Actions.Create.onFieldChange('password', event.target.value);
			},
			toggleShowHelpCallback: () => {
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
			showHelp: this.state.showRepeatPaswordHelp,
			onChangeCallback: event => {
				Actions.Create.onFieldChange('repeatPassword', event.target.value);
			},
			toggleShowHelpCallback: () => {
				Actions.Create.toggleShowHelp('repeatPassword');
			}
		}));

		formInner.push(React.DOM.input({
			key: 3,
			type: 'submit',
			value: 'Create',
			className: 'button positive medium',
			onClick: this.submitAction
		}));

		if(this.state.isWaiting) {
			formInner.push(React.DOM.div({
				key: 4,
				className: 'waiting'
			}));
		}

		// Add form
		inner.push(React.DOM.form({key: 1}, formInner));

		// Add link for verifying email
		inner.push(React.DOM.p({key: 2}, [
			'Need to verify your email address? ',
			React.createElement(ReactRouter.Link,
				{key: 1, to: "verify"}, "Click here"
			),
			'.'
		]));

		return React.DOM.div(props, inner);
	},
	_onChange: function() {
		this.setState(getState());
	}
});