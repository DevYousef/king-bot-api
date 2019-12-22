import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import classNames from 'classnames';


export default class Manager extends Component {
	state = {
		name: 'account manager',
		type: 0,
		error_input: false
	}

	componentWillMount() {
		this.setState({
			...this.props.feature
		});
	}

	submit = async (e) => {
		this.setState({ error_input: false });

		if (this.state.error_input) return;

		this.props.submit({ ...this.state });
	}

	render() {
		const { name, type } = this.state;
		const input_class = classNames({
			input: true,
			'is-danger': this.state.error_input
		});

		return (
			<div>
				<div className="columns">

					<div className="column">

						<div class="field">
							<label class="label">Managerial instructions:</label>
							<div class="control">
									<p>Some options will show up here</p>
							</div>
						</div>

					</div>

					<div className="column">
						<label class="label">Account information</label>
						<div class="field has-addons">
							<p class="control">
								<a class="button is-static">
									min
								</a>
							</p>
							<div class="control">
							<p>Some more input here</p>
							</div>
							<p class="control">
								<a class="button is-static">
									%
								</a>
							</p>
						</div>
						<p class="help">some helpful text here</p>
					</div>

				</div>

				<div className="columns">
					<div className="column">
						<button className="button is-success" onClick={ this.submit } style='margin-right: 1rem'>
							submit
						</button>
						<button className="button" onClick={ (e) => route('/', true) }>
							cancel
						</button>
					</div>
					<div className="column">
					</div>
				</div>

			</div>
		);
	}
}
