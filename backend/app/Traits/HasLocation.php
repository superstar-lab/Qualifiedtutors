<?php

namespace App\Traits;

trait HasLocation {
    
    public function setLocationAttribute($latLng) {
    
        $this->attributes['location'] = \DB::raw("GeomFromText('POINT($latLng)')");
    }

    public function getLocationAttribute($value) {
        
        return str_replace(
            [
                "GeomFromText('",
                "'",
                'POINT(',
                ')'
            ],
            '',
            $value
        );
    }
}
