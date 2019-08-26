import { log, find_state_data } from '../util';
import { Ivillage, Ibuilding } from '../interfaces';
import api from '../api';

class village {
	village_ident: string = 'Collection:Village:'
	own_villages_ident: string = this.village_ident + 'own';

	building_collection_ident: string = 'Collection:Building:';
	building_ident: string = 'Building:';
	building_queue_ident: string = 'BuildingQueue:';

	find(id: number, data: any): Ivillage {
		const villages = find_state_data(this.own_villages_ident, data);

		const village = villages.find((x: any) => x.data.villageId == id);

		if (!village) {
			log(`couldn't find village with ID: ${id} !`);
			return null;
		}

		return village.data;
	}

	async get_own(): Promise<any> {
		return await api.get_cache([this.own_villages_ident]);
	}

	async find_buildings(village_id: number): Promise<any> {

		const queue_ident: string = this.building_collection_ident + village_id;

		const response: any[] = await api.get_cache([queue_ident]);

		const rv = [];
		const data = find_state_data(queue_ident, response);

		for (let bd of data) {
			const build: Ibuilding = bd.data;

			if (Number(build.buildingType) != 0)
				if (Number(build.lvl) > 0)
					rv.push(build);
		}

		return rv;
	}
}


export default new village();
