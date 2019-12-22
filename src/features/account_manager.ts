import { Ihero, Iplayer } from '../interfaces';
import { feature_single, Ioptions, Ifeature, Iresponse } from './feature';
import { log, find_state_data, get_diff_time, sleep } from '../util';
import api from '../api';
import { player } from '../gamedata';
import database from '../database';
import uniqid from 'uniqid';

interface Ioptions_manager extends Ioptions {
	type: number
}

class account_manager extends feature_single {
	// idents for state data
	account_manager_ident: string = 'Manager:';

	options: Ioptions_manager;

	set_default_options(): void {
		this.options = {
			uuid: uniqid.time(),
			run: false,
			error: false,
			type: 0
		};
	}

	set_params(): void {
		this.params = {
			ident: 'manager',
			name: 'account manager'
		};
	}

	get_long_description(): string {
		return 'this feature manages your account by automating village management and raid attacks';
	}

	set_options(options: Ioptions_manager): void {
		const { run, error, type, uuid } = options;
		this.options = {
			...this.options,
			uuid,
			type,
			run,
			error
		};
	}

	get_options(): Ioptions {
		return { ...this.options };
	}

	get_description(): string {
		return 'manager';
	}

	update(options: Ioptions_manager): Iresponse {
		this.options = {
			...this.options,
			type: options.type
		};

		return {
			error: false,
			data: null,
			message: 'success'
		};
	}

	async run(): Promise<void> {
		this.manage_account(this.options.type);
	}

	async manage_account(type: number): Promise<void> {
		log('account manager started');

		// write data to database
		this.options.type = type;
		this.options.run = true;

		database.set('manager.options', this.options).write();

		const player_data: Iplayer = await player.get();

		while (this.options.run) {
			const { type } = this.options;

				// get hero data
			// const response: any[] = await api.get_cache([ this.account_manager_ident + player_data.playerId]);
			// const manager: Imanager = find_state_data(this.account_manager_ident + player_data.playerId, response);

			// const diff_time: number = get_diff_time(hero.untilTime);
			// let sleep_time: number = 60;
			//
			// if (diff_time > 0) sleep_time = diff_time + 5;
			// if (sleep_time <= 0) sleep_time = 300;
			// if (sleep_time > 500) sleep_time = 500;
			console.log("Account manager running!");

			await sleep(10);//sleep_time);
		}

		this.running = false;
		this.options.run = false;
		log('account manager stopped');
	}
}

export default new account_manager();
