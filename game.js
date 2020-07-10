let rng = new Math.seedrandom();
let player = {};
let map = [...new Array(24)].map(v => new Array(24));
let enemies;
let currentEnemy;
let gameRun = true;
let seedInput;

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
- Use seed random -> need to reinit all variables when restart pressed
- Generate central room
- Generate other rooms based on grid algorithm

- Better enemies generation
- Enemies AI
Kill all enemies -> make escape stair appears


- Implement fighting + life
Implement loot

Berlin interpretation:
- Permadeath
- mystery item

*/

function restart() {
	rng = new Math.seedrandom(seedInput.value);
	create(game);
	gameRun = true;
}

const CELL = {
	WALL: 1,
	EMPTY: 2,
	ENEMY_1: 3,
	ENEMY_2: 4,
};

function getRandom(min, max) {
	return Math.floor(rng() * (max - min)) + min;
}

// Draw the map on the grid
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
				case 4:
					game.setDot(i, j, Color.Indigo);
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
		hp: 5,
		weapon: {
			name: 'stick',
			damageMin: 1,
			damageMax: 3,
		}
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
	// Select random room
	const numberOfRoom = getRandom(5, 10);
	let choosedRooms = [...availableRooms];
	for (let i = 0; i < numberOfRoom; i++) {
		choosedRooms.splice(getRandom(0, choosedRooms.length), 1);
	}
	// Add choosen room to the map
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
	// Create enemies
	console.table(choosedRooms);
	enemies = new Array(getRandom(4, 10));
	for (let i = 0; i < enemies.length; i++) {
		const enemiesRoom = {...choosedRooms[getRandom(0, choosedRooms.length)][0]};
		const enemyType = getRandom(0, 100) > 25 ? CELL.ENEMY_1 : CELL.ENEMY_2;
		enemies[i] = {
			x: getRandom(enemiesRoom.x1, enemiesRoom.x2),
			y: getRandom(enemiesRoom.y1, enemiesRoom.y2),
			type: enemyType,
			turn: 0,
			hp: enemyType === CELL.ENEMY_1 ? 8 : 12,
			damageMax: enemyType === CELL.ENEMY_1 ? 2 : 4,
			damageMin: enemyType === CELL.ENEMY_1 ? 1 : 2,
		}
		map[enemies[i].x][enemies[i].y] = enemies[i].type;
	}
	console.log(map);

	renderText();
	renderGrid(game);
	game.setDot(player.x, player.y, Color.Green);
}

function renderText() {
	const php = `Player HP: ${player.hp}`;
	let ehp = '';
	if (currentEnemy) {
		ehp = `Enemy HP: ${currentEnemy.hp}`;
	}
	game.setText(`${php}       ${ehp}`);
}

function update(game) {
	renderGrid(game);
	game.setDot(player.x, player.y, Color.Green);
}


function moveTowards(sourcex, sourcey, targetx, targety) {
	dirx = targetx - sourcex;
	diry = targety - sourcey;
	let dx, dy;
	if (Math.abs(dirx) > Math.abs(diry)) {
		dx = sourcex + Math.sign(dirx);
		dy = sourcey;
		if (map[dx][dy] !== CELL.EMPTY) { // Don't get stuck in corner
			dx = sourcex;
			dy = sourcey + Math.sign(diry);
		}
	} else {
		dx = sourcex;
		dy = sourcey + Math.sign(diry);
		if (map[dx][dy] !== CELL.EMPTY) { // Don't get stuck in corner
			dx = sourcex + Math.sign(dirx);
			dy = sourcey;
		}
	}
	return {dx, dy};
}

// Handle player actions + AI
function playerAct(x, y) {
	if (map[x][y] === CELL.EMPTY) {
		player.x = x;
		player.y = y;
		currentEnemy = undefined;
	} else if (map[x][y] === CELL.ENEMY_1 || map[x][y] === CELL.ENEMY_2) { // Attack by player
		currentEnemy = enemies.find(en => en.x === x && en.y === y);
		currentEnemy.hp -= getRandom(player.weapon.damageMin, player.weapon.damageMax);
		if (currentEnemy.hp <= 0) {
			enemies.splice(enemies.indexOf(currentEnemy), 1);
			map[currentEnemy.x][currentEnemy.y] = CELL.EMPTY;
			currentEnemy = undefined;
			renderText;
		}
	}
	
	for (let en of enemies) { // Enemies AI
		px = player.x;
		py = player.y;
		const { x: ex, y: ey } = en;
		const dist = Math.abs(px - ex) + Math.abs(py - ey);
		if(en.type === CELL.ENEMY_1) {
			if(dist < 4) {
				if (en.turn % 2 === 0) {
					if (dist === 1) {
						player.hp -= getRandom(en.damageMin, en.damageMax);
					} else {
						const {dx, dy} = moveTowards(ex, ey, px, py);
						if (map[dx][dy] === CELL.EMPTY) {
							en.x = dx;
							en.y = dy;
							map[en.x][en.y] = CELL.ENEMY_1;
							map[ex][ey] = CELL.EMPTY;
						}
					}
				}
				en.turn++;
			}
		} else {
			if(dist < 10) {
				if (en.turn % 3 !== 0) {
					const dir = getRandom(0,4);
					let dx, dy;
					switch (dir) {
						case 0:
							dx = en.x;
							dy = en.y - 1;
							break;
						case 1:
							dx = en.x + 1;
							dy = en.y;
							break;
						case 2:
							dx = en.x;
							dy = en.y + 1;
							break;
						case 3:
							dx = en.x - 1;
							dy = en.y;
							break;
					}
					if (player.x === dx && player.y === dy) {
						player.hp -= getRandom(en.damageMin, en.damageMax);
					} else if (map[dx][dy] === CELL.EMPTY) {
						en.x = dx;
						en.y = dy;
						map[en.x][en.y] = CELL.ENEMY_2;
						map[ex][ey] = CELL.EMPTY;
					}
				}
				en.turn++;
			}
		}
	}
	
	renderText();
	
	if (player.hp <= 0) {
		game.setText('You lose, too bad');
		gameRun = false;
	}
}

function onKeyPress(direction) {
	if (gameRun) {
		let { x, y } = player;
		if (direction == Direction.Up) {
			playerAct(x, y - 1);
		}
		if (direction == Direction.Down) {
			playerAct(x, y + 1);
		}
		if (direction == Direction.Left) {
			playerAct(x - 1, y);
		}
		if (direction == Direction.Right) {
			playerAct(x + 1, y);
		}
	}
}

let config = {
  create: create,
  update: update,
  onKeyPress: onKeyPress,
};

let game = new Game(config);
game.run();

window.onload = () => {
	document.getElementById('restartGame').addEventListener('click', restart);
	seedInput = document.getElementById('seedInput');
};

