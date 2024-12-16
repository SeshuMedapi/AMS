from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.services.punch_service import punch_in, punch_out, get_punch_data
from rest_framework.exceptions import ValidationError
from ..authentication import SkipAuth

class PunchInView(APIView):
    permission_classes = [SkipAuth]

    def get(self, request):
        user = request.user

        try:
            punch = get_punch_data(user)
            print(punch)
            return Response(punch, status=status.HTTP_200_OK)
        
        except ValidationError as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        user = request.user
        
        try:
            punch = punch_in(user)
            return Response({
                "message": "Punch-in successful",
                "punch_in_time": punch.punch_in_time
            }, status=status.HTTP_201_CREATED)
        
        except ValidationError as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PunchOutView(APIView):
    def post(self, request):
        user = request.user
        
        try:
            punch = punch_out(user)
            return Response({
                "message": "Punch-out successful",
                "punch_out_time": punch.punch_out_time
            }, status=status.HTTP_200_OK)
        
        except ValidationError as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)