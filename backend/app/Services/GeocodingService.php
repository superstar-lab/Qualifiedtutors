<?php

namespace App\Services;

use App\Models\User;
use Spatie\Geocoder\Geocoder;
use Illuminate\Support\Facades\Log;

/**
 * Handles geolocation of users
 */
class GeocodingService {

    private $geocoder;

    public function __construct() {
        
        $client = new \GuzzleHttp\Client();
        $this->geocoder = new Geocoder($client);
        $this->geocoder->setApiKey(env('GOOGLE_API_KEY'));
        //$this->geocoder->setCountry('UK');
    }

    /**
     * Query Google Geocoding API for a specific address
     * 
     * @param String $address The address to be geolocated. Can be in any format accepted by https://developers.google.com/maps/documentation/geocoding/requests-geocoding
     */
    public function GetCoordinatesForAddress(string $address) {

        return $this->geocoder->getCoordinatesForAddress($address);
    }
    
    /**
     * Query Google Geocoding API for all coordinates related to a specific address
     * 
     * @param String $address The address to be geolocated. Can be in any format accepted by https://developers.google.com/maps/documentation/geocoding/requests-geocoding
     */
    public function GetAllCoordinatesForAddress(string $address) {

        $client = new \GuzzleHttp\Client();
        $response = $client->request('GET', "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?region=uk&input=$address&inputtype=textquery&fields=formatted_address%2Cname%2Cgeometry&key=" . env('GOOGLE_API_KEY'));
        return $response->getBody();    
    }

    /**
     * Query Google Geocoding API for a specific user
     * 
     * @param User $user The user whose address needs to be geolocated
     */
    public function GetLatLngForUser(User $user) {
        
        $response = $this->geocoder->getCoordinatesForAddress(
            $user->address_line_1 . ", " .
            ($user->address_line_2 ? $user->address_line_2 . ", " : "") .
            $user->city . ", " .
            $user->postcode
        );

        return $response['formatted_address'] == 'result_not_found' ? 
              [-256, -256]
            : [$response['lat'],  $response['lng']];
    }
}
