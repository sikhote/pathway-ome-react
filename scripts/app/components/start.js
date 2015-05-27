import {React, TweenMax} from '../../libs';
import logo from './logo';
import register from './register';
import login from './login';
import footer from './footer';

module.exports = React.createClass({
	displayName: 'Start',
	mixins: [React.addons.PureRenderMixin],
	render: function() {
		let inner = [];
		let props = {
			className: 'start view'
		};

		// Add h1 and logo
		inner.push(React.DOM.h1({key: 0}, React.createElement(logo, {key: 0})));

		// Add register component
		inner.push(React.createElement(register, {
			key: 1,
			showExpanded: !this.props.isPreviousUser,
			collapsible: true
		}));

		// Add login component
		inner.push(React.createElement(login, {
			key: 2,
			showExpanded: this.props.isPreviousUser,
			collapsible: true
		}));

		// Add footer
		inner.push(React.createElement(footer, {key: 3}));

		return React.DOM.div(props, inner);
	},
	_onChange: function() {
		this.setState(getState());
	}
});