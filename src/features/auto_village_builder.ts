import { feature_collection, feature_item, Ioptions, Ifeature } from './feature';
import { find_state_data, sleep, get_diff_time } from '../util';
import logger from '../logger';
import { village } from '../gamedata';
import { Ibuilding, Ivillage, Ibuilding_queue, Iresources, Iplayer, Ibuilding_collection } from '../interfaces';
import api from '../api';
import finish_earlier from './finish_earlier';

interface Ioptions_auto_village_builder extends Ioptions {
	village_name: string
	village_id: number
}

class auto_village_builder extends feature_collection {
	get_ident(): string {
		return 'auto_village_builder';
	}

	get_new_item(options: Ioptions_auto_village_builder): auto_village {
		return new auto_village({ ...options });
	}

	get_default_options(options: Ioptions): Ioptions_auto_village_builder {
		return {
			...options,
			village_name: '',
			village_id: 0
		};
	}
}

class auto_village extends feature_item {

	options: Ioptions_auto_village_builder;

	set_options(options: Ioptions_auto_village_builder): void {
		const { uuid, run, error, village_name, village_id} = options;
		this.options = {
			...this.options,
			uuid,
			run,
			error,
			village_name,
			village_id
		};
	}

	get_options(): Ioptions_auto_village_builder {
		return { ...this.options };
	}

	set_params(): void {
		this.params = {
			ident: 'auto_village_builder',
			name: 'auto village builder'
		};
	}

	get_description(): string {
		const { village_name } = this.options;

		if (!village_name) return '-';

		return village_name;
	}

	get_long_description(): string {
		return 'this feature will build the bare necessacities required for a village (main building, warehouse, granary, resource fields, marketplace, residence, wall and rally point).';
	}

	analyse_village_age(building_data: any, building_id_array: any[]): any[] {
		let village_status: any[] = [];

		//Find data about storage setup
		//village_status[0] is warehouse storage
		//village_status[1] is granary storage
		//village_status[0/1][0] specifies how many buildings of the respective type exist in current village
		//village_status[0/1][1] specifies the hight level of the respective building

		let wh_data = building_data.filter((x: any) => x.buildingType == 10);
		let gr_data = building_data.filter((x: any) => x.buildingType == 11);
		village_status.push([wh_data.length, wh_data.map((x: any) => x.lvl)]);
		village_status.push([gr_data.length, gr_data.map((x: any) => x.lvl)]);

		for(let i: number = 2; i < building_id_array.length+2; i++){
			let curr_building = building_data.find((x: any) => x.buildingType == building_id_array[i-2]);
			village_status.push(curr_building.lvl);
		}
		return village_status;
	}

	async get_village_data(): Promise<number> {

		console.log("Printing form data...");
		console.log(this.options.village_name);

		const params = [
			village.own_villages_ident,
		];

		const response = await api.get_cache(params);
		const village_data: Ivillage = village.find(this.options.village_id, response);
		let building_data = await village.find_buildings(this.options.village_id);

		console.log(this.analyse_village_age(building_data, [15, 17, 11]));

		return 30;
	}

	async run(): Promise<void> {
		logger.info(`auto_village_builder: ${this.options.uuid} started`, 'auto village builder');

		while (this.options.run) {
			let sleep_time: number = await this.get_village_data();

			// all fields are raised
			if (!sleep_time) {
				logger.info('finished auto_village_builder', 'auto village builder');
				break;
			}

			// if (sleep_time && sleep_time > ((5 * 60) + 10) ) sleep_time = sleep_time - (5 * 60) + 10;
			//
			// // set save sleep time
			// if (!sleep_time || sleep_time <= 0) sleep_time = 60;
			// if (sleep_time > 300) sleep_time = 300;

			await sleep(sleep_time);
		}

		this.running = false;
		this.options.run = false;
		logger.info(`auto_village_builder: ${this.options.uuid} stopped`, 'auto village builder');
	}

	able_to_build(building: Ibuilding, village: Ivillage): boolean {
		for (let res in village.storage)
			if (Number(village.storage[res]) < Number(building.upgradeCosts[res])) return false;

		return true;
	}
}

export default new auto_village_builder();
