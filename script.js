       // Game variables
        let gameActive = false;
        let score = 0;
        let playerPosition = 1; // 0: left, 1: center, 2: right
        let obstacleSpeed = 2;
        let obstacleInterval = 1500;
        let obstacles = [];
        let gameLoop;
        let obstacleSpawnLoop;
        let lanePositions = [0, 1, 2]; // Lane indexes for positioning

        // DOM elements
        const playerCar = document.getElementById('player-car');
        const scoreDisplay = document.getElementById('score-display');
        const gameOverScreen = document.getElementById('game-over');
        const finalScoreDisplay = document.getElementById('final-score');
        const restartBtn = document.getElementById('restart-btn');
        const leftBtn = document.getElementById('left-btn');
        const rightBtn = document.getElementById('right-btn');
        const lanes = [
            document.getElementById('lane1'),
            document.getElementById('lane2'),
            document.getElementById('lane3')
        ];

        // Initialize game
        function initGame() {
            gameActive = true;
            score = 0;
            playerPosition = 1;
            obstacleSpeed = 2;
            obstacleInterval = 1500;
            obstacles = [];
            
            // Clear any existing obstacles
            document.querySelectorAll('.obstacle-car').forEach(obstacle => {
                obstacle.remove();
            });

            // Reset player position
            updatePlayerPosition();
            scoreDisplay.textContent = `Score: ${score}`;
            gameOverScreen.style.display = 'none';

            // Start game loops
            gameLoop = setInterval(updateGame, 16);
            obstacleSpawnLoop = setInterval(spawnObstacle, obstacleInterval);

            // Increase difficulty over time
            setTimeout(increaseDifficulty, 10000);
        }

        // Update player position based on playerPosition variable
        function updatePlayerPosition() {
            // Convert lane index to position percentage
            const positions = ['17%', '50%', '83%'];
            playerCar.style.left = positions[playerPosition];
        }

        // Move player left
        function moveLeft() {
            if (!gameActive) return;
            if (playerPosition > 0) {
                playerPosition--;
                updatePlayerPosition();
            }
        }

        // Move player right
        function moveRight() {
            if (!gameActive) return;
            if (playerPosition < 2) {
                playerPosition++;
                updatePlayerPosition();
            }
        }

        // Spawn a new obstacle
        function spawnObstacle() {
            if (!gameActive) return;
            
            const laneIndex = Math.floor(Math.random() * 3);
            const obstacle = document.createElement('div');
            obstacle.className = 'obstacle-car';
            
            // Positioning
            const positions = ['17%', '50%', '83%'];
            obstacle.style.left = positions[laneIndex];
            obstacle.style.top = '-70px';
            
            lanes[laneIndex].appendChild(obstacle);
            
            obstacles.push({
                element: obstacle,
                lane: laneIndex,
                top: -70
            });
        }

        // Update game state
        function updateGame() {
            if (!gameActive) return;
            
            // Update score
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            
            // Update obstacles
            for (let i = obstacles.length - 1; i >= 0; i--) {
                const obstacle = obstacles[i];
                obstacle.top += obstacleSpeed;
                obstacle.element.style.top = `${obstacle.top}px`;
                
                // Check if obstacle is off screen
                if (obstacle.top > 600) {
                    obstacle.element.remove();
                    obstacles.splice(i, 1);
                }
                
                // Check for collision
                if (obstacle.lane === playerPosition && 
                    obstacle.top > 470 && obstacle.top < 540) {
                    endGame();
                    break;
                }
            }
            
            // Check if any lanes are empty (visual effect)
            checkEmptyLanes();
        }

        // End the game
        function endGame() {
            gameActive = false;
            clearInterval(gameLoop);
            clearInterval(obstacleSpawnLoop);
            
            finalScoreDisplay.textContent = `Score: ${score}`;
            gameOverScreen.style.display = 'flex';
        }

        // Increase game difficulty
        function increaseDifficulty() {
            if (!gameActive) return;
            obstacleSpeed += 0.5;
            
            if (obstacleInterval > 800) {
                obstacleInterval -= 100;
                clearInterval(obstacleSpawnLoop);
                obstacleSpawnLoop = setInterval(spawnObstacle, obstacleInterval);
            }
            
            setTimeout(increaseDifficulty, 10000);
        }

        // Check for empty lanes (visual effect)
        function checkEmptyLanes() {
            const laneCounts = [0, 0, 0];
            
            obstacles.forEach(obstacle => {
                laneCounts[obstacle.lane]++;
            });
            
            lanes.forEach((lane, index) => {
                if (laneCounts[index] === 0) {
                    lane.style.backgroundColor = '#454545';
                } else {
                    lane.style.backgroundColor = '#444';
                }
            });
        }

        // Event listeners
        leftBtn.addEventListener('click', moveLeft);
        rightBtn.addEventListener('click', moveRight);
        restartBtn.addEventListener('click', initGame);

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                moveLeft();
            } else if (e.key === 'ArrowRight') {
                moveRight();
            } else if (e.key === ' ' && !gameActive) {
                initGame();
            }
        });

        // Touch controls for mobile
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            if (!gameActive) return;
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (diff > 30) { // Swipe left
                moveLeft();
            } else if (diff < -30) { // Swipe right
                moveRight();
            }
        });

        // Initialize the game
        initGame();