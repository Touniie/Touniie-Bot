const {DeathType} = require('../enum');

module.exports = class Death {
	constructor(killer, victim, type = DeathType.P2P) {
		this.killer = killer; // if type == DeathType.LYNCH then killer will be array vote chart
		this.victim = victim;
		this.index = victim.index;
		this.type = type;
	}
};
