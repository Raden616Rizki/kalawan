class Pacman {
    constructor(x, y, width, height, speed, direction) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = direction;
        this.nextDirection = this.direction;
        this.currentFrame = 1;
        this.frameCount = 7;

        setInterval(() => {
            this.changeAnimation();
        }, 100);
    }

    moveProcess() {
        this.changeDirectionIfPossible();
        this.moveForwards();
        // console.log('x : ' + this.x + ' y : ' + this.y);
        if (this.checkCollision()) {
            this.moveBackwards();
        }
    }

    eat() {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (
                    map[i][j] == 2 &&
                    this.getMapX() == j &&
                    this.getMapY() == i
                ) {
                    map[i][j] = 0;

                    if (openingFinished) {
                        chomp.play();
                    }
                    score += 1;
                } else if (
                    map[i][j] == 3 &&
                    this.getMapX() == j &&
                    this.getMapY() == i
                ) {
                    let xValue = j * 20;
                    let yValue = i * 20;
                    let location = {x: xValue, y: yValue};

                    let index = portal.findIndex((item) => item.x == location.x && item.y == location.y);

                    if (
                        this.x == xValue &&
                        this.y == yValue
                    ) {
                        let oppositeIndex = portal.length - (1 + index);
                        let xNew = portal[oppositeIndex].x;
                        let yNew = portal[oppositeIndex].y;

                        // Change Location
                        createNewPacman(xNew, yNew, this.direction);
                    }
                }
            }
        }
    }

    moveBackwards() {
        switch (this.direction) {
            case directionRight:
                this.x -= this.speed;
                break;
            case directionUp:
                this.y += this.speed;
                break;
            case directionLeft:
                this.x += this.speed;
                break;
            case directionBottom:
                this.y -= this.speed;
                break;
        }
    }

    moveForwards() {
        switch (this.direction) {
            case directionRight:
                this.x += this.speed;
                break;
            case directionUp:
                this.y -= this.speed;
                break;
            case directionLeft:
                this.x -= this.speed;
                break;
            case directionBottom:
                this.y += this.speed;
                break;
        }
    }

    checkCollision() {
        if (
            map[this.getMapY()][this.getMapX()] == 1 ||
            map[this.getMapYRightSide()][this.getMapX()] == 1 ||
            map[this.getMapY()][this.getMapXRightSide()] == 1 ||
            map[this.getMapYRightSide()][this.getMapXRightSide()] == 1
        ) {
            return true;
        }

        return false;
    }

    checkGhostCollision() {
        for (let i = 0; i < ghosts.length; i++) {
            let ghost = ghosts[i];

            if (
                ghost.getMapX() == this.getMapX() &&
                ghost.getMapY() == this.getMapY()
            ) {
                return true;
            }
        }

        return false;
    }

    changeDirectionIfPossible() {
        if (this.direction == this.nextDirection) {
            return;
        }

        let tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForwards();
        if (this.checkCollision()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
    }

    changeAnimation() {
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    draw() {
        canvasContext.save();
        canvasContext.translate(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2
        );
        canvasContext.rotate((this.direction * 90 * Math.PI) / 180);
        
        canvasContext.translate(
            -this.x - oneBlockSize / 2,
            -this.y - oneBlockSize / 2
        );

        canvasContext.drawImage(
            pacmanFrames,
            (this.currentFrame - 1) * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            this.x,
            this.y,
            this.width,
            this.height
        );

        canvasContext.restore();
    }

    getMapX() {
        return parseInt(this.x / oneBlockSize);
    }

    getMapY() {
        return parseInt(this.y / oneBlockSize);
    }

    getMapXRightSide() {
        return parseInt((this.x + 0.9999 * oneBlockSize) / oneBlockSize)
    }

    getMapYRightSide() {
        return parseInt((this.y + 0.9999 * oneBlockSize) / oneBlockSize)
    }
}