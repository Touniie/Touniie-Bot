const Ability = require('../ability');
const {Party} = require('../enum');
const Gang = require('../gang');
const Role = require('./Role');

module.exports = class Werewolf extends Role {
	constructor(options) {
		super({
			...options,
			...{
				gang: Gang.Werewolf
			}
		});
	}

	async voteBite() {
		if(this.died) return []
		if(this.Sick) {
			this.Sick = false
			await this.sendMessage('Bạn đang còn bị nhiễm bệnh nên đêm nay không thể cắn!');
			return []
		}
		return [await this.request(Ability.Bite)];
	}

	isWin() {
		const werewolfCount = this.world.items.filter(
			player => !player.died && player.party == Party.WEREWOLF
		).length;
		const villagerCount = this.world.items.filter(
			player => !player.died && player.party == Party.VILLAGER
		).length;
		return werewolfCount >= villagerCount;
	}
};
