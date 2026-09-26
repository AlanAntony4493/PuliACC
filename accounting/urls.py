from django.urls import path

from . import views


urlpatterns = [

    # Home
    path(
        "",
        views.dashboard,
        name="dashboard"
    ),

    # Cash Denomination
    path(
        "denomination/",
        views.denomination,
        name="denomination"
    ),

]