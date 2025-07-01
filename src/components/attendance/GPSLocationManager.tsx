
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

interface LocationForm {
  name: string;
  address: string;
  latitude: number | '';
  longitude: number | '';
  radius_meters: number;
}

interface GoogleMapsProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  selectedLocation?: { lat: number; lng: number };
  apiKey: string;
}

function GoogleMapComponent({ onLocationSelect, selectedLocation, apiKey }: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string>('');

  const initializeMap = useCallback(() => {
    console.log('Initializing map...');
    if (!mapRef.current || !window.google?.maps) {
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
        streetViewControl: false,
        fullscreenControl: false,
      });

      console.log('Map created successfully');

      // Add click listener to map
      mapInstanceRef.current.addListener('click', (event: any) => {
        console.log('Map clicked:', event.latLng?.lat(), event.latLng?.lng());
        const lat = event.latLng?.lat();
        const lng = event.latLng?.lng();
        
        if (lat && lng) {
          // Update marker position
          if (markerRef.current) {
            markerRef.current.setPosition({ lat, lng });
          } else {
            markerRef.current = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapInstanceRef.current,
              draggable: true,
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

          // Get address using Geocoding
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
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
        markerRef.current = new window.google.maps.Marker({
          position: selectedLocation,
          map: mapInstanceRef.current,
          draggable: true,
        });

        markerRef.current.addListener('dragend', () => {
          const position = markerRef.current?.getPosition();
          if (position) {
            const newLat = position.lat();
            const newLng = position.lng();
            console.log('Existing marker dragged to:', newLat, newLng);
            onLocationSelect(newLat, newLng);
          }
        });
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setLoadError('Lỗi khi khởi tạo bản đồ');
    }
  }, [selectedLocation, onLocationSelect]);

  useEffect(() => {
    if (!apiKey) {
      console.log('No API key provided');
      return;
    }

    const loadGoogleMaps = () => {
      console.log('Loading Google Maps...');
      
      // Check if already loaded
      if (window.google?.maps) {
        console.log('Google Maps already loaded');
        setIsLoaded(true);
        initializeMap();
        return;
      }

      // Remove existing script if any
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Global callback
      (window as any).initMap = () => {
        console.log('Google Maps loaded via callback');
        setIsLoaded(true);
        setTimeout(initializeMap, 100);
      };

      script.onerror = () => {
        console.error('Error loading Google Maps script');
        setLoadError('Không thể tải Google Maps. Vui lòng kiểm tra API key.');
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();

    // Cleanup
    return () => {
      if ((window as any).initMap) {
        delete (window as any).initMap;
      }
    };
  }, [apiKey, initializeMap]);

  useEffect(() => {
    if (isLoaded && selectedLocation && mapInstanceRef.current) {
      console.log('Updating map center to:', selectedLocation);
      mapInstanceRef.current.setCenter(selectedLocation);
      
      if (markerRef.current) {
        markerRef.current.setPosition(selectedLocation);
      } else {
        markerRef.current = new window.google.maps.Marker({
          position: selectedLocation,
          map: mapInstanceRef.current,
          draggable: true,
        });

        markerRef.current.addListener('dragend', () => {
          const position = markerRef.current?.getPosition();
          if (position) {
            const newLat = position.lat();
            const newLng = position.lng();
            console.log('New marker dragged to:', newLat, newLng);
            onLocationSelect(newLat, newLng);
          }
        });
      }
    }
  }, [selectedLocation, isLoaded, onLocationSelect]);

  if (!apiKey) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Vui lòng nhập Google Maps API Key để hiển thị bản đồ</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-96 bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
        <div className="text-center">
          <p className="text-red-600 font-medium">Lỗi tải bản đồ</p>
          <p className="text-red-500 text-sm mt-1">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-96 w-full rounded-lg overflow-hidden border">
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Đang tải bản đồ...</p>
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

    // Prepare location data with proper number conversion and rounding
    const locationData = {
      name: formData.name.trim(),
      address: formData.address.trim() || null,
      latitude: Number(Number(formData.latitude).toFixed(6)),
      longitude: Number(Number(formData.longitude).toFixed(6)),
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
  } : undefined;

  return (
    <div className="space-y-6">
      {/* Google Maps API Key Input */}
      {!apiKey && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="apiKey">Google Maps API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Nhập Google Maps API Key..."
                  onChange={(e) => {
                    console.log('API key entered');
                    setApiKey(e.target.value);
                  }}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Cần API key để hiển thị bản đồ. Lấy từ{' '}
                  <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Google Cloud Console
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              Click vào bản đồ để chọn vị trí chấm công
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
