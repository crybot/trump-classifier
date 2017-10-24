from geopy.geocoders import Nominatim
from pygeocoder import Geocoder
from pygeocoder import GeocoderError

def convert_location(location):
    if not location is None:
        try:
            result = Geocoder.geocode(location)
            return result.coordinates
        except GeocoderError:
            return None
    return None
