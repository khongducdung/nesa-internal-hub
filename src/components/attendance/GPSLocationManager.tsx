
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MapPin, Edit, Trash2, Navigation, Globe } from 'lucide-react';
import { useAttendanceLocations } from '@/hooks/useAttendanceLocations';
import { useAttendanceLocationMutations } from '@/hooks/useAttendanceLocationMutations';
import { useToast } from '@/hooks/use-toast';

// Declare global google maps types
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

interface LocationForm {
  name: string;
  address: string;
  latitude: number | '';
  longitude: number | '';
  radius_meters: number;
}

interface GoogleMapsProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  apiKey: string;
}

function GoogleMapComponent({ onLocationSelect, selectedLocation, apiKey }: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string>('');

  const initializeMap = useCallback(() => {
    console.log('Initializing map...');
    if (!mapRef.current || !window.google) {
      console.error('Map container or Google Maps not available');
      return;
    }

    try {
      const defaultCenter = selectedLocation || { lat: 21.0285, lng: 105.8542 }; // Hanoi default
      console.log('Creating map with center:', defaultCenter);

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      console.log('Map created successfully');

      // Add click listener to map
      mapInstanceRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
        console.log('Map clicked:', event.latLng?.lat(), event.latLng?.lng());
        const lat = event.latLng?.lat();
        const lng = event.latLng?.lng();
        
        if (lat && lng) {
          updateMarkerPosition(lat, lng);
          // Get address using Geocoding
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            let address = '';
            if (status === 'OK' && results?.[0]) {
              address = results[0].formatted_address;
              console.log('Address found:', address);
            }
            onLocationSelect(lat, lng, address);
          });
        }
      });

      // Add existing marker if we have selected location
      if (selectedLocation) {
        updateMarkerPosition(selectedLocation.lat, selectedLocation.lng);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setLoadError('Lỗi khi khởi tạo bản đồ');
    }
  }, [selectedLocation, onLocationSelect]);

  const updateMarkerPosition = (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return;

    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
    } else {
      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        draggable: true,
        title: 'Vị trí chấm công'
      });

      // Add drag listener to marker
      markerRef.current.addListener('dragend', () => {
        const position = markerRef.current?.getPosition();
        if (position) {
          const newLat = position.lat();
          const newLng = position.lng();
          console.log('Marker dragged to:', newLat, newLng);
          onLocationSelect(newLat, newLng);
        }
      });
    }

    // Center map on marker
    mapInstanceRef.current.setCenter({ lat, lng });
  };

  useEffect(() => {
    if (!apiKey) {
      console.log('No API key provided');
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      console.log('Google Maps already loaded');
      setIsLoaded(true);
      setTimeout(initializeMap, 100);
      return;
    }

    // Clean up existing script
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    const loadGoogleMaps = () => {
      console.log('Loading Google Maps API...');
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=3`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps script loaded successfully');
        if (window.google && window.google.maps) {
          setIsLoaded(true);
          setLoadError('');
          setTimeout(initializeMap, 100);
        } else {
          console.error('Google Maps not available after script load');
          setLoadError('Google Maps không khả dụng sau khi tải script');
        }
      };

      script.onerror = (error) => {
        console.error('Error loading Google Maps script:', error);
        setLoadError('Không thể tải Google Maps. Vui lòng kiểm tra API key và kết nối internet.');
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
      // Cleanup on unmount
      const script = document.querySelector('script[src*="maps.googleapis.com"]');
      if (script) {
        script.remove();
      }
    };
  }, [apiKey, initializeMap]);

  // Update marker when selectedLocation changes
  useEffect(() => {
    if (isLoaded && selectedLocation && mapInstanceRef.current) {
      console.log('Updating marker position to:', selectedLocation);
      updateMarkerPosition(selectedLocation.lat, selectedLocation.lng);
    }
  }, [selectedLocation, isLoaded]);

  if (!apiKey) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Vui lòng nhập Google Maps API Key</p>
          <p className="text-gray-400 text-sm">để hiển thị bản đồ</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-96 bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
        <div className="text-center max-w-md">
          <div className="text-red-600 font-bold text-lg mb-2">❌ Lỗi tải bản đồ</div>
          <p className="text-red-600 text-sm mb-4">{loadError}</p>
          <div className="bg-red-100 p-3 rounded text-xs text-red-700">
            <strong>Kiểm tra:</strong>
            <ul className="list-disc list-inside mt-1 text-left">
              <li>API key Google Maps có hợp lệ không</li>
              <li>Đã bật Maps JavaScript API chưa</li>
              <li>Đã cấu hình domain trong Google Console chưa</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-96 w-full rounded-lg overflow-hidden border">
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 font-medium">Đang tải Google Maps...</p>
            <p className="text-gray-400 text-sm">Vui lòng chờ...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function GPSLocationManager() {
  const { data: locations, isLoading } = useAttendanceLocations();
  const { createLocation, updateLocation, deleteLocation } = useAttendanceLocationMutations();
  const { toast } = useToast();

  const [editingLocation, setEditingLocation] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [formData, setFormData] = useState<LocationForm>({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    radius_meters: 100
  });

  useEffect(() => {
    console.log('Getting current location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('Current location obtained:', location);
          setCurrentLocation(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: 'Không thể lấy vị trí hiện tại',
            description: 'Vui lòng cho phép truy cập vị trí hoặc nhập tọa độ thủ công',
            variant: 'destructive'
          });
        }
      );
    }
  }, [toast]);

  const handleGetCurrentLocation = () => {
    if (currentLocation) {
      const lat = Number(currentLocation.lat.toFixed(6));
      const lng = Number(currentLocation.lng.toFixed(6));
      
      setFormData(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng
      }));
      
      console.log('Set current location to form:', lat, lng);
      toast({
        title: 'Đã lấy vị trí hiện tại',
        description: `Lat: ${lat}, Lng: ${lng}`
      });
    } else {
      toast({
        title: 'Không thể lấy vị trí',
        description: 'Vui lòng cho phép truy cập vị trí hoặc nhập tọa độ thủ công',
        variant: 'destructive'
      });
    }
  };

  const handleMapLocationSelect = (lat: number, lng: number, address?: string) => {
    const roundedLat = Number(lat.toFixed(6));
    const roundedLng = Number(lng.toFixed(6));
    
    console.log('Map location selected:', roundedLat, roundedLng, address);
    
    setFormData(prev => ({
      ...prev,
      latitude: roundedLat,
      longitude: roundedLng,
      address: address || prev.address
    }));
  };

  const handleOpenGoogleMaps = () => {
    const lat = formData.latitude || (currentLocation?.lat || 21.0285);
    const lng = formData.longitude || (currentLocation?.lng || 105.8542);
    const url = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
    window.open(url, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting form data:', formData);
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập tên địa điểm',
        variant: 'destructive'
      });
      return;
    }

    if (formData.latitude === '' || formData.longitude === '') {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập tọa độ hoặc chọn vị trí trên bản đồ',
        variant: 'destructive'
      });
      return;
    }

    if (formData.radius_meters < 10 || formData.radius_meters > 1000) {
      toast({
        title: 'Lỗi',
        description: 'Bán kính phải từ 10 đến 1000 mét',
        variant: 'destructive'
      });
      return;
    }

    // Validate coordinate ranges
    const lat = Number(formData.latitude);
    const lng = Number(formData.longitude);
    
    if (lat < -90 || lat > 90) {
      toast({
        title: 'Lỗi',
        description: 'Vĩ độ phải từ -90 đến 90',
        variant: 'destructive'
      });
      return;
    }

    if (lng < -180 || lng > 180) {
      toast({
        title: 'Lỗi',
        description: 'Kinh độ phải từ -180 đến 180',
        variant: 'destructive'
      });
      return;
    }

    // Prepare location data with proper number conversion
    const locationData = {
      name: formData.name.trim(),
      address: formData.address.trim() || null,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      radius_meters: Number(formData.radius_meters)
    };

    console.log('Processed location data:', locationData);

    try {
      if (editingLocation) {
        console.log('Updating location:', editingLocation);
        await updateLocation.mutateAsync({ id: editingLocation, data: locationData });
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật địa điểm chấm công'
        });
      } else {
        console.log('Creating new location');
        await createLocation.mutateAsync(locationData);
        toast({
          title: 'Thành công',
          description: 'Đã tạo địa điểm chấm công mới'
        });
      }
      
      // Reset form
      setEditingLocation(null);
      setFormData({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        radius_meters: 100
      });
      
      console.log('Form reset successfully');
      
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu địa điểm chấm công. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (location: any) => {
    console.log('Editing location:', location);
    setFormData({
      name: location.name,
      address: location.address || '',
      latitude: location.latitude,
      longitude: location.longitude,
      radius_meters: location.radius_meters
    });
    setEditingLocation(location.id);
  };

  const handleCancelEdit = () => {
    console.log('Cancelling edit');
    setEditingLocation(null);
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      radius_meters: 100
    });
  };

  const handleDelete = async (id: string) => {
    console.log('Deleting location:', id);
    try {
      await deleteLocation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  const selectedLocation = formData.latitude !== '' && formData.longitude !== '' ? {
    lat: Number(formData.latitude),
    lng: Number(formData.longitude)
  } : null;

  return (
    <div className="space-y-6">
      {/* Google Maps API Key Input */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <Label htmlFor="apiKey" className="font-semibold">Google Maps API Key</Label>
              {apiKey && <Badge variant="outline" className="text-green-600">✓ Đã nhập</Badge>}
            </div>
            <Input
              id="apiKey"
              type="password"
              placeholder="Nhập Google Maps API Key..."
              value={apiKey}
              onChange={(e) => {
                console.log('API key entered');
                setApiKey(e.target.value);
              }}
            />
            <div className="text-sm text-gray-600 bg-white p-3 rounded border-l-4 border-blue-400">
              <strong>Hướng dẫn lấy API key:</strong>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Truy cập <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Cloud Console</a></li>
                <li>Tạo API key mới hoặc sử dụng key có sẵn</li>
                <li>Bật Maps JavaScript API trong Libraries</li>
                <li>Cấu hình domain cho API key</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form thêm/sửa địa điểm */}
        <Card>
          <CardHeader>
            <CardTitle>
              {editingLocation ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm mới'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Tên địa điểm *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Văn phòng chính, Chi nhánh..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Địa chỉ chi tiết"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Vĩ độ (Latitude) *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      latitude: e.target.value ? Number(e.target.value) : '' 
                    }))}
                    placeholder="21.028511"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Kinh độ (Longitude) *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      longitude: e.target.value ? Number(e.target.value) : '' 
                    }))}
                    placeholder="105.804817"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="radius">Bán kính chấm công (mét)</Label>
                <Input
                  id="radius"
                  type="number"
                  value={formData.radius_meters}
                  onChange={(e) => setFormData(prev => ({ ...prev, radius_meters: Number(e.target.value) }))}
                  min="10"
                  max="1000"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button type="button" variant="outline" onClick={handleGetCurrentLocation}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Lấy vị trí hiện tại
                </Button>
                <Button type="button" variant="outline" onClick={handleOpenGoogleMaps}>
                  <Globe className="h-4 w-4 mr-2" />
                  Mở Google Maps
                </Button>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={createLocation.isPending || updateLocation.isPending}
                  className="flex-1"
                >
                  {(createLocation.isPending || updateLocation.isPending) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    editingLocation ? 'Cập nhật' : 'Thêm địa điểm'
                  )}
                </Button>
                {editingLocation && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    Hủy
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Google Maps */}
        <Card>
          <CardHeader>
            <CardTitle>Chọn vị trí trên bản đồ</CardTitle>
            <p className="text-sm text-gray-600">
              Click vào bản đồ để chọn vị trí chấm công. Kéo thả marker để điều chỉnh.
            </p>
          </CardHeader>
          <CardContent>
            <GoogleMapComponent 
              apiKey={apiKey}
              onLocationSelect={handleMapLocationSelect}
              selectedLocation={selectedLocation}
            />
          </CardContent>
        </Card>
      </div>

      {/* Danh sách địa điểm */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách địa điểm chấm công</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations?.map((location) => (
              <Card key={location.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium">{location.name}</h4>
                    </div>
                    <Badge variant="secondary">{location.radius_meters}m</Badge>
                  </div>

                  {location.address && (
                    <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                  )}

                  <div className="text-xs text-gray-500 mb-3">
                    <div>Lat: {location.latitude}</div>
                    <div>Lng: {location.longitude}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(location)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc muốn xóa địa điểm "{location.name}"?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(location.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}

            {(!locations || locations.length === 0) && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có địa điểm chấm công nào</p>
                <p className="text-sm">Điền form bên trái và chọn vị trí trên bản đồ để thêm địa điểm</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
