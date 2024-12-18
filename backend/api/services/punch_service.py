from api.api_models.punch_in_out import PunchInOut
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from geopy.geocoders import Nominatim
import requests

def get_location_details(lat, lon):
    geolocator = Nominatim(user_agent="jivass")
    location = geolocator.reverse((lat, lon), exactly_one=True)
    if location:
        main_address = location.raw['address']
        formatted_address = f"{main_address.get('suburb', '')}, {main_address.get('city', '')}, {main_address.get('state', '')}"
        print(f"Main Address: {formatted_address}")
        return formatted_address
    else:
        print("No location details found.")
        return None

def get_punch_data(user):
    today = timezone.now().date()
    data = {"status" : "PunchIN", "punchin" : "", "punchout" : ""}
    punch = PunchInOut.objects.filter(user_id=user.id)

    if punch:
        latest_punch = punch.last()
        if latest_punch.latitude and latest_punch.longitude:
            user_loc = get_location_details(latest_punch.latitude, latest_punch.longitude)
        else:
            public_ip = get_public_ip()
            if public_ip:
                lat, lon = get_ip_location(public_ip) 
                user_loc = get_location_details(lat,lon)
            else:
                user_loc = None
        data['punchzone'] = user_loc

        if latest_punch.date < today or not latest_punch:
            data["status"] = "PunchIN"
        elif latest_punch.date <= today and not latest_punch.punch_out_time:
            data["status"] = "PunchOUT"
            data["punchin"] = latest_punch.punch_in_time
        else:
            data["status"] = "LoggedOut"
            data["punchin"] = latest_punch.punch_in_time
            data["punchout"] = latest_punch.punch_out_time
    data["time"] = timezone.now().strftime("%I:%M %p").lower()

    return data

def get_public_ip():
    try:
        response = requests.get("https://api.ipify.org?format=json")
        if response.status_code == 200:
            return response.json().get("ip")
    except requests.RequestException:
        pass
    return None

def get_ip_location(ip):
    response = requests.get(f"https://ipinfo.io/{ip}/json")
    if response.status_code == 200:
        data = response.json()
        location = data.get("loc")
        if location:
            latitude, longitude = map(float, location.split(","))
            print(f"Latitude: {latitude}, Longitude: {longitude}")
            return latitude, longitude
    return None, None

def punch_in(user):
    today = timezone.now().date()

    if PunchInOut.objects.filter(user=user, date=today, punch_in_time__isnull=False).exists():
        raise ValidationError("You have already punched in for today.")
    public_ip = get_public_ip()
    print(public_ip)
    if public_ip:
        lat, lon = get_ip_location(public_ip)
    else:
        lat=lon=None
    
    punch = PunchInOut.objects.create(user=user, date=today, punch_in_time=timezone.now(), latitude=lat, longitude=lon)
    return punch

def punch_out(user):
    today = timezone.now().date()

    punch = PunchInOut.objects.filter(user=user, date=today, punch_out_time__isnull=True).first()

    if not punch:
        raise ValidationError("You have not punched in or already punched out.")

    punch.punch_out_time = timezone.now()
    punch.save()
    return punch