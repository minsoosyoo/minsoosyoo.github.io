class Turret {
    constructor(x, y, radius, color, type) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.type = type;
        this.frames = 0;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        if (this.type === "shield" && this.frames % player.shieldPower.reload === 0) {
            spawnShield(this.x, this.y, "shield-stationary");
        } else if (this.type === "auto" && this.frames % player.autoPower.reload === 0) {
                if (player.autoPower.list.includes("homing-auto")) {
                    spawnAutoProjectiles(this, player.autoPower.count, "Homing");
                } else {
                    spawnAutoProjectiles(this, player.autoPower.count, "Linear");
                }
        }
        this.frames++;
    }
}

function spawnShieldTurret(x, y) {
    turrets.push(new Turret(x, y, player.shieldPower.turretSize, "white", "shield"));
    console.log("turret charges: ", player.playerPower.turretCharge);
    turretsChargeText.innerHTML = `${player.playerPower.turretCharge}`;
}

function spawnAutoTurret(x, y) {
    turrets.push(new Turret(x, y, player.autoPower.turretSize, "white", "auto"));
    console.log("turret charges: ", player.playerPower.turretCharge);
    turretsChargeText.innerHTML = `${player.playerPower.turretCharge}`;
}