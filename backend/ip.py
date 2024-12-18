import requests

def get_ip_details(ip):
    response = requests.get(f"https://ipinfo.io/{ip}/json")
    if response.status_code == 200:
        data = response.json()
        location = data.get("loc")
        city = data.get("city")
        region = data.get("region")
        country = data.get("country")
        print(f"IP: {ip}\nLocation: {location}\nCity: {city}\nRegion: {region}\nCountry: {country}")

# Example usage:
get_ip_details("223.178.80.159")
