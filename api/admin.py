from django.contrib import admin
from .models import Product, Display, Size, Material, Order, OrderItem, ShippingAddress

admin.site.register(Product)
admin.site.register(Display)
admin.site.register(Size)
admin.site.register(Material)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
