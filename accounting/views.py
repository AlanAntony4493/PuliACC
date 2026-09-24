import requests
from bs4 import BeautifulSoup
from decimal import Decimal, ROUND_DOWN
from django.shortcuts import render


def dashboard(request):

    # =========================
    # GOODRETURNS
    # =========================

    goodreturns_url = "https://www.goodreturns.in/gold-rates/kerala.html"

    goodreturns_response = requests.get(
        goodreturns_url,
        headers={"User-Agent": "Mozilla/5.0"},
        timeout=10
    )

    goodreturns_soup = BeautifulSoup(
        goodreturns_response.text,
        "html.parser"
    )

    page_text = goodreturns_soup.get_text(" ", strip=True)

    good_returns_rate = None

    marker = "22k Gold ₹"

    if marker in page_text:
        value = page_text.split(marker, 1)[1].split("/gm", 1)[0]
        value = value.replace(",", "").strip()

        try:
            good_returns_rate = Decimal(value)
        except:
            good_returns_rate = None

    print("GoodReturns 916 Rate:", good_returns_rate)


    # =========================
    # IBJA
    # =========================

    ibja_url = "https://www.ibjarates.com/"

    ibja_response = requests.get(
        ibja_url,
        headers={"User-Agent": "Mozilla/5.0"},
        timeout=10
    )

    ibja_soup = BeautifulSoup(
        ibja_response.text,
        "html.parser"
    )

    ibja_text = ibja_soup.get_text(" ", strip=True)

    ibja_rate = None

    marker = "916 Purity "

    if marker in ibja_text:
        value = ibja_text.split(marker, 1)[1].split(" (1 Gram)", 1)[0]
        value = value.replace(",", "").strip()

        try:
            ibja_rate = Decimal(value)
        except:
            ibja_rate = None

    print("IBJA 916 Rate:", ibja_rate)


    # =========================
    # SELECT LOWER RATE
    # =========================

    if good_returns_rate is not None and ibja_rate is not None:

        if good_returns_rate <= ibja_rate:
            selected_rate = good_returns_rate
            selected_source = "GOODRETURNS"
        else:
            selected_rate = ibja_rate
            selected_source = "IBJA"

    else:
        selected_rate = None
        selected_source = "N/A"


    # =========================
    # CALCULATE 75%
    # =========================

    exact_75_rate = None
    rounded_rate = None

    if selected_rate is not None:

        exact_75_rate = selected_rate * Decimal("0.75")

        rounded_rate = (
            exact_75_rate / Decimal("100")
        ).to_integral_value(
            rounding=ROUND_DOWN
        ) * Decimal("100")


    # =========================
    # SEND TO HTML
    # =========================

    return render(
        request,
        "accounting/dashboard.html",
        {
            "good_returns_rate": good_returns_rate,
            "ibja_rate": ibja_rate,
            "selected_rate": selected_rate,
            "selected_source": selected_source,
            "exact_75_rate": exact_75_rate,
            "rounded_rate": rounded_rate,
        }
    )