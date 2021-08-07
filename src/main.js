"use strict";

(function() {
    const SELECTOR_CELL = '#root a.w-full[href^="/clip/"]';
    const SELECTOR_STREAMER_NAME = "div div.py-3 div.flex.text-gray-600.text-sm div";
    const SELECTOR_TITLE = "div div.py-3 div.font-bold";
    const BUTTON_ICON_SRC = browser.runtime.getURL("icon-rm.svg");

    class Cell {
        constructor($el) {
            this.$el = $el;
            this.streamerName = this.$el.querySelector(SELECTOR_STREAMER_NAME).innerText.trim();
            this.title = this.$el.querySelector(SELECTOR_TITLE).innerText.trim();
        }

        injectRMButton() {
            if (this.$el.dataset.injected) {
                return;
            }
            this.$el.dataset.injected = true;

            const $name = this.$el.querySelector(SELECTOR_STREAMER_NAME);
            $name.insertAdjacentHTML(
                "afterbegin",
                `<a href="##"><img
                    data-streamer-name="${this.streamerName}"
                    class="js-lsf-filter-streamer lsf-filter-icon-rm"
                    src="${BUTTON_ICON_SRC}" />
                </a>`
            );

            const $btn = this.$el.querySelector(".js-lsf-filter-streamer");
            $btn.addEventListener("click", e => handleAddFilter(e, this));

            // Prevent click going through and change to the clip page.
            $btn.addEventListener("mouseup", () => false);
        }

        hide() {
            this.$el.classList.add('lsf-filter-hidden');
        }
    }

    function findCells() {
        let cells = [];

        document.querySelectorAll(SELECTOR_CELL).forEach(v => {
            cells.push(new Cell(v));
        });

        return cells;
    }

    async function handleAddFilter(e, cell) {
        e.stopPropagation();
        cell.hide();

        let streamers = (await browser.storage.local.get("streamers")).streamers || {};
        streamers[cell.streamerName] = true;
        browser.storage.local.set({streamers});
    }

    async function findAndHideCells() {
        let streamers = (await browser.storage.local.get("streamers")).streamers || {};

        const cells = findCells();
        cells.forEach(cell => {
            if (streamers[cell.streamerName]) {
                cell.hide();
                return;
            }

            cell.injectRMButton();
        });
    }

    function addResetButton() {
        const $search = document.querySelector('#root nav a[href="/search"]');
        $search.insertAdjacentHTML(
            "afterend",
            `<a class="js-lsf-filter-reset px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-red-100 hover:text-red-700"
            href="##">Reset filters</a>`
        );
        document.querySelector('.js-lsf-filter-reset').addEventListener('click', () => {
            browser.storage.local.remove("streamers");
            document.querySelectorAll('.lsf-filter-hidden').forEach($el => {
                $el.classList.remove('lsf-filter-hidden');
            });
        });
    }

    addResetButton();
    // HACK, too lazy to properly wait for dynamic loading to be done.
    setInterval(() => {
        findAndHideCells();
    }, 250);
})();
