// Game engine 24a2 by James Routley
// seedrandom by David Bau

let rng = new Math.seedrandom();
let rngGen = new Math.seedrandom();
let player;
const map = [...new Array(24)].map(() => new Array(24));
let enemies;
let currentEnemy;
let items;
let gameRun = true;
let seedInput;
let gameText;
let currentLvl;
const weaponList = ['stick', 'knife', 'sword', 'broadsword', 'battle-axe', 'staff of wrath', 'ak-47'];
let currentWeapon = 0;

const CELL = {
  PLAYER: 0,
  WALL: 1,
  EMPTY: 2,
  ENEMY_1: 3,
  ENEMY_2: 4,
  STAIRS: 5,
  ITEM_1: 6,
  ITEM_2: 7,
};

const ITEM = {
  HPUP: 0,
  REGEN: 1,
  WEAPON: 2,
  POTION: 3,
};

const POTION = {
  INVINCIBILITY: 0,
  INVISIBILITY: 1,
  STRENGTH: 2,
};

const availableRooms = [
  [
    {
      x1: 1, y1: 1, x2: 7, y2: 5,
    },
    {
      x1: 7, y1: 2, x2: 13, y2: 4,
    },
    {
      x1: 11, y1: 3, x2: 13, y2: 9,
    },
  ],
  [
    {
      x1: 1, y1: 4, x2: 7, y2: 8,
    },
    {
      x1: 3, y1: 8, x2: 5, y2: 13,
    },
    {
      x1: 3, y1: 11, x2: 9, y2: 13,
    },
  ],
  [
    {
      x1: 1, y1: 10, x2: 7, y2: 14,
    },
    {
      x1: 7, y1: 11, x2: 9, y2: 13,
    },
  ],
  [
    {
      x1: 1, y1: 16, x2: 7, y2: 20,
    },
    {
      x1: 3, y1: 13, x2: 5, y2: 16,
    },
    {
      x1: 3, y1: 11, x2: 9, y2: 13,
    },
  ],
  [
    {
      x1: 1, y1: 19, x2: 7, y2: 23,
    },
    {
      x1: 7, y1: 20, x2: 13, y2: 22,
    },
    {
      x1: 11, y1: 15, x2: 13, y2: 20,
    },
  ],
  [
    {
      x1: 10, y1: 1, x2: 14, y2: 8,
    },
    {
      x1: 11, y1: 8, x2: 13, y2: 9,
    },
  ],
  [
    {
      x1: 10, y1: 16, x2: 14, y2: 23,
    },
    {
      x1: 11, y1: 15, x2: 13, y2: 16,
    },
  ],
  [
    {
      x1: 17, y1: 1, x2: 23, y2: 5,
    },
    {
      x1: 11, y1: 2, x2: 17, y2: 4,
    },
    {
      x1: 11, y1: 3, x2: 13, y2: 9,
    },
  ],
  [
    {
      x1: 17, y1: 4, x2: 23, y2: 8,
    },
    {
      x1: 19, y1: 8, x2: 21, y2: 13,
    },
    {
      x1: 15, y1: 11, x2: 21, y2: 13,
    },
  ],
  [
    {
      x1: 17, y1: 10, x2: 23, y2: 14,
    },
    {
      x1: 15, y1: 11, x2: 17, y2: 13,
    },
  ],
  [
    {
      x1: 17, y1: 16, x2: 23, y2: 20,
    },
    {
      x1: 19, y1: 11, x2: 21, y2: 17,
    },
    {
      x1: 15, y1: 11, x2: 21, y2: 13,
    },
  ],
  [
    {
      x1: 17, y1: 19, x2: 23, y2: 23,
    },
    {
      x1: 11, y1: 20, x2: 17, y2: 22,
    },
    {
      x1: 11, y1: 15, x2: 13, y2: 20,
    },
  ],
];

function getRandom(min, max, randGen = rng) {
  return Math.floor(randGen() * (max - min)) + min;
}

// Draw the map on the grid
function renderGrid(game) {
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 24; j++) {
      switch (map[i][j]) {
        case CELL.PLAYER:
          game.setDot(i, j, Color.Green);
          break;
        case CELL.WALL:
          game.setDot(i, j, Color.Black);
          break;
        case CELL.EMPTY:
          game.setDot(i, j, Color.Gray);
          break;
        case CELL.ENEMY_1:
          game.setDot(i, j, Color.Violet);
          break;
        case CELL.ENEMY_2:
          game.setDot(i, j, Color.Indigo);
          break;
        case CELL.STAIRS:
          game.setDot(i, j, Color.Red);
          break;
        case CELL.ITEM_1:
          game.setDot(i, j, Color.Yellow);
          break;
        case CELL.ITEM_2:
          game.setDot(i, j, Color.Orange);
          break;
      }
    }
  }
}

function init() {
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
  const numberOfRoom = getRandom(6, 11, rngGen) - currentLvl;
  const chosenRooms = [...availableRooms];
  for (let i = 0; i < numberOfRoom; i++) {
    chosenRooms.splice(getRandom(0, chosenRooms.length, rngGen), 1);
  }
  // Add choosen room to the map
  let availableCells = [];
  for (const room of chosenRooms) {
    let mainRoom = true;
    for (const rect of room) {
      const {
        x1, y1, x2, y2,
      } = rect;
      for (let i = x1; i < x2; i++) {
        for (let j = y1; j < y2; j++) {
          if (mainRoom) {
            availableCells.push({
              x: i,
              y: j,
            });
          }
          map[i][j] = CELL.EMPTY;
        }
      }
      mainRoom = false;
    }
  }
  // Deduplicate to obtain usable cells
  availableCells = availableCells.filter((cell, idx, arr) => idx === arr.findIndex((c) => (
    c.x === cell.x && c.y === cell.y
  )));
  // Create enemies
  enemies = new Array(getRandom(3, 5 + currentLvl ** 2, rngGen) + currentLvl);
  for (let i = 0; i < enemies.length; i++) {
    const [chosenCell] = availableCells.splice(getRandom(0, availableCells.length, rngGen), 1);
    const enemyType = getRandom(0, 100, rngGen) > 25 ? CELL.ENEMY_1 : CELL.ENEMY_2;
    enemies[i] = {
      x: chosenCell.x,
      y: chosenCell.y,
      type: enemyType,
      turn: 0,
      hp: (enemyType === CELL.ENEMY_1 ? 8 : 12) + currentLvl ** 2,
      damageMax: (enemyType === CELL.ENEMY_1 ? 1 : 3) + currentLvl,
      damageMin: (enemyType === CELL.ENEMY_1 ? 0 : 1) + currentLvl,
    };
    map[enemies[i].x][enemies[i].y] = enemies[i].type;
  }
  // Create items
  items = new Array(getRandom(4, 10, rngGen) + currentLvl);
  for (let i = 0; i < items.length; i++) {
    const [chosenCell] = availableCells.splice(getRandom(0, availableCells.length, rngGen), 1);
    const itemType = getRandom(0, 4, rngGen);
    switch (itemType) {
      case 0:
        items[i] = {
          x: chosenCell.x,
          y: chosenCell.y,
          type: ITEM.HPUP,
          cellType: CELL.ITEM_1,
          name: 'mushroom',
          hpup: getRandom(2, 5, rngGen),
        };
        break;
      case 1:
        items[i] = {
          x: chosenCell.x,
          y: chosenCell.y,
          type: ITEM.REGEN,
          cellType: CELL.ITEM_2,
          name: 'apple',
          regen: getRandom(2, 5, rngGen),
        };
        break;
      case 2:
        items[i] = {
          x: chosenCell.x,
          y: chosenCell.y,
          type: ITEM.WEAPON,
          cellType: CELL.ITEM_1,
        };
        break;
      case 3:
        items[i] = {
          x: chosenCell.x,
          y: chosenCell.y,
          type: ITEM.POTION,
          cellType: CELL.ITEM_1,
          potionType: getRandom(0, 3, rngGen),
          effect: getRandom(10, 20, rngGen),
        };
        break;
    }
    map[items[i].x][items[i].y] = items[i].cellType;
  }

  map[player.x][player.y] = CELL.PLAYER;
}

function renderText() {
  const pinfo = `Player HP: ${player.hp}/${player.maxhp} - Weapon: ${player.weapon.name}`;
  let peffect = '';
  if (player.invincibility) {
    peffect += `- invincibility effect: ${player.invincibility} `;
  }
  if (player.invisibility) {
    peffect += `- invisibility effect: ${player.invisibility} `;
  }
  if (player.strength) {
    peffect += `- strength effect: ${player.strength} `;
  }
  let ehp = '';
  if (currentEnemy) {
    ehp = `Enemy HP: ${currentEnemy.hp}`;
  } else if (enemies.length === 0) {
    ehp = 'Exit stairs unlocked';
  }
  if (gameText) {
    gameText.innerText = `Lvl ${currentLvl} - ${pinfo} ${peffect}      ${ehp}`;
  }
}

function create(game) {
  // Create player
  player = {
    x: 11,
    y: 11,
    hp: 5,
    maxhp: 5,
    hasEffect: false,
    weapon: {
      name: weaponList[0],
      damageMin: 1,
      damageMax: 3,
    },
  };
  currentLvl = 1;
  currentWeapon = 0;
  init();

  renderText();
  renderGrid(game);
}

function restart() {
  if (seedInput.value !== '') {
    rng = new Math.seedrandom(`${seedInput.value}1`);
    rngGen = new Math.seedrandom(`${seedInput.value}2`);
  }
  create(game);
  gameRun = true;
}

function update(game) {
  renderGrid(game);
}


function moveTowards(sourcex, sourcey, targetx, targety) {
  const dirx = targetx - sourcex;
  const diry = targety - sourcey;
  let dx; let
    dy;
  if (Math.abs(dirx) > Math.abs(diry)) {
    dx = sourcex + Math.sign(dirx);
    dy = sourcey;
    if (map[dx][dy] !== CELL.EMPTY) { // Don't get stuck in corners
      dx = sourcex;
      dy = sourcey + Math.sign(diry);
    }
  } else {
    dx = sourcex;
    dy = sourcey + Math.sign(diry);
    if (map[dx][dy] !== CELL.EMPTY) { // Don't get stuck in corners
      dx = sourcex + Math.sign(dirx);
      dy = sourcey;
    }
  }
  return { dx, dy };
}

// Handle player actions + AI
function playerAct(x, y) {
  let normalText = true;
  switch (map[x][y]) {
    case CELL.EMPTY: // Player movement
      map[player.x][player.y] = CELL.EMPTY;
      player.x = x;
      player.y = y;
      map[player.x][player.y] = CELL.PLAYER;
      currentEnemy = undefined;
      break;
    case CELL.STAIRS: // Load next level
      player.x = 11;
      player.y = 11;
      currentLvl++;
      init();
      break;
    case CELL.ITEM_1: // Pickup item
    case CELL.ITEM_2:
      const item = items.find((it) => it.x === x && it.y === y);
      normalText = false;
      console.log(item);
      switch (item.type) {
        case ITEM.HPUP:
          player.maxhp += item.hpup;
          player.hp += item.hpup;
          gameText.innerText = `You just found a ${item.name}, increasing your hp to ${player.maxhp}`;
          break;
        case ITEM.REGEN:
          player.hp = (player.hp + item.regen) > player.maxhp ? player.maxhp : player.hp + item.regen;
          gameText.innerText = `You just found an ${item.name}, healing you ${item.regen} hp`;
          break;
        case ITEM.WEAPON:
          currentWeapon++;
          let newWeapon = player.weapon.name;
          if (currentWeapon < weaponList.length) {
            newWeapon = weaponList[currentWeapon];
          }
          player.weapon = {
            name: newWeapon,
            damageMax: player.weapon.damageMax + 1,
            damageMin: player.weapon.damageMin + 1,
          };
          gameText.innerText = `You just found a ${newWeapon}`;
          break;
        case ITEM.POTION:
          switch (item.potionType) {
            case POTION.INVINCIBILITY:
              player.invincibility = item.effect + 2;
              gameText.innerText = `You just found a potion of invincibility, its effect will last for ${item.effect} turns`;
              break;
            case POTION.INVISIBILITY:
              player.invisibility = item.effect + 2;
              gameText.innerText = `You just found a potion of invisibility, its effect will last for ${item.effect} turns`;
              break;
            case POTION.STRENGTH:
              player.strength = item.effect + 2;
              gameText.innerText = `You just found a potion of strength, its effect will last for ${item.effect} turns`;
              break;
          }
          break;
      }

      map[player.x][player.y] = CELL.EMPTY;
      player.x = x;
      player.y = y;
      map[player.x][player.y] = CELL.PLAYER;
      break;
    case CELL.ENEMY_1: // Player attack
    case CELL.ENEMY_2:
      currentEnemy = enemies.find((en) => en.x === x && en.y === y);
      const strengthBoost = player.strength ? 2 : 1;
      currentEnemy.hp -= getRandom(player.weapon.damageMin, player.weapon.damageMax) * strengthBoost;
      if (currentEnemy.hp <= 0) {
        enemies.splice(enemies.indexOf(currentEnemy), 1);
        map[currentEnemy.x][currentEnemy.y] = CELL.EMPTY;
        currentEnemy = undefined;
      }
      break;
  }

  if (!player.invisibility) {
    for (const en of enemies) { // Enemies AI
      const px = player.x;
      const py = player.y;
      const { x: ex, y: ey } = en;
      const dist = Math.abs(px - ex) + Math.abs(py - ey);
      if (en.type === CELL.ENEMY_1) {
        if (dist < 4) {
          if (en.turn % 2 === 0) {
            if (dist === 1) {
              if (!player.invincibility) {
                player.hp -= getRandom(en.damageMin, en.damageMax);
              }
            } else {
              const { dx, dy } = moveTowards(ex, ey, px, py);
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
      } else if (dist < 10) {
        if (en.turn % 3 !== 0) {
          const dir = getRandom(0, 4);
          let dx; let
            dy;
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
          if (map[dx][dy] === CELL.PLAYER && !player.invincibility) {
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

  // Progressively remove effects
  if (player.invincibility && player.invincibility > 0) {
    player.invincibility--;
  } else if (player.invisibility && player.invisibility > 0) {
    player.invisibility--;
  } else if (player.strength && player.strength > 0) {
    player.strength--;
  }

  if (player.hp <= 0) {
    normalText = false;
    gameText.innerText = 'You lost, too bad';
    seedInput.value = '';
    gameRun = false;
  } else if (enemies.length === 0) {
    map[12][12] = CELL.STAIRS;
  }

  if (normalText) {
    renderText();
  }
}

function onKeyPress(direction) {
  if (gameRun) {
    const { x, y } = player;
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

const config = {
  create,
  update,
  onKeyPress,
};

const game = new Game(config);
game.run();

window.onload = () => {
  document.getElementById('restartGame').addEventListener('click', restart);
  seedInput = document.getElementById('seedInput');
  gameText = document.getElementById('gameText');
  
  // Cheatcode
  let keysPressed = {};
  document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
    if (['f', 'u', 'c', 'k'].every((k) => keysPressed[k])) {
      enemies = [];
    }
  });
  document.addEventListener('keyup', (e) => {
    delete keysPressed[e.key];
  });
};