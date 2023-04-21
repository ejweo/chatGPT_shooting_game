// 게임 캔버스 설정
var canvas = document.getElementById("gameCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

// 게임 오브젝트 설정
var player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  speed: 5,
  isShooting: false,
  shoot: function() {
    bullets.push(new Bullet(this.x + this.width / 2, this.y));
  }
};

var bullets = [];
var enemies = [];

// 게임 이벤트 설정
document.addEventListener("keydown", function(event) {
  if (event.key === "ArrowLeft") {
    player.x -= player.speed;
  } else if (event.key === "ArrowRight") {
    player.x += player.speed;
  } else if (event.key === " ") {
    player.isShooting = true;
  }
});

document.addEventListener("keyup", function(event) {
  if (event.key === " ") {
    player.isShooting = false;
  }
});

// 게임 루프 설정
function gameLoop() {
  // 캔버스 초기화
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 플레이어 이동
  if (player.x < 0) {
    player.x = 0;
  } else if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }
  
  // 총알 생성
  if (player.isShooting) {
    player.shoot();
  }
  
  // 총알 이동
  bullets.forEach(function(bullet, index) {
    bullet.y -= bullet.speed;
    
    // 총알 삭제
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });
  
  // 적 생성
  if (Math.random() < 0.05) {
    enemies.push(new Enemy(Math.random() * canvas.width, 0));
  }
  
  // 적 이동
  enemies.forEach(function(enemy, index) {
    enemy.y += enemy.speed;
    
    // 적 삭제
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }
  });
  
   // 게임 오브젝트 그리기
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  bullets.forEach(function(bullet) {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
  
  enemies.forEach(function(enemy) {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
  
  // 충돌 감지
  bullets.forEach(function(bullet, bulletIndex) {
    enemies.forEach(function(enemy, enemyIndex) {
      if (bullet.x < enemy.x + enemy.width && bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height && bullet.y + bullet.height > enemy.y) {
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
      }
    });
  });
  
  // 다음 게임 루프 실행
  requestAnimationFrame(gameLoop);
}

// 게임 오브젝트 클래스 정의
function Bullet(x, y) {
  this.x = x;
  this.y = y;
  this.width = 5;
  this.height = 10;
  this.speed = 10;
}

function Enemy(x, y) {
  this.x = x;
  this.y = y;
  this.width = 50;
  this.height = 50;
  this.speed = 3;
}

function touchHandler(event) {
  var touch = event.changedTouches[0];
  var x = touch.pageX - canvas.offsetLeft;
  var y = touch.pageY - canvas.offsetTop;
  
  if (x > plane.x) {
    plane.dx = 5;
  } else {
    plane.dx = -5;
  }
}

function touchStartHandler(event) {
  var touch = event.changedTouches[0];
  var x = touch.pageX - canvas.offsetLeft;
  var y = touch.pageY - canvas.offsetTop;
  
  if (x < plane.x) {
    plane.dx = -plane.speed;
  } else {
    plane.dx = plane.speed;
  }
}

function touchMoveHandler(event) {
  var touch = event.changedTouches[0];
  var x = touch.pageX - canvas.offsetLeft;
  var y = touch.pageY - canvas.offsetTop;
  
  if (x < plane.x && plane.dx > 0) {
    plane.dx = -plane.speed;
  }
  
  if (x > plane.x + plane.width && plane.dx < 0) {
    plane.dx = plane.speed;
  }
}

function touchEndHandler(event) {
  plane.dx = 0;
}

var isDragging = false;
var mouseX = 0;

function mouseDownHandler(event) {
  isDragging = true;
  mouseX = event.clientX - canvas.offsetLeft;
  
  if (mouseX < plane.x) {
    plane.dx = -plane.speed;
  } else {
    plane.dx = plane.speed;
  }
}

function mouseMoveHandler(event) {
  if (isDragging) {
    var x = event.clientX - canvas.offsetLeft;
    
    if (x < plane.x && plane.dx > 0) {
      plane.dx = -plane.speed;
    }
    
    if (x > plane.x + plane.width && plane.dx < 0) {
      plane.dx = plane.speed;
    }
  }
}

function mouseUpHandler(event) {
  isDragging = false;
  plane.dx = 0;
}

canvas.onmousedown = mouseDownHandler;
canvas.onmousemove = mouseMoveHandler;
canvas.onmouseup = mouseUpHandler;

// 게임 시작
gameLoop();
