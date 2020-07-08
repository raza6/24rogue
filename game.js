let player = {};
let map = [...new Array(24)].map(v => new Array(24));
let ennemies = new Array(getRandom(4, 8)); 

const availableRooms = [
	[
		{x1: 1, y1: 1, x2: 7, y2: 5},
		{x1: 7, y1: 2, x2: 13, y2: 4},
		{x1: 11, y1: 3, x2: 13, y2: 9},
	],
	[
		{x1: 1, y1: 4, x2: 7, y2: 8},
		{x1: 3, y1: 8, x2: 5, y2: 13},
		{x1: 3, y1: 11, x2: 9, y2: 13},
	],
	[
		{x1: 1, y1: 10, x2: 7, y2: 14},
		{x1: 7, y1: 11, x2: 9, y2: 13}
	],
	[
		{x1: 1, y1: 16, x2: 7, y2: 20},
		{x1: 3, y1: 13, x2: 5, y2: 16},
		{x1: 3, y1: 11, x2: 9, y2: 13},
	],
	[
		{x1: 1, y1: 19, x2: 7, y2: 23},
		{x1: 7, y1: 20, x2: 13, y2: 22},
		{x1: 11, y1: 15, x2: 13, y2: 20},
	],
	[
		{x1: 10, y1: 1, x2: 14, y2: 8},
		{x1: 11, y1: 8, x2: 13, y2: 9}
	],
	[
		{x1: 10, y1: 16, x2: 14, y2: 23},
		{x1: 11, y1: 15, x2: 13, y2: 16}
	],
	[
		{x1: 17, y1: 1, x2: 23, y2: 5},
		{x1: 11, y1: 2, x2: 17, y2: 4},
		{x1: 11, y1: 3, x2: 13, y2: 9},
	],
	[
		{x1: 17, y1: 4, x2: 23, y2: 8},
		{x1: 19, y1: 8, x2: 21, y2: 13},
		{x1: 15, y1: 11, x2: 21, y2: 13},
	],
	[
		{x1: 17, y1: 10, x2: 23, y2: 14},
		{x1: 15, y1: 11, x2: 17, y2: 13}
	],
	[
		{x1: 17, y1: 16, x2: 23, y2: 20},
		{x1: 19, y1: 11, x2: 21, y2: 17},
		{x1: 15, y1: 11, x2: 21, y2: 13},
	],
	[
		{x1: 17, y1: 19, x2: 23, y2: 23},
		{x1: 11, y1: 20, x2: 17, y2: 22},
		{x1: 11, y1: 15, x2: 13, y2: 20},
	],
]

/*
Use seed random
Generate central room
Generate other rooms based on grid algorithm
Add escape stair

Better ennemies generation

Implement fighting + life
Implement loot

Berlin interpretation:
- Permadeath
- mystery item

*/

const CELL = {
	WALL: 1,
	EMPTY: 2,
	ENNEMY: 3,
};

function getRandom(min, max) {
	const rand = Math.floor(Math.random() * (max - min)) + min;
	return rand;
}

function renderGrid(game) {
	for (let i = 0; i < 24; i++) {
		for (let j = 0; j < 24; j++) {
			switch (map[i][j]) {
				case 1:
					game.setDot(i, j, Color.Black);
					break;
				case 2:
					game.setDot(i, j, Color.Gray);
					break;
				case 3:
					game.setDot(i, j, Color.Violet);
					break;
			}
		}
	}
}

function create(game) {
	// Create player
	player = {
		x: 11,
		y: 11,
	};
	// Creating base dungeon with starting room
	for (let i = 0; i < 24; i++) {
		for (let j = 0; j < 24; j++) {
			if (i > 8 && j > 8 && i < 15 && j < 15) {
				map[i][j] = CELL.EMPTY;
			} else {
				map[i][j] = CELL.WALL;
			}
		}
	}
	//Select random room
	const numberOfRoom = getRandom(5, 10);
	let choosedRooms = [...availableRooms];
	for (let i = 0; i < numberOfRoom; i++) {
		choosedRooms.splice(getRandom(0, choosedRooms.length), 1);
	}
	//Add choosen room to the map
	for (let room of choosedRooms) {
		for (let rect of room) {
			const { x1, y1, x2, y2 } = rect;
			for (let i = x1; i < x2; i++) {
				for (let j = y1; j < y2; j++) {
					map[i][j] = CELL.EMPTY;
				}
			}
		}
		
	}
	
	for (let i = 0; i < ennemies.length; i++) {
		ennemies[i] = {
			x: getRandom(2, 21),
			y: getRandom(2, 21),
		}
		//map[ennemies[i].x][ennemies[i].y] = CELL.ENNEMY;
	}
	console.log(map);

	renderGrid(game);
	game.setDot(player.x, player.y, Color.Green);
}

function update(game) {
	renderGrid(game);
	game.setDot(player.x, player.y, Color.Green);
}

function moveTo(x, y) {
	if (map[x][y] === CELL.EMPTY) {
		player.x = x;
		player.y = y;
	}
}

function onKeyPress(direction) {
	let { x, y } = player;
	if (direction == Direction.Up) {
		moveTo(x, y - 1);
	}
	if (direction == Direction.Down) {
		moveTo(x, y + 1);
	}
	if (direction == Direction.Left) {
		moveTo(x - 1, y);
	}
	if (direction == Direction.Right) {
		moveTo(x + 1, y);
	}
}

let config = {
  create: create,
  update: update,
  onKeyPress: onKeyPress,
};

let game = new Game(config);
game.run();