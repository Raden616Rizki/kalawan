document.addEventListener("click", handleClick);

function handleClick() {
    clicked = true;

    if(over) {
        window.location.reload();
    }
}