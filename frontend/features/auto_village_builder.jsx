import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import classNames from 'classnames';
import axios from 'axios';
import Input from '../components/input';

export default class AutoVillageBuilder extends Component {
	state = {
		name: 'auto village builder',
		all_villages: [],
		village_name: '',
		village_id: 0,
		error_village: false
	}

	componentWillMount() {
		this.setState({
			...this.props.feature
		});

		axios.get('/api/data?ident=villages').then(res => this.setState({ all_villages: res.data }));
	}

	submit = async (e) => {
		this.setState({ error_village: (this.state.village_id == 0) });

		if (this.state.error_village) return;

		const { ident, uuid, village_name, village_id } = this.state;
		this.props.submit({ ident, uuid, village_name, village_id });
	}

	delete = async e => {
		const { ident, uuid, village_name, village_id } = this.state;
		this.props.delete({ ident, uuid, village_name, village_id });
	}

	cancel = async e => {
		route('/');
	}

	render() {
		const { all_villages, village_name, village_id, error_village } = this.state;

		const village_select_class = classNames({
			select: true,
			'is-radiusless': true,
			'is-danger': error_village
		});

		const villages = all_villages.map(village => <option value={ village.data.villageId } village_name={ village.data.name } >({village.data.coordinates.x}|{village.data.coordinates.y}) {village.data.name}</option>);

		return (
			<div>
				<div className="columns">
					<div className="column">
						<div class="field">
							<label class="label">select village</label>
							<div class="control">
								<div class={ village_select_class }>
									<select
										class="is-radiusless"
										value={ village_id }
										onChange={ (e) => this.setState({
											village_name: e.target[e.target.selectedIndex].attributes.village_name.value,
											village_id: e.target.value
										})
										}
									>
										{ villages }
									</select>
								</div>
							</div>
						</div>
					</div>

				</div>

				<div className="columns">
					<div className="column">
						<button className="button is-success is-radiusless" onClick={ this.submit } style='margin-right: 1rem'>
							submit
						</button>
						<button className="button is-radiusless" onClick={ this.cancel } style='margin-right: 1rem'>
							cancel
						</button>

						<button className="button is-danger is-radiusless" onClick={ this.delete }>
							delete
						</button>
					</div>
					<div className="column">
					</div>
				</div>

			</div>
		);
	}
}
