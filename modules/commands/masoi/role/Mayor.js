const Villager = require('./Villager');

module.exports = class Mayor extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
	}
};
