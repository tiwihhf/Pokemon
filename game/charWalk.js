// Constant values
const foreground = new Image();
foreground.src = '../img/foreground.png';

const moveUp = new Image();
moveUp.src = '../img/playerUp.png';

const moveDown = new Image();
moveDown.src = '../img/playerDown.png';

const moveRight = new Image();
moveRight.src = '../img/playerRight.png';

const moveLeft = new Image();
moveLeft.src = '../img/playerLeft.png';

const keys = {
  // wasd
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}

// EVENT LISTENER
window.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'w':
      keys.w.pressed = true;
      break;
      case 'a':
      keys.a.pressed = true;
      break;
      case 's':
      keys.s.pressed = true;
      break;
      case 'd':
      keys.d.pressed = true;
      break;
  }
})

window.addEventListener('keyup', (e) => {
  switch(e.key) {
    case 'w':
      keys.w.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 's':
      keys.s.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
  }
})