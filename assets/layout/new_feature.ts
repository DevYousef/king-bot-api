import { feature_collection, feature_item, Ioptions, Ifeature } from './feature';
import { find_state_data, sleep, get_diff_time } from '../util';
import logger from '../logger';
import { village } from '../gamedata';
import { Ibuilding, Ivillage, Ibuilding_queue, Iresources, Iplayer, Ibuilding_collection } from '../interfaces';
import api from '../api';
import finish_earlier from './finish_earlier';

interface Ioptions_NEW extends Ioptions {
}

class NEW_FEATURE extends feature_collection {
	get_ident(): string {
		return 'NEW_FEATURE';
	}

	get_new_item(options: Ioptions_NEW): NEW {
		return new NEW({ ...options });
	}

	get_default_options(options: Ioptions): Ioptions_NEW {
		return {
			...options
		};
	}
}

class NEW extends feature_item {
	DATA_TYPE0: {
	}

	DATA_TYPE1: { [index: number]: string } = {
	}

	options: Ioptions_NEW;

	set_options(options: Ioptions_NEW): void {
		const { } = options;
		this.options = {
			...this.options
		};
	}

	get_options(): Ioptions_NEW {
		return { ...this.options };
	}

	set_params(): void {
		this.params = {
			ident: 'NEW_FEATURE',
			name: 'NEW FEATURE'
		};
	}

	get_description(): string {
		const { village_name } = this.options;

		if (!village_name) return '-';

		return village_name;
	}

	get_long_description(): string {
		return 'DESCRIPTION OF NEW FEATURE';
	}

	async upgrade_field(): Promise<number> {


		return sleep_time;
	}

	async run(): Promise<void> {
		logger.info(`raise fields: ${this.options.uuid} started`, 'raise fields');

		while (this.options.run) {
			let sleep_time: number = await this.upgrade_field();

			// all fields are raised
			if (!sleep_time) {
				logger.info('finished NEW FEATURE', 'NEW FEATURE');
				break;
			}

			if (sleep_time && sleep_time > ((5 * 60) + 10) && finish_earlier.running) sleep_time = sleep_time - (5 * 60) + 10;

			// set save sleep time
			if (!sleep_time || sleep_time <= 0) sleep_time = 60;
			if (sleep_time > 300) sleep_time = 300;

			await sleep(sleep_time);
		}

		this.running = false;
		this.options.run = false;
		logger.info(`NEW_FEATURE: ${this.options.uuid} stopped`, 'NEW FEATURE');
	}

	able_to_build(building: Ibuilding, village: Ivillage): boolean {
		for (let res in village.storage)
			if (Number(village.storage[res]) < Number(building.upgradeCosts[res])) return false;

		return true;
	}

	lowest_building_by_type(type: number, building_collection: Ibuilding_collection[]): Ibuilding {
		let rv: Ibuilding = null;

		for (let building of building_collection) {
			const bd: Ibuilding = building.data;

			if (bd.buildingType != type) continue;

			if (!rv) {
				rv = bd;
				continue;
			}

			if (Number(bd.lvl) < Number(rv.lvl)) rv = bd;
		}

		return rv;
	}
}

export default new NEW_FEATURE();
