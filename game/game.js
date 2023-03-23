// Defining Canvas element
var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Linking images to constant variables
const bg = new Image();
bg.src = '../img/gameMap.png';

const battleBg = new Image();
battleBg.src = '../img/battleBg.png';

const ignisImage = new Image();
ignisImage.src = '../img/embySprite.png';

const serpImage = new Image();
serpImage.src = '../img/draggleSprite.png';

// Classes
class Sprite {
  constructor({ position, image = {pic, width, height}, frames = { max: 1 }, sprites, animate = false, isEnemy = false, name })
  {
    this.position = position;
    this.image = image.pic;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.width = image.width / this.frames.max;
    this.height = image.height;
    this.animate = animate;
    this.sprites = sprites;
    this.health = 100;
    this.isEnemy = isEnemy;
    this.name = name;
    this.opacity = 1;
  }

  draw()
  {
    ctx.drawImage(
      this.image, // Image to be loaded
      // Cropping
      this.frames.val * 48,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      // Positioning
      this.position.x,    // Offset x
      this.position.y,      // Offset y
      this.image.width / this.frames.max,
      this.image.height
    );

    // Movement animation
    if(!this.animate) return // If key not pressed, do NOT move
    if(this.frames.max > 1) { this.frames.elapsed++ };
    if(this.frames.elapsed % 10 == 0)
    {
      if(this.frames.val < this.frames.max - 1) { this.frames.val++ }
      else {this.frames.val = 1};
    }
  }

  // Attack function
  attack({ attack, user, recipient, enemy })
  {
    // Show dialogue box after attacking
    document.querySelector('#battleDialogue').style.display = 'block';
    document.querySelector('#battleDialogue').innerHTML = this.name + ' used ' + attack.name + '!';
    // Values
    recipient.health -= attack.damage;
    var enemyHealthBar = '#serpBar';
    if(enemy) { enemyHealthBar = '#ignBar'; }

    switch(attack.name)
    {
      // Attack: RAM
      case 'Ram':
        gsap.to(enemyHealthBar, {
          width: recipient.health  + '%',
        });
        break;
      // Attack: CIMORI
      case 'Cimori':
        gsap.to(enemyHealthBar, {
          width: recipient.health  + '%',
        });
        break;
    }
  }

  // Faint function
  faint()
  {
    document.querySelector('#battleDialogue').innerHTML = this.name + ' fainted...';
    gsap.to(this.position, {
      y: this.position.y - 400 // Cant fade, so off the screen you go!
    })
  }
}

// Instantiating objects
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: {
    pic: bg
  }
});

const foregroundObjects = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: {
    pic: foreground
  }
});

const playerSprite = new Sprite({
  position:
  {
    x: 599,
    y: 400
  },
  image:
  {
    pic: moveDown,
    width: 48,
    height: 48
  },
  frames:
  {
    max: 4
  },
  sprites:
  {
    up: moveUp,
    down: moveDown,
    left: moveLeft,
    right: moveRight
  }
});

const battle = new Sprite({
  position: {
    x:0,
    y:0
  },
  image: {
    pic: battleBg
  }
});


// set VALUES
var isBoss;

// constant VALUES
const movables = [background, ...enemies, ...boundaries, foreground];
const initiateBattle = {
  initiated: false
}

// Initiate VALUES
var queue;
var ignis;
var serpentis;
var mapFrameId;
var battleFrameId;

// Functions
// Game Over
function gameOver () {
  document.querySelector('#gameOver').style.display = 'block';
}

// Initiate
function init()
{
  queue = [];
  // Display overlayed divs
  document.querySelector('#ui').style.display = 'block';
  document.querySelector('#battleDialogue').style.display = 'none';

  // Sprite: Serpentis
  serpentis = new Sprite({
    position:
    {
      x: 950,
      y: 175
    },
    image:
    {
      pic: serpImage,
      width: 48,
      height: 48
    },
    frames:
    {
      max: 4
    },
    name: 'Serpentis',
  });

  // Sprite: Ignis
  ignis = new Sprite({
    position:
    {
      x: 300,
      y: 300
    },
    image:
    {
      pic: ignisImage,
      width: 48,
      height: 48
    },
    frames:
    {
      max: 4
    },
    name: 'Ignis'
  });

  // Attacking
  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const choice = attacks[e.currentTarget.innerHTML] // 1
        // IGNIS
        ignis.attack({
          attack: choice,
          user: ignis,
          recipient: serpentis
        }); // from ignis.attack

      if(serpentis.health <= 0)
      {
        queue.push(() => {
          serpentis.faint();
        });
        queue.push(() => {
          // Transition back to map
          gsap.to('#overlay', {
            opacity: 1,
            duration: 2,
            onComplete() {
              document.querySelector('#gameOver').innerHTML = 'You win';
              document.querySelector('#gameOver').style.display = 'block';
              document.querySelector('#ui').style.display = 'none';
              gsap.to('#overlay', {
                opacity:0
              });
            }
          });
        });
      }

      // Serpentis attacks
        queue.push(() => {
          var serpAttack;
          var randAttack = Math.floor(Math.random() * 2) + 1;
          // Randomize
          switch(randAttack)
          {
            case 1:
              serpAttack = serpentisAttacks.Cimori;
              break;
            case 2:
              serpAttack = serpentisAttacks.Ram;
              break;
          }

          // Attack itself
          serpentis.attack({
            attack: serpAttack,
            user: serpentis,
            recipient: ignis,
            enemy: true,
          });

          if(ignis.health <= 0)
      {
        queue.push(() => {
          ignis.faint();
        });
        queue.push(() => {
          // Transition back to map
          gsap.to('#overlay', {
            opacity: 1,
            duration: 2,
            onComplete() {
              document.querySelector('#gameOver').innerHTML = 'You lose :(';
              document.querySelector('#gameOver').style.display = 'block';
              document.querySelector('#ui').style.display = 'none';
              gsap.to('#overlay', {
                opacity:0
              });
            }
          });
        });
      }
        })
      }); // From event listener

    button.addEventListener('mouseenter', (e) => {
      const choice = attacks[e.currentTarget.innerHTML];
      document.querySelector('.type').innerHTML = choice.type;
    });
  }); // From querySelectorAll

  // Reset bar not health
  document.querySelector('#serpBar').style.width = serpentis.health + '%';
  document.querySelector('#ignBar').style.width = ignis.health + '%';

  // End turn
  document.querySelector('#battleDialogue').addEventListener('click', (e) => {
    if(queue.length > 0)
    {
      queue[0]();
      queue.shift();
    }
    else
    {
      e.currentTarget.style.display = 'none';
    }
  });
}

// Battle
function pokemonBattle() {
  battleFrameId = window.requestAnimationFrame(pokemonBattle);
  battle.draw();
  ignis.draw();
  serpentis.draw();
}

initiateBattle.initiated = false;

// Animate
function animate() {
  // Drawing images in canvas
  const animationId = window.requestAnimationFrame(animate);
  background.draw();
  playerSprite.draw();
  foregroundObjects.draw();

  document.querySelector('#gameOver').style.display = 'none';
  document.querySelector('#ui').style.display = 'none';
  document.querySelector('#dialogueBar').style.display = 'none';
  // Battle DEMO!!!
  if(initiateBattle.initiated)
  {
    window.cancelAnimationFrame(animationId);
    dialogue(isBoss);
  }
  else if(!initiateBattle.initiated)
  {
    // Reset health
    serpentis.health = 100;
    ignis.health = 100;
  }

  // Character walk
  var playerMoving = true;                  // For collisions
  playerSprite.animate = false;                    // Animation itself
  if(keys.w.pressed) {
    playerSprite.animate = true;
    playerSprite.image = playerSprite.sprites.up;
    // Boundary Collision
    for(var i = 0; i < boundaries.length; i++)
    {
      const boundary = boundaries[i];
      if(
        isColliding({
          object1: playerSprite,
          object2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 10
            }
          }
        })
      )
      {
        playerMoving = false;
        break;
      }
    }

    // Enemy Collision
    for(var j = 0; j < enemies.length; j++)
    {
      const enemy = enemies[j];
      if(
        isColliding({
          object1: playerSprite,
          object2: {
            ...enemy,
            position: {
              x: enemy.position.x,
              y: enemy.position.y + 10
            }
          }
        })
      )
      {
        initiateBattle.initiated = true;
        isBoss = true;
      }
    }

    // Player movement
    if(playerMoving)
    {
      movables.forEach((movables) => {
        movables.position.y += 10;
      });
    }
  }
  else if(keys.a.pressed) {
    playerSprite.image = playerSprite.sprites.left;
    playerSprite.animate = true;
    // Boundary Collision
    for(var i = 0; i < boundaries.length; i++)
    {
      const boundary = boundaries[i];
      if (
        isColliding({
          object1: playerSprite,
          object2: {
            ...boundary,
            position: {
              x: boundary.position.x + 10,
              y: boundary.position.y
            }
          }
        })
      )
      {
        playerMoving = false;
        break;
      }
    }

    // Enemy Collision
    for(var j = 0; j < enemies.length; j++)
    {
      const enemy = enemies[j];
      if(
        isColliding({
          object1: playerSprite,
          object2: {
            ...enemy,
            position: {
              x: enemy.position.x + 10,
              y: enemy.position.y
            }
          }
        })
      )
      {
        initiateBattle.initiated = true;
        isBoss = true;
      }
    }

    // Player movement
    if(playerMoving)
    {
      movables.forEach((movables) => {
        movables.position.x += 10;
      });
    }
  }
  else if(keys.s.pressed) {
    playerSprite.image = playerSprite.sprites.down;
    playerSprite.animate = true;
    // Boundary Collision
    for(var i = 0; i < boundaries.length; i++)
    {
      const boundary = boundaries[i];
      if (
        isColliding({
          object1: playerSprite,
          object2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 10
            }
          }
        })
      )
      {
        initiateBattle.initiated = true;
        playerMoving = false;
        break;
      }
    }

    // Enemy Collision
    for(var j = 0; j < enemies.length; j++)
    {
      const enemy = enemies[j];
      if(
        isColliding({
          object1: playerSprite,
          object2: {
            ...enemy,
            position: {
              x: enemy.position.x,
              y: enemy.position.y - 10
            }
          }
        })
      )
      {
        initiateBattle.initiated = true;
        isBoss = true;
      }
    }

    // Player movement
    if(playerMoving)
    {
      movables.forEach((movables) => {
        movables.position.y -= 10;
      });
    }
  }
  else if(keys.d.pressed) {
    playerSprite.animate  = true;
    playerSprite.image = playerSprite.sprites.right;
    // Boundary Collision
    for(var i = 0; i < boundaries.length; i++)
    {
      const boundary = boundaries[i];
      if (
        isColliding({
          object1: playerSprite,
          object2: {
            ...boundary,
            position: {
              x: boundary.position.x - 10,
              y: boundary.position.y
            }
          }
        })
      )
      {
        initiateBattle.initiated = true;
        playerMoving = false;
        break;
      }
    }

    // Enemy Collision
    for(var j = 0; j < enemies.length; j++)
    {
      const enemy = enemies[j];
      if(
        isColliding({
          object1: playerSprite,
          object2: {
            ...enemy,
            position: {
              x: enemy.position.x - 10,
              y: enemy.position.y
            }
          }
        })
      )
      {
        initiateBattle.initiated = true;
        isBoss = true;
      }
    }

    // Player movement
    if(playerMoving)
    {
      movables.forEach((movables) => {
        movables.position.x -= 10;
      });
    }
  }
}

// Call animate function (DO NOT CHANGE!!!)
init();
animate();