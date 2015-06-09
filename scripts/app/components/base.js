import {assign, React, ReactPureRender} from '../../libs';

let base = {
	shouldComponentUpdate(nextProps, nextState) {
		if(this.context.router) {
			const changed =
				this.pureComponentLastPath !==
				this.context.router.getCurrentPath()
			;

			this.pureComponentLastPath = this.context.router.getCurrentPath();

			if(changed) {
				return true;
			}
		}

		const shouldUpdate =
			!ReactPureRender.shallowEqual(this.props, nextProps) ||
			!ReactPureRender.shallowEqual(this.state, nextState);

		return shouldUpdate;
	},
	contextTypes: {
	  router: React.PropTypes.func
	}
};

export default base;