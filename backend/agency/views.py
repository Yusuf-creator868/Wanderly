from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *
from .serializer import *
from django.db.models import Count
from django.shortcuts import get_object_or_404
from translations.services import publish_tour

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_agency(request):
    agency = request.user.agency
    serializer = AgencySerializer(agency)
    return Response(serializer.data)



@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def agencyinfo(request, slug):
    agency = get_object_or_404(Agency, slug=slug)

    if request.method == "GET":
        serializer = AgencySerializer(
            agency,
            context={"request": request},
        )
        return Response(serializer.data)

    serializer = AgencySerializer(
        agency,
        data=request.data,
        partial=True,
        context={"request": request},
    )

    if serializer.is_valid():
        serializer.save()

        files = request.FILES.getlist("verification_documents")

        for file in files:
            AgencyVerificationDocument.objects.create(
                agency=agency,
                document=file,
            )

        return Response(
            AgencySerializer(
                agency,
                context={"request": request},
            ).data
        )

    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_verification_document(request, pk):
    document = get_object_or_404(AgencyVerificationDocument, id=pk)
    document.delete()
    return Response(status=204)


        
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_tour(request):
    agency = request.user.agency

    if agency.verification_status != "verified":
        return Response(
            {
                "verified": False,
                "message": "Your agency must be verified before creating tours."
            },
            status=403,
        )

    tour = Tour.objects.create(
        agency=agency,
        status="draft",
    )

    return Response(
        {
            "verified": True,
            "id": tour.id,
        },
        status=201,
    )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def tour_info(request, pk):
    tour = Tour.objects.get(id = pk, agency = request.user.agency)
    
    serializer = TourSerializer(tour, data = request.data, partial = True, context={"request": request})
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    print(serializer.errors)
    return Response(serializer.errors, status=400)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def upload_images(request, pk):
    tour = Tour.objects.get(id=pk, agency = request.user.agency)

    cover_image = request.data.get('cover_image')
    images = request.FILES.getlist("images")
    
    if cover_image:
        tour.cover_image = cover_image
        tour.save()

    for image in images:

        TourImage.objects.create(
            tour=tour,
            image=image,
        )
    

    return Response({"message": "Images uploaded"})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_tour_image(request, pk):
    TourImage.objects.get(id=pk, tour__agency=request.user.agency).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_hotel(request, pk):
    tour = Tour.objects.get(id=pk, agency = request.user.agency)
    
    data = request.data.copy()

    data["tour"] = tour.id

    serializer = HotelSerializer(data=data)

    if serializer.is_valid():

        hotel = serializer.save()
        
        images = request.FILES.getlist("images")

        for image in images:

            HotelImage.objects.create(
                hotel=hotel,
                image=image
            )
            
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )
    
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_hotel(request, pk):
    hotel = Hotel.objects.get(id=pk, tour__agency=request.user.agency)

    serializer = HotelSerializer(hotel, data=request.data, partial=True)

    if serializer.is_valid():
        hotel = serializer.save()

        # allow adding more images on update, same as create
        images = request.FILES.getlist("images")
        for image in images:
            HotelImage.objects.create(hotel=hotel, image=image)

        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_hotel(request, pk):
    Hotel.objects.get(id=pk, tour__agency=request.user.agency).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_hotel_image(request, pk):
    HotelImage.objects.get(id=pk, hotel__tour__agency=request.user.agency).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_itinerary(request, pk):
    tour = Tour.objects.get(id=pk, agency = request.user.agency)
    
    data = request.data.copy()

    data["tour"] = tour.id
    
    serializer = ItinerarySerializer(data = data)
    
    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_itinerary(request, pk):
    itinerary = Itinerary.objects.get(id=pk, tour__agency=request.user.agency)

    serializer = ItinerarySerializer(itinerary, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_itinerary(request, pk):
    Itinerary.objects.get(id=pk, tour__agency=request.user.agency).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)





    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_departure(request, pk):
    tour = Tour.objects.get(id=pk, agency = request.user.agency)
    
    data = request.data.copy()

    data["tour"] = tour.id
    
    serializer = DepartureSerializer(data = data)
    
    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_departure(request, pk):
    departure = Departure.objects.get(id=pk, tour__agency=request.user.agency)

    serializer = DepartureSerializer(departure, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_departure(request, pk):
    Departure.objects.get(id=pk, tour__agency=request.user.agency).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def publish_tour_view(request, pk):
    tour = (
        Tour.objects
        .select_related("agency")
        .prefetch_related(
            "hotels",
            "itinerary",
            "included_items",
            "excluded_items",
        )
        .get(
            id=pk,
            agency=request.user.agency,
        )
    )
    
    publish_tour(tour)
    
    return Response({
        "message": "Tour published successfully",
        "status": tour.status
    })
    
    
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_agency_tour(request):
    tours = Tour.objects.filter(agency = request.user.agency)
    
    serializer = AgencyTourListSerializer(tours, many = True)
    
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_tour(request, pk):
    tour = Tour.objects.get(id = pk, agency = request.user.agency)
    tour.delete()
    return Response({"message": "Deleted successfully"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_mytour_data(request):
    tours = Tour.objects.values('status').annotate(count = Count('id'))
    
    return Response(tours)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tour_details(request, pk):
    tour = Tour.objects.get(agency = request.user.agency, id = pk)
    serializer = GetTourDetailSerializer(tour, context={"request": request})
    return Response(serializer.data)
    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tour(request, pk):

    tour = Tour.objects.get(
        id=pk,
        agency=request.user.agency
    )

    serializer = TourSerializer(tour, context={"request": request})

    return Response(serializer.data)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_agency_bookings(request):
    agency = get_object_or_404(
        Agency,
        owner=request.user
    )

    bookings = (
        Booking.objects
        .filter(tour__agency=agency)
        .select_related(
            "tour",
            "departure",
            "hotel",
            "user",
        )
        .prefetch_related("travelers_info")
        .order_by("-created_at")
    )

    serializer = GetBookingSerializer(bookings, many=True)
    return Response(serializer.data)

    
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_booking(request, booking_id):

    agency = request.user.agency

    booking = get_object_or_404(
        Booking,
        id=booking_id,
        tour__agency=agency,
    )

    if booking.status != "pending":
        return Response(
            {"detail": "Booking has already been processed."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    departure = booking.departure

    if departure.available_seats < booking.travelers:
        return Response(
            {"detail": "Not enough seats available."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    departure.available_seats -= booking.travelers
    departure.save(update_fields=["available_seats"])

    booking.status = "confirmed"
    booking.save(update_fields=["status"])

    return Response(
        {"detail": "Booking approved successfully."},
        status=status.HTTP_200_OK,
    )
    
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_booking(request, booking_id):

    agency = request.user.agency

    booking = get_object_or_404(
        Booking,
        id=booking_id,
        tour__agency=agency,
    )

    if booking.status != "pending":
        return Response(
            {"detail": "Booking has already been processed."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    booking.status = "cancelled"
    booking.save(update_fields=["status"])

    return Response(
        {"detail": "Booking rejected successfully."},
        status=status.HTTP_200_OK,
    )