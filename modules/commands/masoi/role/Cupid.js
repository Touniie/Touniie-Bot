const Ability = require('../ability');
const Villager = require('./Villager');

module.exports = class Cupid extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
		this.called = false;
		this.pairs = [];
	}

	async onNight() {
		if (!this.called) {
			const response = await this.request(Ability.Pair);
			if (response.value != null) this.called = true;
			return [response];
		}
		return [];
	}
};
