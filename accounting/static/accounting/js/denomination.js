document.addEventListener("DOMContentLoaded", function () {

    const noteInputs =
        document.querySelectorAll(".note-input");

    const coinInputs =
        document.querySelectorAll(".coin-input");

    const totalCoinsInput =
        document.getElementById("totalCoinsInput");

    const notesInLocker =
        document.getElementById("notesInLocker");

    const coinsInLocker =
        document.getElementById("coinsInLocker");

    const lessDueToSkk =
        document.getElementById("lessDueToSkk");

    const clearButton =
        document.getElementById("clearDenomination");

    const totalNotesElement =
        document.getElementById("totalNotes");

    const totalCoinsElement =
        document.getElementById("totalCoins");

    const notesSummary =
        document.getElementById("notesSummary");

    const coinsCalculationQuantity =
        document.getElementById(
            "coinsCalculationQuantity"
        );

    const coinsSummaryAmount =
        document.getElementById(
            "coinsSummaryAmount"
        );

    const summaryFirstTotal =
        document.getElementById(
            "summaryFirstTotal"
        );

    const summaryCoinsLocker =
        document.getElementById(
            "summaryCoinsLocker"
        );

    const summaryNotesLocker =
        document.getElementById(
            "summaryNotesLocker"
        );

    const summarySecondTotal =
        document.getElementById(
            "summarySecondTotal"
        );

    const summaryLessSkk =
        document.getElementById(
            "summaryLessSkk"
        );

    const finalAmount =
        document.getElementById(
            "finalAmount"
        );


    /* =====================================================
       FORMAT CURRENCY
       ===================================================== */

    function formatCurrency(value) {

        const number =
            Number(value) || 0;

        return "₹" +
            number.toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits: 0
                }
            );
    }


    /* =====================================================
       GET INPUT VALUE
       ===================================================== */

    function getInputValue(input) {

        const value =
            parseInt(input.value, 10);

        if (isNaN(value) || value < 0) {
            return 0;
        }

        return value;
    }


    /* =====================================================
       CALCULATE NOTES
       ===================================================== */

    function calculateNotes() {

        let totalNotes = 0;

        let summaryHTML = "";


        noteInputs.forEach(function (input) {

            const denomination =
                Number(input.dataset.value);

            const quantity =
                getInputValue(input);

            const amount =
                denomination * quantity;


            const row =
                input.closest("tr");


            const amountElement =
                row.querySelector(
                    ".note-amount"
                );


            amountElement.textContent =
                formatCurrency(amount);


            totalNotes += amount;


            /*
             * Only show denominations
             * that have been entered.
             */

            if (quantity > 0) {

                summaryHTML += `
                    <div class="summary-line">

                        <span>
                            ${denomination}
                        </span>

                        <span>
                            ×
                        </span>

                        <span>
                            ${quantity}
                        </span>

                        <span>
                            =
                        </span>

                        <strong>
                            ${formatCurrency(amount)}
                        </strong>

                    </div>
                `;
            }

        });


        /*
         * If no notes have been entered,
         * show one empty row.
         */

        if (summaryHTML === "") {

            summaryHTML = `
                <div class="summary-line summary-empty">

                    <span>
                        No notes entered
                    </span>

                    <span>
                        —
                    </span>

                    <span>
                        —
                    </span>

                    <span>
                        —
                    </span>

                    <strong>
                        ₹0
                    </strong>

                </div>
            `;
        }


        notesSummary.innerHTML =
            summaryHTML;


        totalNotesElement.textContent =
            formatCurrency(totalNotes);


        return totalNotes;
    }


    /* =====================================================
       CALCULATE COINS
       ===================================================== */

    function calculateCoins() {

        let denominationCoinTotal = 0;


        coinInputs.forEach(function (input) {

            const denomination =
                Number(input.dataset.value);

            const quantity =
                getInputValue(input);

            const amount =
                denomination * quantity;


            const row =
                input.closest("tr");


            const amountElement =
                row.querySelector(
                    ".coin-amount"
                );


            amountElement.textContent =
                formatCurrency(amount);


            denominationCoinTotal += amount;

        });


        /*
         * If Total Coins is manually entered,
         * use that value.
         *
         * Otherwise use the calculated
         * total of ₹5, ₹2 and ₹1 coins.
         */

        const manualCoinTotal =
            totalCoinsInput.value.trim() !== ""
                ? getInputValue(totalCoinsInput)
                : denominationCoinTotal;


        totalCoinsElement.textContent =
            formatCurrency(
                manualCoinTotal
            );


        /*
         * Value displayed in the
         * Calculation Summary.
         */

        coinsCalculationQuantity.textContent =
            formatCurrency(
                manualCoinTotal
            );


        coinsSummaryAmount.textContent =
            formatCurrency(
                manualCoinTotal
            );


        return manualCoinTotal;
    }


    /* =====================================================
       UPDATE ALL CALCULATIONS
       ===================================================== */

    function updateCalculation() {

        const totalNotes =
            calculateNotes();


        const totalCoins =
            calculateCoins();


        /*
         * First total:
         *
         * Notes + Coins
         */

        const firstTotal =
            totalNotes +
            totalCoins;


        summaryFirstTotal.textContent =
            formatCurrency(
                firstTotal
            );


        /*
         * Locker amounts
         */

        const lockerCoins =
            getInputValue(
                coinsInLocker
            );


        const lockerNotes =
            getInputValue(
                notesInLocker
            );


        summaryCoinsLocker.textContent =
            formatCurrency(
                lockerCoins
            );


        summaryNotesLocker.textContent =
            formatCurrency(
                lockerNotes
            );


        /*
         * Second total:
         *
         * First Total
         * + Coins in Locker
         * + Notes in Locker
         */

        const secondTotal =
            firstTotal +
            lockerCoins +
            lockerNotes;


        summarySecondTotal.textContent =
            formatCurrency(
                secondTotal
            );


        /*
         * Less Due to SKK
         */

        const skkAmount =
            getInputValue(
                lessDueToSkk
            );


        summaryLessSkk.textContent =
            formatCurrency(
                skkAmount
            );


        /*
         * Final Amount:
         *
         * Second Total
         * - Less Due to SKK
         */

        const final =
            secondTotal -
            skkAmount;


        finalAmount.textContent =
            formatCurrency(
                Math.max(final, 0)
            );
    }


    /* =====================================================
       INPUT BEHAVIOUR
       ===================================================== */

    const allInputs =
        document.querySelectorAll(
            'input[type="number"]'
        );


    allInputs.forEach(function (input) {


        /*
         * Recalculate immediately
         * when the value changes.
         */

        input.addEventListener(
            "input",
            updateCalculation
        );


        /*
         * Prevent mouse-wheel from
         * changing number inputs.
         */

        input.addEventListener(
            "wheel",
            function (event) {

                event.preventDefault();

            },
            {
                passive: false
            }
        );


        /*
         * Prevent Arrow Up / Arrow Down
         * from changing number inputs.
         */

        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "ArrowUp" ||
                    event.key === "ArrowDown"
                ) {

                    event.preventDefault();

                }

            }
        );


        /*
         * Validate value when the
         * input loses focus / changes.
         */

        input.addEventListener(
            "change",
            function () {

                if (
                    input.value !== "" &&
                    Number(input.value) < 0
                ) {

                    input.value = 0;

                }

                updateCalculation();

            }
        );

    });


    /* =====================================================
       CLEAR ALL
       ===================================================== */

    clearButton.addEventListener(
        "click",
        function () {

            allInputs.forEach(
                function (input) {

                    input.value = "";

                }
            );


            updateCalculation();

        }
    );


    /* =====================================================
       INITIAL CALCULATION
       ===================================================== */

    updateCalculation();

});