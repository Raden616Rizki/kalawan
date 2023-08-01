window.addEventListener("keydown", (event) => {
    let k = event.key;
    // console.log(k);

    clicked = true;

    setTimeout(() => {
        if (k == 'a' || k == 'ArrowLeft') {
            // Move Left
            pacman.nextDirection = directionLeft;
            // console.log('Left');
        } else if (k == 'w' || k == 'ArrowUp') {
            // Move Up
            pacman.nextDirection = directionUp;
            // console.log('Up');
        } else if (k == 'd' || k == 'ArrowRight') {
            // Move Right
            pacman.nextDirection = directionRight;
            // console.log('Right');
        } else if (k == 's' || k == 'ArrowDown') {
            // Move Down
            pacman.nextDirection = directionBottom;
            // console.log('Down');
        } else if (k == 'Enter') {
            window.location.reload();
        }
    });
});