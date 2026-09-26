document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       INPUTS
    ========================================================= */

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


    /* =========================================================
       OUTPUT ELEMENTS
    ========================================================= */

    const totalNotesElement =
        document.getElementById("totalNotes");

    const totalCoinsElement =
        document.getElementById("totalCoins");

    const notesSummary =
        document.getElementById("notesSummary");

    const coinsCalculationQuantity =
        document.getElementById("coinsCalculationQuantity");

    const coinsSummaryAmount =
        document.getElementById("coinsSummaryAmount");

    const summaryFirstTotal =
        document.getElementById("summaryFirstTotal");

    const summaryCoinsLocker =
        document.getElementById("summaryCoinsLocker");

    const summaryNotesLocker =
        document.getElementById("summaryNotesLocker");

    const summarySecondTotal =
        document.getElementById("summarySecondTotal");

    const summaryLessSkk =
        document.getElementById("summaryLessSkk");

    const finalAmount =
        document.getElementById("finalAmount");


    /* =========================================================
       TEMPORARY SAVED DATA
    ========================================================= */

    const STORAGE_KEY =
        "pulikot_cash_denomination_draft";


    /* =========================================================
       FORMAT CURRENCY
    ========================================================= */

    function formatCurrency(value) {

        const number =
            Number(value) || 0;

        return "₹" +
            number.toLocaleString("en-IN", {
                maximumFractionDigits: 0
            });
    }


    /* =========================================================
       GET INPUT VALUE
    ========================================================= */

    function getInputValue(input) {

        const value =
            parseInt(input.value, 10);

        if (isNaN(value) || value < 0) {
            return 0;
        }

        return value;
    }


    /* =========================================================
       CALCULATE NOTES
    ========================================================= */

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
                row.querySelector(".note-amount");

            amountElement.textContent =
                formatCurrency(amount);


            totalNotes += amount;


            if (quantity > 0) {

                summaryHTML += `
                    <div class="summary-line">

                        <span>
                            ${denomination}
                        </span>

                        <span>×</span>

                        <span>
                            ${quantity}
                        </span>

                        <span>=</span>

                        <strong>
                            ${formatCurrency(amount)}
                        </strong>

                    </div>
                `;
            }

        });


        if (summaryHTML === "") {

            summaryHTML = `
                <div class="summary-line summary-empty">

                    <span>No notes entered</span>

                    <span>—</span>

                    <span>—</span>

                    <span>—</span>

                    <strong>₹0</strong>

                </div>
            `;
        }


        notesSummary.innerHTML =
            summaryHTML;

        totalNotesElement.textContent =
            formatCurrency(totalNotes);

        return totalNotes;
    }


    /* =========================================================
       CALCULATE COINS
    ========================================================= */

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
                row.querySelector(".coin-amount");

            amountElement.textContent =
                formatCurrency(amount);

            denominationCoinTotal += amount;

        });


        const manualCoinTotal =
            totalCoinsInput.value.trim() !== ""
                ? getInputValue(totalCoinsInput)
                : denominationCoinTotal;


        totalCoinsElement.textContent =
            formatCurrency(manualCoinTotal);

        coinsCalculationQuantity.textContent =
            formatCurrency(manualCoinTotal);

        coinsSummaryAmount.textContent =
            formatCurrency(manualCoinTotal);

        return manualCoinTotal;
    }


    /* =========================================================
       UPDATE CALCULATION
    ========================================================= */

    function updateCalculation() {

        const totalNotes =
            calculateNotes();

        const totalCoins =
            calculateCoins();


        const firstTotal =
            totalNotes + totalCoins;


        summaryFirstTotal.textContent =
            formatCurrency(firstTotal);


        const lockerCoins =
            getInputValue(coinsInLocker);

        const lockerNotes =
            getInputValue(notesInLocker);


        summaryCoinsLocker.textContent =
            formatCurrency(lockerCoins);

        summaryNotesLocker.textContent =
            formatCurrency(lockerNotes);


        const secondTotal =
            firstTotal +
            lockerCoins +
            lockerNotes;


        summarySecondTotal.textContent =
            formatCurrency(secondTotal);


        const skkAmount =
            getInputValue(lessDueToSkk);


        summaryLessSkk.textContent =
            formatCurrency(skkAmount);


        const final =
            secondTotal - skkAmount;


        finalAmount.textContent =
            formatCurrency(
                Math.max(final, 0)
            );
    }


    /* =========================================================
       ALL INPUTS
    ========================================================= */

    const allInputs =
        document.querySelectorAll(
            'input[type="number"]'
        );


    /* =========================================================
       STORAGE IDENTIFIER
    ========================================================= */

    function getStorageId(input) {

        if (input.id) {
            return input.id;
        }


        if (input.classList.contains("note-input")) {

            return "note-" +
                input.dataset.value;
        }


        if (input.classList.contains("coin-input")) {

            return "coin-" +
                input.dataset.value;
        }


        return null;
    }


    /* =========================================================
       CHECK WHETHER THERE IS ACTUAL DATA
    ========================================================= */

    function hasSavedData(data) {

        if (!data) {
            return false;
        }


        return Object.values(data).some(function (value) {

            return (
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ""
            );

        });
    }


    /* =========================================================
       SAVE CURRENT VALUES
    ========================================================= */

    function saveDraft() {

        const draft = {};


        allInputs.forEach(function (input) {

            const storageId =
                getStorageId(input);

            if (!storageId) {
                return;
            }


            draft[storageId] =
                input.value;
        });


        if (hasSavedData(draft)) {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(draft)
            );

        } else {

            localStorage.removeItem(
                STORAGE_KEY
            );
        }
    }


    /* =========================================================
       LOAD SAVED VALUES
    ========================================================= */

    function loadDraft() {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return false;
        }


        try {

            const draft =
                JSON.parse(saved);


            allInputs.forEach(function (input) {

                const storageId =
                    getStorageId(input);

                if (!storageId) {
                    return;
                }


                if (
                    Object.prototype.hasOwnProperty.call(
                        draft,
                        storageId
                    )
                ) {

                    input.value =
                        draft[storageId];
                }

            });


            updateCalculation();

            return true;

        } catch (error) {

            localStorage.removeItem(
                STORAGE_KEY
            );

            return false;
        }
    }


    /* =========================================================
       CLEAR SAVED DRAFT
    ========================================================= */

    function clearSavedDraft() {

        localStorage.removeItem(
            STORAGE_KEY
        );
    }


    /* =========================================================
       POPUP STYLES
    ========================================================= */

    const popupStyle =
        document.createElement("style");

    popupStyle.textContent = `

        .denomination-recovery-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 20px;

            background: rgba(0, 45, 43, 0.55);

            backdrop-filter: blur(5px);
        }


        .denomination-recovery-modal {
            width: min(440px, 100%);

            background: #ffffff;

            border-radius: 18px;

            padding: 30px 28px 26px;

            box-shadow:
                0 20px 60px rgba(0, 0, 0, 0.22);

            text-align: center;

            animation:
                denominationRecoveryIn
                0.22s ease-out;
        }


        .denomination-recovery-icon {
            width: 58px;
            height: 58px;

            margin: 0 auto 18px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;

            background: #e5f5f3;

            color: #12625e;

            font-size: 27px;
            font-weight: 700;
        }


        .denomination-recovery-modal h3 {
            margin: 0 0 9px;

            color: #164f4d;

            font-size: 22px;
            font-weight: 700;
        }


        .denomination-recovery-modal p {
            margin: 0 auto 24px;

            max-width: 350px;

            color: #647777;

            font-size: 14px;
            line-height: 1.6;
        }


        .denomination-recovery-actions {
            display: flex;
            gap: 12px;

            justify-content: center;
        }


        .denomination-recovery-actions button {
            min-height: 44px;

            padding: 10px 18px;

            border-radius: 9px;

            font-family: inherit;
            font-size: 14px;
            font-weight: 600;

            cursor: pointer;

            transition:
                transform 0.15s ease,
                box-shadow 0.15s ease;
        }


        .denomination-recovery-actions button:hover {
            transform: translateY(-1px);
        }


        .recovery-new-button {
            border: 1px solid #d7e2e1;

            background: #ffffff;

            color: #526766;
        }


        .recovery-continue-button {
            border: 1px solid #12625e;

            background: #12625e;

            color: #ffffff;

            box-shadow:
                0 5px 14px rgba(18, 98, 94, 0.20);
        }


        @keyframes denominationRecoveryIn {

            from {
                opacity: 0;
                transform: translateY(10px) scale(0.98);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }

        }


        @media (max-width: 480px) {

            .denomination-recovery-modal {
                padding: 26px 20px 22px;
            }


            .denomination-recovery-actions {
                flex-direction: column-reverse;
            }


            .denomination-recovery-actions button {
                width: 100%;
            }

        }

    `;

    document.head.appendChild(popupStyle);


    /* =========================================================
       SHOW RECOVERY POPUP
    ========================================================= */

    function showRecoveryPopup() {

        const overlay =
            document.createElement("div");

        overlay.className =
            "denomination-recovery-overlay";


        overlay.innerHTML = `

            <div
                class="denomination-recovery-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="recoveryTitle"
            >

                <div class="denomination-recovery-icon">
                    ↻
                </div>

                <h3 id="recoveryTitle">
                    Continue Working?
                </h3>

                <p>
                    We found your previous cash
                    denomination entries. Would you
                    like to continue where you left off?
                </p>

                <div class="denomination-recovery-actions">

                    <button
                        type="button"
                        class="recovery-new-button"
                        id="recoveryStartNew"
                    >
                        Start New
                    </button>

                    <button
                        type="button"
                        class="recovery-continue-button"
                        id="recoveryContinue"
                    >
                        Continue Working
                    </button>

                </div>

            </div>
        `;


        document.body.appendChild(overlay);


        const continueButton =
            document.getElementById(
                "recoveryContinue"
            );

        const startNewButton =
            document.getElementById(
                "recoveryStartNew"
            );


        continueButton.addEventListener(
            "click",
            function () {

                loadDraft();

                overlay.remove();
            }
        );


        startNewButton.addEventListener(
            "click",
            function () {

                allInputs.forEach(
                    function (input) {
                        input.value = "";
                    }
                );


                clearSavedDraft();

                updateCalculation();

                overlay.remove();
            }
        );


        continueButton.focus();
    }


    /* =========================================================
       INPUT EVENTS
    ========================================================= */

    allInputs.forEach(function (input) {

        input.addEventListener(
            "input",
            function () {

                updateCalculation();

                saveDraft();
            }
        );


        input.addEventListener(
            "wheel",
            function (event) {

                event.preventDefault();

            },
            {
                passive: false
            }
        );


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

                saveDraft();
            }
        );

    });


    /* =========================================================
       CLEAR ALL
    ========================================================= */

    clearButton.addEventListener(
        "click",
        function () {

            allInputs.forEach(
                function (input) {

                    input.value = "";
                }
            );


            clearSavedDraft();

            updateCalculation();
        }
    );


    /* =========================================================
       INITIAL CALCULATION
    ========================================================= */

    updateCalculation();


    /* =========================================================
       CHECK FOR PREVIOUS WORK
    ========================================================= */

    const existingDraft =
        localStorage.getItem(STORAGE_KEY);


    if (existingDraft) {

        try {

            const draft =
                JSON.parse(existingDraft);


            if (hasSavedData(draft)) {

                showRecoveryPopup();

            } else {

                clearSavedDraft();
            }

        } catch (error) {

            clearSavedDraft();
        }
    }

});