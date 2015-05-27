import {React} from '../../libs';
import Actions from '../actions';

module.exports = React.createClass({
	displayName: 'Login',
	mixins: [React.addons.PureRenderMixin, React.addons.LinkedStateMixin],
	getInitialState: function() {
		// Set initial form height
		let height;

		if(this.props.showExpanded) {
			height = 'auto';
		} else {
			height = 0;
		}

		return {
			formHeight: height,
			showExpanded: this.props.showExpanded,
			email: this.props.email,
			password: ''
		};
	},
	toggleAction: function() {
		if(this.props.collapsible) {
			this.setState({showExpanded: !this.state.showExpanded});
		}
	},
	submitAction: function(event) {
		event.preventDefault();

		// Authenticate a user
		Auth.login(this.state.user, this.state.password).catch(function(error) {
			console.log('Error logging in', error);
		});
	},
	resetAction: function() {
		Actions.showPasswordReset();
	},
	componentDidMount: function() {
		// Get form's expanded height, reset
		let form = this.getDOMNode().getElementsByTagName('form')[0];
		form.style.height = 'auto';
		let formHeight = form.offsetHeight;
		form.style.height = this.state.formHeight;

		// Save, causing a needless render
		this.setState({formHeight: formHeight});
	},
	componentDidUpdate: function() {
		// Get form node
		let form = this.getDOMNode().getElementsByTagName('form')[0];

		// Animate height after update
		if(this.state.showExpanded) {
			TweenMax.to(form, 0.1, {height: this.state.formHeight});
		} else {
			TweenMax.to(form, 0.1, {height: 0});
		}
	},
	render: function() {
		let inner = [];
		let props = {
			className: 'login'
		};

		// Add class if collapsible
		if(this.props.collapsible) {
			props.className += ' collapsible';
		}

		// Add h2
		inner.push(React.DOM.h2({
			key: 0,
			onClick: this.toggleAction
		}, 'Log In to an Account'));

		// Add form
		inner.push(React.DOM.form({key: 1,}, [
			React.DOM.input({
				key: 0,
				type: 'email',
				placeholder: 'Email',
				valueLink: this.linkState('email')
			}),
			React.DOM.input({
				key: 1,
				type: 'password',
				placeholder: 'Password',
				valueLink: this.linkState('password')
			}),
			React.DOM.input({
				key: 2,
				type: 'submit',
				value: 'Login',
				className: 'button neutral medium',
				onClick: this.submitAction
			}),
			React.DOM.p({key: 3}, [
				'Need your password reset? ',
				React.DOM.a({
					key: 4,
					onClick: this.resetAction
				}, 'Click here'),
				'.'
			])
		]));

		// Add link to /email-verification
		inner.push();

		return React.DOM.div(props, inner);
	}
});