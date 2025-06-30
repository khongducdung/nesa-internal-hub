
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Search } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  currentLocation: { lat: number; lng: number } | null;
}

export function LocationPicker({ onLocationSelect, currentLocation }: LocationPickerProps) {
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        onLocationSelect(location);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsGettingLocation(false);
      }
    );
  };

  const handleManualLocation = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Vui lòng nhập tọa độ hợp lệ');
      return;
    }

    onLocationSelect({ lat, lng });
  };

  const openGoogleMaps = () => {
    if (currentLocation) {
      const url = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4" />
          Chọn vị trí chấm công
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            variant="outline"
            className="w-full"
          >
            <Navigation className="h-4 w-4 mr-2" />
            {isGettingLocation ? 'Đang lấy vị trí...' : 'Lấy vị trí hiện tại'}
          </Button>

          {currentLocation && (
            <Button
              onClick={openGoogleMaps}
              variant="outline"
              className="w-full"
            >
              <Search className="h-4 w-4 mr-2" />
              Xem trên Google Maps
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Hoặc nhập tọa độ thủ công:</p>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              step="any"
              placeholder="Latitude (VD: 21.0285)"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
            />
            <Input
              type="number"
              step="any"
              placeholder="Longitude (VD: 105.8542)"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
            />
          </div>
          <Button onClick={handleManualLocation} variant="outline" className="w-full">
            Sử dụng tọa độ này
          </Button>
        </div>

        {currentLocation && (
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-800">Vị trí đã chọn:</p>
            <p className="text-sm text-green-700">
              Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
