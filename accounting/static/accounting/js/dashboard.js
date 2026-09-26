/* =========================================
   PULICALC - GOLD LOAN CALCULATOR
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       SYSTEM 75% RATE
       ========================================= */

    const systemRate = parseFloat(
        document.getElementById("systemRate").dataset.rate
    ) || 0;


    /* =========================================
       ELEMENTS
       ========================================= */

    const weightInput =
        document.getElementById("weight");

    const manualRateInput =
        document.getElementById("manualRate");

    const maximumAmount =
        document.getElementById("maximumAmount");

    const interestAmount =
        document.getElementById("interestAmount");


    /* =========================================
       INDIAN CURRENCY FORMAT
       ========================================= */

    function formatIndianMoney(
        value,
        decimals = 2
    ) {

        return "₹" +
            Number(value).toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                }
            );

    }


    /* =========================================
       FORMAT DJANGO RATES
       ========================================= */

    function formatDjangoRate(
        elementId,
        decimals = 2
    ) {

        const element =
            document.getElementById(elementId);

        if (!element) {
            return;
        }

        const value =
            parseFloat(element.dataset.rate);

        if (
            isNaN(value) ||
            value <= 0
        ) {

            element.textContent = "N/A";
            return;

        }

        element.textContent =
            formatIndianMoney(
                value,
                decimals
            );

    }


    /* =========================================
       FORMAT GOLD RATES
       ========================================= */

    formatDjangoRate(
        "goodReturnsRate",
        2
    );

    formatDjangoRate(
        "ibjaRate",
        2
    );

    formatDjangoRate(
        "selectedGoldRate",
        2
    );

    formatDjangoRate(
        "exact75Rate",
        2
    );


    /* =========================================
       FORMAT ROUNDED 75% RATE
       ========================================= */

    const roundedRateElement =
        document.getElementById(
            "roundedRate"
        );

    const roundedRateValue =
        parseFloat(
            roundedRateElement.dataset.rate
        );

    if (
        !isNaN(roundedRateValue) &&
        roundedRateValue > 0
    ) {

        roundedRateElement.textContent =
            formatIndianMoney(
                roundedRateValue,
                0
            ) + " / gram";

    } else {

        roundedRateElement.textContent =
            "₹0 / gram";

    }


    /* =========================================
       CLEAN DECIMAL INPUT
       ========================================= */

    function cleanDecimalInput(input) {

        let value = input.value;

        value = value.replace(
            /[^0-9.]/g,
            ""
        );

        const firstDot =
            value.indexOf(".");

        if (firstDot !== -1) {

            value =
                value.substring(
                    0,
                    firstDot + 1
                ) +

                value.substring(
                    firstDot + 1
                ).replace(
                    /\./g,
                    ""
                );

        }

        input.value = value;

    }


    /* =========================================
       INPUT EVENTS
       ========================================= */

    [
        weightInput,
        manualRateInput

    ].forEach(function (input) {

        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "e" ||
                    event.key === "E" ||
                    event.key === "+" ||
                    event.key === "-"
                ) {

                    event.preventDefault();

                }

            }
        );


        input.addEventListener(
            "input",
            function () {

                cleanDecimalInput(input);

                calculateAmount();

            }
        );


        input.addEventListener(
            "wheel",
            function (event) {

                event.preventDefault();

            }
        );

    });


    /* =========================================
       CALCULATE LOAN AMOUNT
       ========================================= */

    function calculateAmount() {

        const weight =
            parseFloat(
                weightInput.value
            );


        const manualRate =
            parseFloat(
                manualRateInput.value
            );


        let rate;


        /* Manual rate overrides system rate */

        if (
            !isNaN(manualRate) &&
            manualRate > 0
        ) {

            rate = manualRate;

        } else {

            rate = systemRate;

        }


        /* Invalid weight */

        if (
            isNaN(weight) ||
            weight <= 0
        ) {

            maximumAmount.textContent =
                "₹0";

            interestAmount.textContent =
                "₹0.00 / month";

            return;

        }


        /* Invalid rate */

        if (rate <= 0) {

            maximumAmount.textContent =
                "₹0";

            interestAmount.textContent =
                "₹0.00 / month";

            return;

        }


        /* Maximum loan amount */

        const amount =
            rate * weight;


        /* Monthly interest */

        const monthlyInterest =
            amount *
            12.5 /
            100 /
            12;


        maximumAmount.textContent =
            formatIndianMoney(
                amount,
                2
            );


        interestAmount.textContent =
            formatIndianMoney(
                monthlyInterest,
                2
            ) + " / month";

    }


    /* =========================================
       INITIAL CALCULATION
       ========================================= */

    calculateAmount();

});