from django.urls import path, include
from api.views import product_views as views

urlpatterns = [
    path('', views.getProducts, name="products"),
    path('create/', views.createProduct, name="product-create"),
    path('upload/', views.uploadImage, name="image-upload"),
    path('sizes/', views.getSizes, name="sizes"),
    path('materials/', views.getMaterials, name="materials"),
    path('<str:pk>/', views.getProduct, name="product"),
    path('update/<str:pk>/', views.updateProduct, name="product-update"),
    path('delete/<str:pk>/', views.deleteProduct, name="product-delete"),
    path('sizes/create/', views.createSize, name="size-create"),
    path('sizes/update/<str:pk>/', views.updateSize, name="size-update"),
    path('sizes/delete/<str:pk>/', views.deleteSize, name="size-delete"),
    path('sizes/<str:pk>/', views.getSize, name="size"),
    path('materials/create/', views.createMaterial, name="materials-create"),
    path('materials/update/<str:pk>/',
         views.updateMaterial, name="materials-update"),
    path('materials/delete/<str:pk>/',
         views.deleteMaterial, name="materials-delete"),
    path('materials/<str:pk>/', views.getMaterial, name="materials"),
]
