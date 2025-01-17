﻿class PlayField {
    constructor() {
      this.element = document.getElementById('play-field');
      this.context = this.element.getContext('2d');
  
      this.background = new Image();
      this.background.src = './images/field.png';
    }
  
    draw() {
      this.context.drawImage(this.background, 0, 0);
      this.context.fillText("Best Score: ", 6 * config.box, 1.5 * config.box);
      this.context.fillText("Score: ", 1 * config.box, 1.5 * config.box);
    }
  }
  
  
  class Config {
    constructor() {
      this.box = 32;
      this.speedGame = 0.5;
    }
  }
  
  
  class Food {
    constructor() {
      this.canvas = canvas.context;
      this.config = config.box;
  
      this.circle = function (x, y, radius, fillCircle) {
      this.canvas.beginPath();
      this.canvas.arc(this.x + 16, this.y + 16, radius, 0, Math.PI * 2);
      this.canvas.fill();
    }
          
      this.colors = [
        '#CD5C5C',
        '#DC143C',
        '#FF69B4',
        '#FF6347',
        '#FFD700',
        '#EE82EE',
        '#6A5ACD',
        '#1E90FF',
        '#9400D3'
      ];
  }
  
    initialize(canvas, config) {
      this.canvas = canvas.context;
      this.config = config.box;
      this.randomPositionFood();
    }
  
    draw() {
      if (!snake.gameOver) {
        this.canvas.fillStyle = this.food;
        this.circle(this.x, this.у, this.config / 2, true);            
      }
    }
  
    randomPositionFood() {
      this.x = Math.floor((Math.random() * 10) + 1) * this.config;
      this.y = Math.floor((Math.random() * 10) + 3) * this.config;
      this.setRandomColor();
    }
  
    setRandomColor() {
      this.randomIndex = Math.floor(Math.random() * this.colors.length);
      this.food = this.colors[this.randomIndex];
    }
  }
  
  
  class Snake {
    constructor() {
      this.x = 4 * config.box;
      this.y = 7 * config.box;
      this.dx = config.box;
      this.dy = 0;
      this.tails = [];
      this.maxTails = 2;
      this.dir = 'right';
      this.gameOver = false;
  
      this.control();
    }
  
    startGame() {
      this.gameOver = false;
      this.updata();
      food.randomPositionFood();
    }
  
    updata() {
      if (!this.gameOver) {
        setTimeout(this.updata.bind(this), 100 / config.speedGame);
      }
      this.x += this.dx;
      this.y += this.dy;
  
      if (this.x < config.box || this.x > canvas.element.width - config.box * 2 || this.y < 3 * config.box || this.y > canvas.element.height - config.box * 2) {
        this.refreshGame();
      }
  
      this.tails.unshift({
        x: this.x,
        y: this.y
      });
  
      if (this.tails.length > this.maxTails) {
        this.tails.pop();
      }
  
      this.tails.forEach((item, index) => {
        if (item.x === food.x && item.y === food.y) {
          this.maxTails++;
  
          score.increaseScore();
          score.increaseSpeed();
          food.randomPositionFood();
        }
  
        for (let i = index + 1; i < this.tails.length; i++) {
          if (item.x === this.tails[i].x && item.y === this.tails[i].y) {
            this.refreshGame();
          }
        }
      })
    }
  
    draw() {
      this.tails.forEach((item, index) => {
        if (index === 0) {
          canvas.context.fillStyle = '#2F4F4F';
        } else {
          canvas.context.fillStyle = '#587462';
        }
        canvas.context.fillRect(item.x, item.y, config.box - 1, config.box - 1);
      })
    }
  
    refreshGame() {
      score.refreshScore();
      this.gameOver = true;
      this.dir = 'right';
      this.x = 4 * config.box;
      this.y = 7 * config.box;
      this.tails = [];
      this.maxTails = 2;
      this.dx = config.box;
      this.dy = 0;
      
      config.speedGame = 0.5;
      clearInterval(gameLoop); 
      canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height);
      
      const gameOverWrapper = document.createElement('div');
      gameOverWrapper.classList.add('game-over__wrapper');
  
      const gameOverText = document.createElement('div');
      gameOverText.classList.add('game-over__text');
      gameOverText.innerText = 'Game Over';
  
      const restartButton = document.createElement('button');
      restartButton.classList.add('game-over__play-again__button');
      restartButton.innerText = 'Play Again!';
      restartButton.addEventListener('click', () => {
        gameOverWrapper.remove();
        this.restartGame();
      });
  
      gameOverWrapper.appendChild(gameOverText);
      gameOverWrapper.appendChild(restartButton);
      document.body.appendChild(gameOverWrapper);
      
      gameLoop = setInterval(game.draw, 100);
      
      food.randomPositionFood();
    }
  
    restartGame() {
      canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height);
  
      const gameOverWrapper = document.querySelector('.gameOverWrapper');
      if (gameOverWrapper) {
        gameOverWrapper.remove();
      }
  
      this.gameOver = false;
      this.updata()
    }
  
    control() {
      document.addEventListener('keydown', (event) => {
        if (event.keyCode === 37 && this.dir !== 'right') {
          this.dir = 'left';
          this.dx = -config.box;
          this.dy = 0;
        } else if (event.keyCode === 38 && this.dir !== 'down') {
          this.dir = 'up';
          this.dx = 0;
          this.dy = -config.box;
        } else if (event.keyCode === 39 && this.dir !== 'left') {
          this.dir = 'right';
          this.dx = config.box;
          this.dy = 0;
        } else if (event.keyCode === 40 && this.dir !== 'up') {
          this.dir = 'down';
          this.dx = 0;
          this.dy = config.box;
        }
      })
    }
  }
  
  
  class Score {
    _score
    _bestScore
  
    constructor() {
      this._score = 0;
      this._bestScore = 0;
    }
  
    increaseScore() {
      this._score++;
    }
  
    increaseSpeed() {
      switch (score._score) {
        case 7:
          config.speedGame += 0.1;
          break
        case 14:
          config.speedGame += 0.1;
          break
        case 21:
          config.speedGame += 0.1;
          break
        case 28:
          config.speedGame += 0.1;
          break
        case 35:
          config.speedGame += 0.1;
          break
        case 42:
          config.speedGame += 0.1;
          break
        case 48:
          config.speedGame += 0.1;
          break
      }
  
      gameLoop = setInterval(game.draw, 100);
    }
  
    refreshScore() {
      if (this._score > score._bestScore) {
        localStorage.setItem('bestScore', this._score);
      }
      score._bestScore = Number(localStorage.getItem('bestScore'));
      this._score = 0;
    }
  
    localStorageScore() {
      if (localStorage.getItem('bestScore')) {
        score._bestScore = Number(localStorage.getItem('bestScore'));
      } else {
        score._bestScore = 0;
      }
    }
  
    draw() {
      canvas.context.fillStyle = '#FAF0E6';
      canvas.context.font = '24px Montserrat';
      canvas.context.fillText(this._score, 3.5 * config.box, 1.5 * config.box);
  
      canvas.context.fillStyle = '#FAF0E6';
      canvas.context.font = '24px Montserrat';
      canvas.context.fillText(this._bestScore, 10.5 * config.box, 1.5 * config.box);
    }
  }
  
  
  class Game {
    draw() {
      canvas.draw();
      food.draw();
      snake.draw();
      score.draw();
    }
  }
  
  let canvas = new PlayField();
  let config = new Config();
  let snake = new Snake();
  let food = new Food();
  let score = new Score();
  const game = new Game();
  
  score.localStorageScore();
  
  let gameStarted = false;
  let startButton = document.querySelector('.start__button');
  startButton.addEventListener('click', () => {
    snake.startGame();
    food.initialize(canvas, config);
    gameStarted = true;
    startButton.style.display = 'none';
  });
  
  let gameLoop = setInterval(game.draw, 100);