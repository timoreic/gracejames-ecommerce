"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('', TemplateView.as_view(template_name='index.html')),
    path('prints', TemplateView.as_view(template_name='index.html')),
    path('about', TemplateView.as_view(template_name='index.html')),
    path('login', TemplateView.as_view(template_name='index.html')),
    path('register', TemplateView.as_view(template_name='index.html')),
    path('profile', TemplateView.as_view(template_name='index.html')),
    path('shipping', TemplateView.as_view(template_name='index.html')),
    path('placeorder', TemplateView.as_view(template_name='index.html')),
    path('order/<str:pk>', TemplateView.as_view(template_name='index.html')),
    path('product/<str:pk>', TemplateView.as_view(template_name='index.html')),
    path('cart/<str:pk>', TemplateView.as_view(template_name='index.html')),
    path('cart', TemplateView.as_view(template_name='index.html')),

    path('admin/users', TemplateView.as_view(template_name='index.html')),
    path('admin/products', TemplateView.as_view(template_name='index.html')),
    path('admin/product/<str:pk>/edit',
         TemplateView.as_view(template_name='index.html')),
    path('admin/orders', TemplateView.as_view(template_name='index.html')),
    path('admin/sizes', TemplateView.as_view(template_name='index.html')),
    path('admin/size/<str:pk>/edit',
         TemplateView.as_view(template_name='index.html')),
    path('admin/materials', TemplateView.as_view(template_name='index.html')),
    path('admin/material/<str:pk>/edit',
         TemplateView.as_view(template_name='index.html')),
    path('admin/displays', TemplateView.as_view(template_name='index.html')),
    path('admin/display/<str:pk>/edit',
         TemplateView.as_view(template_name='index.html')),

    path('api/products/', include('api.urls.product_urls')),
    path('api/users/', include('api.urls.user_urls')),
    path('api/orders/', include('api.urls.order_urls')),
    path('api/displays/', include('api.urls.display_urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
