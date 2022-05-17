from django.urls import path, include
from api.views import user_views as views

urlpatterns = [
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('', views.getUsers, name="users"),
    path('delete/<str:pk>/', views.deleteUser, name="user-delete"),
]
