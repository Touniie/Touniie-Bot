const fs = require('fs');
const path = require('path');
const axios = require('axios');
const deepExtend = require('deep-extend');
const {Data} = require('./constant');
const {Party} = require('./enum');
const random = (start, end) => {
	return Math.floor(Math.random() * (end - start + 1) + start);
};

const exampleConfig = require('./gameConfig.example');
const exampleConfigPath = path.join(__dirname, 'gameConfig.example.js');
const configPath = path.join(process.cwd() + '/werewolfConfig.js');
let gameConfig;
if (!fs.existsSync(configPath)) {
	fs.writeFileSync(configPath, fs.readFileSync(exampleConfigPath));
	gameConfig = require(configPath);
} else {
	gameConfig = {...exampleConfig, ...require(configPath)};
}

const symbols = {
	0: '0',
	1: '1',
	2: '2',
	3: '3',
	4: '4',
	5: '5',
	6: '6',
	7: '7',
	8: '8',
	9: '9'
};

for (let i = 10; i <= 1000; i++) {
	let number = i;
	symbols[i] = '';
	while (number > 0) {
		symbols[i] = symbols[number % 10] + symbols[i];
		number = Math.floor(number / 10);
	}
}

const randomItem = arr => {
	return arr[random(0, arr.length - 1)];
};

const dataSetup = setup => {
	const roles = [];
	for (let role in setup.roles) {
		roles.push(...new Array(setup.roles[role]).fill(role));
	}
	return {
		name: setup.name,
		roles,
		org: setup
	};
};

const vietsub = (role) => {
	role = role.toLowerCase();
	role = role.replace('villager', 'Dân làng')
					.replace('werewolf', 'Ma sói')
					.replace('mayor', 'Thị trưởng')
					.replace('diseased', 'Người bệnh')
					.replace('apprentice', 'Tiên tri tập sự')
					.replace('minion', 'Kẻ phản bội')
					.replace('bodyguard', 'Bảo vệ')
					.replace('cupid', 'Thần tình yêu')
					.replace('evilseer', 'Evilseer')
					.replace('fruitbrute', 'Sói ăn chay')
					.replace('goodseer', 'Tiên tri')
					.replace('hunter', 'Thợ săn')
					.replace('investigator', 'Thám tử')
					.replace('lycan', 'Người sói')
					.replace('oldman', 'Ông già')
					.replace('tanner', 'Chán đời')
					.replace('witch', 'Phù thủy')
					.replace('neutral', 'Trung lập')
					.replace('pacifist', 'Người hòa bình')
	return role.toUpperCase();
}

const guide = role => {
	const { createReadStream } = require('fs-extra')
	const roleName = role.constructor.name;
	const {party, description, advice, image} = Data[roleName];
	let partyName;
	for (partyName in Party) if (party == Party[partyName]) break;
	return (
		{
			body: 
				`BẠN LÀ ${vietsub(roleName)}\n` +
				`Phe: ${partyName} (vẫn có thể bị đổi)\n` +
				`Mô tả: ${description}\n` +
				`Lời khuyên: ${advice}`,
			attachment: createReadStream(image)
		}
	);
};

module.exports = {
	gameConfig,
	symbols,
	randomItem,
	dataSetup,
	guide,
	vietsub
};
