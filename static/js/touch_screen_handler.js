document.addEventListener("touchstart", handleTouch, false);
document.addEventListener("touchmove", handleTouch, false);

let touchStartX = 0;
let touchStartY = 0;

function handleTouch(event) {
    const touch = event.touches[0];

    if (event.type === "touchstart") {
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    } else if (event.type === "touchmove") {
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;

        const xDiff = touchStartX - touchEndX;
        const yDiff = touchStartY - touchEndY;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                // left
                pacman.nextDirection = directionLeft;
                // console.log('ArrowLeft');
            } else {
                // right
                pacman.nextDirection = directionRight;
                // console.log('ArrowRight');
            }
        } else {
            if (yDiff > 0) {
                // Up
                pacman.nextDirection = directionUp;
                // console.log('ArrowUp');
            } else {
                // Down
                pacman.nextDirection = directionBottom;
                // console.log('ArrowDown');
            }
        }
    }
}