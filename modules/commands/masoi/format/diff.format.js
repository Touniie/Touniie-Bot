module.exports = (player, arr) => {
	const duplicates = arr.filter((item, index) => arr.indexOf(item) != index);
	if (duplicates.length > 0) {
		throw new Error(`Lặp giá trị: ${duplicates.join(', ')}`);
	}
	return arr;
};
