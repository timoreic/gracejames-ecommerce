from django.urls import path, include
from api.views import display_views as views

urlpatterns = [
    path('', views.getDisplays, name="displays"),
    path('create/', views.createDisplay, name="display-create"),
    path('upload/', views.uploadDisplay, name="display-image-upload"),
    path('<str:pk>/', views.getDisplay, name="display"),
    path('update/<str:pk>/', views.updateDisplay, name="display-update"),
    path('delete/<str:pk>/', views.deleteDisplay, name="display-delete"),
]
