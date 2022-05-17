from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from api.models import Display
from api.serializers import DisplaySerializer


@api_view(['GET'])
def getDisplays(request):
    displays = Display.objects.all()
    serializer = DisplaySerializer(displays, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getDisplay(request, pk):
    display = Display.objects.get(_id=pk)
    serializer = DisplaySerializer(display, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createDisplay(request):
    display = Display.objects.create(
        name='',
    )
    serializer = DisplaySerializer(display, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateDisplay(request, pk):
    data = request.data
    display = Display.objects.get(_id=pk)

    display.name = data['name']

    display.save()
    serializer = DisplaySerializer(display, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteDisplay(request, pk):
    display = Display.objects.get(_id=pk)
    display.delete()
    return Response('Display deleted')


@api_view(['POST'])
def uploadDisplay(request):
    data = request.data

    display_id = data['display_id']
    display = Display.objects.get(_id=display_id)

    display.image = request.FILES.get('image')
    display.save()
    return Response('Display image was uploaded')
