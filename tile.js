class Tile {
    constructor(value) {
        this.value = value;
    }

    createElement() {
        const element = document.createElement('div');
        element.classList.add('tile');
        element.classList.add(`tile-${this.value}`);
        element.textContent = this.value;
        return element;
    }
}