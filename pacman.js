const pacArray = [
  ['./images/PacMan1.png', './images/PacMan2.png'],
  ['./images/PacMan3.png', './images/PacMan4.png'],
  ['./images/PacMan5.png', './images/PacMan6.png'],
  ['./images/PacMan7.png', './images/PacMan8.png'],
];

const fruitsArray = [
  './images/apple.png',
  './images/bananas.png',
  './images/combo.png',
  './images/strawberry.png',
];
// sounds
const controlSound = document.getElementById('controlsound');
controlSound.volume = 0.3;
const collisionSound = document.getElementById('collisionsound');
const scoreSound = document.getElementById('scoresound');
const backgroundMusic = document.getElementById('backgroundmusic');
backgroundMusic.volume = 0.3;
let score = 0;
const xCoordinates = [
  300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 940,
];
const yCoordinates = [135, 200, 250, 300, 350, 400, 430, 480];
let pacMan;
var speed = 10;
let timeoutID;
// Random coordinate
function randomCoordinate() {
  return {
    x: xCoordinates[Math.floor(Math.random() * xCoordinates.length)],
    y: yCoordinates[Math.floor(Math.random() * yCoordinates.length)],
  };
}
// create random fruit
let fruitIdNber;
let fruitName;
function createFruit() {
  let fruitIndex = Math.floor(Math.random() * fruitsArray.length);
  const img = document.createElement('img');

  switch (fruitIndex) {
    case 0:
      fruitName = 'apple';
      break;
    case 1:
      fruitName = 'banana';
      break;
    case 2:
      fruitName = 'combo';
      break;
    case 3:
      fruitName = 'strawberry';
      break;

    default:
      break;
  }
  img.setAttribute('id', `${fruitName}${fruitIdNber}`);
  img.src = fruitsArray[fruitIndex];
  img.width = 30;
  img.style.left = randomCoordinate().x;
  img.style.top = randomCoordinate().y;
  game.appendChild(img);
}
// Pacman Factory
function makePacman() {
  // Add image to div id = game
  let game = document.getElementById('game');
  let pacmanImg = document.createElement('img');
  pacmanImg.setAttribute('id', 'pacman');
  pacmanImg.classList.add('pacman');

  pacMan = {
    direction: 0,
    position: { x: 300, y: 300 },
    velocity: { x: speed, y: 0 },
    pacmanImg,
    pos: 1,
  };

  pacmanImg.style.position = 'absolute';
  pacmanImg.src = pacArray[pacMan.direction][pacMan.pos];
  pacmanImg.width = 50;

  // set initial position
  pacmanImg.style.left = pacMan.position.x;
  pacmanImg.style.top = pacMan.position.y;

  // add new Child image to game
  game.appendChild(pacmanImg);

  return pacMan;
}
// check wall collisions and change direction
function checkWallCollision(item) {
  if (item.velocity.x > 0) {
    item.direction = 0;
  }
  if (item.velocity.x < 0) {
    item.direction = 1;
  }
  if (item.velocity.y > 0) {
    item.direction = 2;
  }
  if (item.velocity.y < 0) {
    item.direction = 3;
  }
  if (
    item.position.x + item.velocity.x + item.pacmanImg.width >
    985
    //window.innerWidth
  ) {
    item.velocity.x = -item.velocity.x;
    collisionSound.play();
    item.pacmanImg.src = pacArray[item.direction][0];
  } else if (item.position.x + item.velocity.x < 260) {
    item.velocity.x = -item.velocity.x;
    collisionSound.play();
    item.pacmanImg.src = pacArray[item.direction][0];
  }
  if (item.position.y + item.velocity.y + item.pacmanImg.width > 540) {
    item.velocity.y = -item.velocity.y;
    collisionSound.play();
    item.pacmanImg.src = pacArray[item.direction][0];
  } else if (item.position.y + item.velocity.y < 112) {
    item.velocity.y = -item.velocity.y;
    collisionSound.play();
    item.pacmanImg.src = pacArray[item.direction][0];
  }
}
// check pacman and fruits collision
function pacmanFruitCollision() {
  const fruitNodelist = document.querySelectorAll('img');
  if (fruitNodelist.length === 1) {
    for (let i = 0; i < 10; i++) {
      fruitIdNber = i;
      createFruit();
    }
  }
  fruitNodelist.forEach((fruitNode) => {
    if (fruitNode.id !== 'pacman') {
      if (
        Math.abs(
          Number(fruitNode.style.left.replace('px', '')) -
            Number(pacMan.pacmanImg.style.left.replace('px', ''))
        ) <= 15
      ) {
        if (
          Math.abs(
            Number(fruitNode.style.top.replace('px', '')) -
              Number(pacMan.pacmanImg.style.top.replace('px', ''))
          ) <= 20
        ) {
          scoreSound.play();
          setTimeout(() => {
            //fruitNode.style.display = 'none';
            fruitNode.remove();
            fruitNode.id.includes('apple') ? (score += 100) : '';
            fruitNode.id.includes('banana') ? (score += 200) : '';
            fruitNode.id.includes('strawberry') ? (score += 300) : '';
            fruitNode.id.includes('combo') ? (score += 400) : '';
            document.getElementById('score').innerText = score;
          }, 100);
        }
      }
    }
  });
}

// update Pacman position and check fruits collision
function movePacman() {
  checkWallCollision(pacMan);
  pacMan.position.x += pacMan.velocity.x;
  pacMan.position.y += pacMan.velocity.y;

  pacMan.pacmanImg.style.left = pacMan.position.x;
  pacMan.pacmanImg.style.top = pacMan.position.y;
  if (pacMan.pos === 0) {
    pacMan.pos++;

    pacMan.pacmanImg.src = pacArray[pacMan.direction][pacMan.pos];
  } else {
    pacMan.pos--;
    pacMan.pacmanImg.src = pacArray[pacMan.direction][pacMan.pos];
  }
  pacmanFruitCollision();

  timeoutID = setTimeout(movePacman, 150);
}

// start game
function startGame() {
  document.querySelector('p').remove();
  for (let i = 0; i < 5; i++) {
    fruitIdNber = i;
    createFruit();
  }
  makePacman();
  movePacman();
  backgroundMusic.play();
  startGameBtn.innerText = 'Quit Game';
  startGameBtn.removeEventListener('click', startGame);
  startGameBtn.addEventListener('click', endgame);
}

// Countdown
function countDown(e) {
  const { duration, currentTime } = e.target;

  countDownElt.innerText = Math.floor(duration - currentTime);
  if (Math.floor(duration - currentTime) === 0) {
    endgame();
    alert('game over');
  }
}
const countDownElt = document.getElementById('countdown');
const startGameBtn = document.getElementById('startgame');
const leftBtn = document.getElementById('left');
const upBtn = document.getElementById('up');
const rightBtn = document.getElementById('right');
const downBtn = document.getElementById('down');
leftBtn.addEventListener('click', (key) => console.log(`${key === 'q'}`));
startGameBtn.addEventListener('click', startGame);
backgroundMusic.addEventListener('timeupdate', countDown);
window.addEventListener('keydown', keydown);
function keydown(e) {
  console.log(e.key);
  const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
  switch (e.key) {
    case 'ArrowLeft':
      pacMan.velocity.x = -1 * speed;
      pacMan.velocity.y = 0;
      clearTimeout(timeoutID);
      movePacman();
      controlSound.play();
      key.classList.add('playing');

      setTimeout(() => {
        key.classList.remove('playing');
      }, 100);

      break;
    case 'ArrowUp':
      pacMan.velocity.x = 0;
      pacMan.velocity.y = -1 * speed;
      clearTimeout(timeoutID);
      movePacman();
      controlSound.play();
      key.classList.add('playing');

      setTimeout(() => {
        key.classList.remove('playing');
      }, 100);
      break;
    case 'ArrowRight':
      pacMan.velocity.x = 1 * speed;
      pacMan.velocity.y = 0;
      clearTimeout(timeoutID);
      movePacman();
      controlSound.play();
      key.classList.add('playing');

      setTimeout(() => {
        key.classList.remove('playing');
      }, 100);
      break;
    case 'ArrowDown':
      pacMan.velocity.x = 0;
      pacMan.velocity.y = 1 * speed;
      clearTimeout(timeoutID);
      movePacman();
      controlSound.play();
      key.classList.add('playing');

      setTimeout(() => {
        key.classList.remove('playing');
      }, 100);

      break;

    default:
      break;
  }
}

function endgame() {
  document.getElementById('pacman').remove();
  backgroundMusic.pause();
  window.location.reload();
}

// const gameScreen = document.getElementById('gamescreen');
// gameScreen.addEventListener('click', (e) => {
//   console.log(
//     `Offset X/Y: ${e.offsetX}, ${e.offsetY}
//     Viewport X/Y: ${e.clientX}, ${e.clientY}
//     Page X/Y: ${e.pageX}, ${e.pageY}
//     Screen X/Y: ${e.screenX}, ${e.screenY}`
//   );
// });
