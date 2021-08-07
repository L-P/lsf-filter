(function() {
    const SELECTOR_CELL = '#root a.w-full[href^="/clip/"]';
    const SELECTOR_STREAMER_NAME = 'div div.py-3 div.flex.text-gray-600.text-sm div';
    const SELECTOR_TITLE = 'div div.py-3 div.font-bold';

    class Cell {
        constructor($el) {
            this.$el = $el;
            this.streamerName = this.$el.querySelector(SELECTOR_STREAMER_NAME).textContent;
            this.title = this.$el.querySelector(SELECTOR_TITLE).textContent;
        }
    }

    function findCells() {
        let cells = [];

        document.querySelectorAll(SELECTOR_CELL).forEach(v => {
            cells.push(new Cell(v));
        });

        return cells;
    }


    const cells = findCells();
})();
