function floyd_turtle_n_hare(arr) {
	let turtle = arr[0];
	let hare = arr[0];
	while (true) {
		turtle = arr[turtle];
		hare = arr[arr[hare]];
		if (!hare) return -1;
		if (turtle == hare) break;
	}
	hare = arr[0];
	while (turtle != hare) {
		turtle = arr[turtle];
		hare = arr[hare];
	}
	return turtle;
}

module.exports = (player, arr) => {
	const result = floyd_turtle_n_hare(arr);
	if (result != -1) {
		throw new Error(`Lặp giá trị: ${result}`);
	}
	return arr;
};
