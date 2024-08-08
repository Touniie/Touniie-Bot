module.exports.version = '2.1.0';
module.exports.ready = 'join';
module.exports.timeout = {
	DELAY_STARTGAME: 10000,
	DISCUSS: 45000,
	Bite: 30000,
	Investigator: 40000,
	Kill: 30000,
	Pair: 40000,
	Protect: 30000,
	RoleReveal: 30000,
	Seer: 30000,
	VoteLynch: 30000
};
module.exports.setups = [
	{
		name: 'Làng sói cổ điển',
		roles: {
			Bodyguard: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 2,
			Werewolf: 2
		}
	},
	{
		name: 'Ngôi làng của những bí mật',
		roles: {
			Bodyguard: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 2,
			Werewolf: 2
		}
	},
	{
		name: 'Ngôi làng của quỷ dữ',
		roles: {
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 2,
			Werewolf: 2,
			Lycan: 1,
			Pacifist: 1
		}
	},
	{
		name: 'Ngôi làng của phù thủy',
		roles: {
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2,
			Lycan: 1,
			Witch: 1
		}
	},
	{
		name: 'Ngôi làng của thần linh',
		roles: {
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2,
			Witch: 1
		}
	},
	{
		name: 'Ngôi làng của sự chết chốc',
		roles: {
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2,
			Witch: 1
		}
	},
	{
		name: 'Ngôi làng bên bờ vũ trụ =)))',
		roles: {
			Cupid: 1,
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2,
			Witch: 1
		}
	},
	{
		name: 'Làng sói thống trị',
		roles: {
			Evilseer: 1,
			Cupid: 1,
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2,
			Witch: 1
		}
	},
	{
		name: 'Ngôi làng thần bí',
		roles: {
			Investigator: 1,
			Apprentice: 1,
			Evilseer: 1,
			Cupid: 1,
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2
		}
	},
	{
		name: 'Ngôi làng tiên tri',
		roles: {
			Tanner: 1,
			Investigator: 1,
			Apprentice: 1,
			Evilseer: 1,
			Cupid: 1,
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2
		}
	},
	{
		name: 'Ngôi làng của sự lưỡng lự',
		roles: {
			Tanner: 1,
			Investigator: 1,
			Apprentice: 1,
			Evilseer: 1,
			Cupid: 1,
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 4,
			Werewolf: 2
		}
	},
	{
		name: 'Ngôi làng của những dối trá',
		roles: {
			Investigator: 1,
			Apprentice: 1,
			Evilseer: 1,
			Cupid: 1,
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 2,
			Werewolf: 2,
			Lycan: 1,
			Fruitbrute: 1,
			Oldman: 1,
			Witch: 1
		}
	},
	{
		name: 'Ngôi làng bị lưu đày',
		roles: {
			Tanner: 1,
			Investigator: 1,
			Apprentice: 1,
			Evilseer: 1,
			Cupid: 1,
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2,
			Lycan: 1,
			Oldman: 1,
			Witch: 1,
			Fruitbrute: 1
		}
	}
];
