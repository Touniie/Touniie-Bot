const Werewolf = require('./Werewolf');
const Villager = require('./Villager');

module.exports = class Lycan extends Villager {
	constructor(options) {
		super({
			...options,
			...{
				role: Werewolf
			}
		});
	}
};
