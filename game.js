let player = {};
let map = [...new Array(24)].map(v => new Array(24));
let ennemies = new Array(getRandom(4, 8)); 

/*
Use seed random
Generate central room
Generate other rooms based on grid algorithm
Add escape stair

Better ennemies generation

Implement fighting + life
Implement loot

*/

const CELL = {
	WALL: 1,
	EMPTY: 2,
	ENNEMY: 3,
};

function getRandom(min, max) {
	let rand = Math.floor(Math.random() * (max - min)) + min;
	console.log(rand);
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
	player = {
		x: 11,
		y: 11,
	};
	for (let i = 0; i < 24; i++) {
		for (let j = 0; j < 24; j++) {
			if (i === 0 || j === 0 || i === 23 || j === 23) {
				map[i][j] = CELL.WALL;
			} else {
				map[i][j] = CELL.EMPTY;
			}
		}
	}
	for (let i = 0; i < ennemies.length; i++) {
		ennemies[i] = {
			x: getRandom(2, 21),
			y: getRandom(2, 21),
		}
		map[ennemies[i].x][ennemies[i].y] = CELL.ENNEMY;
	}
	console.log(map);

	renderGrid(game);
	game.setDot(player.x, player.y, Color.Green);
}

function update(game) {
	renderGrid(game);
	game.setDot(player.x, player.y, Color.Green);
}

function onKeyPress(direction) {
  if (direction == Direction.Up && player.y > 1) {
    player.y--;
  }
  if (direction == Direction.Down && player.y < 22) {
    player.y++;
  }
  if (direction == Direction.Left && player.x > 1) {
    player.x--;
  }
  if (direction == Direction.Right && player.x < 22) {
    player.x++;
  }
}

let config = {
  create: create,
  update: update,
  onKeyPress: onKeyPress,
};

let game = new Game(config);
game.run();