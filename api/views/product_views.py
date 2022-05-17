from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from api.models import Product, Size, Material
from api.serializers import ProductSerializer, SizeSerializer, MaterialSerializer


@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user=user,
        name='',
        baseprice=0,
        surcharge=0,
        totalprice=0,
        category='',
        description='',
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.baseprice = data['baseprice']
    product.category = data['category']
    product.description = data['description']

    product.save()
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Product deleted')


@api_view(['POST'])
def uploadImage(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    product.save()
    return Response('Image was uploaded')


@api_view(['GET'])
def getSizes(request):
    sizes = Size.objects.all()
    serializer = SizeSerializer(sizes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getSize(request, pk):
    size = Size.objects.get(_id=pk)
    serializer = SizeSerializer(size, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createSize(request):
    user = request.user
    size = Size.objects.create(
        user=user,
        size='',
        surcharge=0,
        category='',
    )
    serializer = SizeSerializer(size, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateSize(request, pk):
    data = request.data
    size = Size.objects.get(_id=pk)

    size.size = data['size']
    size.surcharge = data['surcharge']
    size.category = data['category']

    size.save()
    serializer = SizeSerializer(size, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteSize(request, pk):
    size = Size.objects.get(_id=pk)
    size.delete()
    return Response('Size deleted')


@api_view(['GET'])
def getMaterials(request):
    materials = Material.objects.all()
    serializer = MaterialSerializer(materials, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getMaterial(request, pk):
    material = Material.objects.get(_id=pk)
    serializer = MaterialSerializer(material, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createMaterial(request):
    user = request.user
    material = Material.objects.create(
        user=user,
        material='',
        surcharge=0,
        category='',
    )
    serializer = MaterialSerializer(material, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateMaterial(request, pk):
    data = request.data
    material = Material.objects.get(_id=pk)

    material.material = data['material']
    material.surcharge = data['surcharge']
    material.category = data['category']

    material.save()
    serializer = MaterialSerializer(material, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteMaterial(request, pk):
    material = Material.objects.get(_id=pk)
    material.delete()
    return Response('Material deleted')
