class Enemy {
    constructor(x, y, radius, color, velocity, speed, type) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.type = type;
        this.color = color;
        this.velocity = velocity;
        this.speed = speed;
        this.radians = 0;
        if (frames < 20000) {
            this.radianFactor = Math.floor(Math.random() * 20 + 10);
        } else {
            this.radianFactor = Math.floor(Math.random() * 40 + 10);
        }
        this.center = {
            x: x,
            y: y
        }
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();

        if (this.type === 'Spinning') {
            this.radians += 0.1;

            this.center.x += this.velocity.x * this.speed;
            this.center.y += this.velocity.y * this.speed;
    
            this.x = this.center.x + Math.cos(this.radians) * this.radianFactor;
            this.y = this.center.y + Math.sin(this.radians) * this.radianFactor;
        }
        // homing
        else if (this.type === 'Homing') {
            const angle = Math.atan2(player.y-this.y, player.x-this.x);
            this.velocity.x = Math.cos(angle);
            this.velocity.y = Math.sin(angle);

            this.x = this.x + this.velocity.x * this.speed;
            this.y = this.y + this.velocity.y * this.speed;
        }
        // homing spinning
        else if (this.type === 'Homing Spinning') {
            this.radians += 0.1;

            const angle = Math.atan2(player.y-this.center.y, player.x-this.center.x);
            this.velocity.x = Math.cos(angle);
            this.velocity.y = Math.sin(angle);

            this.center.x += this.velocity.x * this.speed;
            this.center.y += this.velocity.y * this.speed;
    
            this.x = this.center.x + Math.cos(this.radians) * this.radianFactor;
            this.y = this.center.y + Math.sin(this.radians) * this.radianFactor;
        }
        // boss
        else if (this.type === 'Boss') {
            if (frames > 0 && frames % 300 === 0 && this.radius < 210 && this.speed < 4) {
                this.radius+=10;
                this.speed+=0.05;
            }
            this.color = "#800000";
            const angle = Math.atan2(player.y-this.y, player.x-this.x);
            this.velocity.x = Math.cos(angle);
            this.velocity.y = Math.sin(angle);
            this.x = this.x + this.velocity.x * this.speed;
            this.y = this.y + this.velocity.y * this.speed;
        }   
        // linear
        else {
            this.x = this.x + this.velocity.x * this.speed;
            this.y = this.y + this.velocity.y * this.speed;
        }
    }
}

// spawn enemies
function spawnEnemies(spawnRate) {
    enemyIntervalId = setInterval(()=> {
        if (gamePaused) {
            clearInterval(enemyIntervalId);
        }
        let radius = Math.floor(Math.random() * (enemyRadiusMax - 10) + 10);
        let x;
        let y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        let speed = 1 + enemySpeedIncrease;
        let dice = Math.floor(Math.random()*numEnemyTypes);
        let enemyType = enemyTypes[dice];

        enemies.push(new Enemy(x, y, radius, color, velocity, speed, enemyType));
    }
    , spawnRate);
}

function spawnBoss() {
    let radius = Math.floor(Math.random() * (enemyRadiusMax - 10) + 10);
    let x;
    let y;
    if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        y = Math.random() * canvas.height;
    } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    const angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x);
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    let speed = 1 + enemySpeedIncrease;  
    enemies.push(new Enemy(x, y, 100, color, velocity, speed, "Boss"));
}