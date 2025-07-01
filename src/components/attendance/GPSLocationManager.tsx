
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Edit, Trash2, Navigation, Globe, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
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

// API Key validation helper
const validateApiKey = (key: string): boolean => {
  if (!key || key.trim().length === 0) return false;
  // Basic Google API key format validation
  const apiKeyRegex = /^AIza[0-9A-Za-z-_]{35}$/;
  return apiKeyRegex.test(key.trim());
};

function GoogleMapComponent({ onLocationSelect, selectedLocation, apiKey }: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadRetryCount, setLoadRetryCount] = useState(0);

  const initializeMap = useCallback(() => {
    console.log('🗺️ Initializing Google Maps...');
    
    if (!mapRef.current) {
      console.error('❌ Map container not found');
      setLoadError('Container bản đồ không tồn tại');
      return;
    }

    if (!window.google?.maps) {
      console.error('❌ Google Maps API not loaded');
      setLoadError('Google Maps API chưa được tải');
      return;
    }

    try {
      const defaultCenter = selectedLocation || { lat: 21.0285, lng: 105.8542 }; // Hanoi default
      console.log('📍 Creating map with center:', defaultCenter);

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        mapTypeId: 'roadmap'
      });

      console.log('✅ Map created successfully');

      // Add click listener with error handling
      const clickListener = mapInstanceRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
        try {
          console.log('🖱️ Map clicked:', event.latLng?.lat(), event.latLng?.lng());
          const lat = event.latLng?.lat();
          const lng = event.latLng?.lng();
          
          if (lat && lng) {
            updateMarkerPosition(lat, lng);
            
            // Get address using Geocoding with error handling
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              let address = '';
              if (status === 'OK' && results?.[0]) {
                address = results[0].formatted_address;
                console.log('📍 Address found:', address);
              } else {
                console.warn('⚠️ Geocoding failed:', status);
                address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
              }
              onLocationSelect(lat, lng, address);
            });
          }
        } catch (error) {
          console.error('❌ Error handling map click:', error);
        }
      });

      // Add existing marker if we have selected location
      if (selectedLocation) {
        updateMarkerPosition(selectedLocation.lat, selectedLocation.lng);
      }

      setLoadError('');
      console.log('✅ Map initialization complete');
      
    } catch (error) {
      console.error('❌ Error initializing map:', error);
      setLoadError(`Lỗi khi khởi tạo bản đồ: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [selectedLocation, onLocationSelect]);

  const updateMarkerPosition = (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return;

    try {
      if (markerRef.current) {
        markerRef.current.setPosition({ lat, lng });
      } else {
        markerRef.current = new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstanceRef.current,
          draggable: true,
          title: 'Vị trí chấm công',
          animation: window.google.maps.Animation.DROP
        });

        // Add drag listener to marker with error handling
        markerRef.current.addListener('dragend', () => {
          try {
            const position = markerRef.current?.getPosition();
            if (position) {
              const newLat = position.lat();
              const newLng = position.lng();
              console.log('🎯 Marker dragged to:', newLat, newLng);
              onLocationSelect(newLat, newLng);
            }
          } catch (error) {
            console.error('❌ Error handling marker drag:', error);
          }
        });
      }

      // Center map on marker
      mapInstanceRef.current.setCenter({ lat, lng });
    } catch (error) {
      console.error('❌ Error updating marker position:', error);
    }
  };

  const loadGoogleMapsScript = useCallback(() => {
    if (!apiKey || !validateApiKey(apiKey)) {
      setLoadError('API key không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }

    setIsLoading(true);
    setLoadError('');
    console.log('🔄 Loading Google Maps script...');

    // Clean up existing script
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      console.log('🧹 Cleaning up existing script');
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=3.exp&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Setup global callback
    window.initMap = () => {
      console.log('✅ Google Maps callback triggered');
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        setIsLoading(false);
        setLoadError('');
        setTimeout(initializeMap, 100);
      } else {
        console.error('❌ Google Maps not available in callback');
        setLoadError('Google Maps không khả dụng sau khi tải');
        setIsLoading(false);
      }
    };
    
    script.onload = () => {
      console.log('📜 Google Maps script loaded');
    };

    script.onerror = (error) => {
      console.error('❌ Error loading Google Maps script:', error);
      setIsLoading(false);
      
      if (loadRetryCount < 2) {
        console.log(`🔄 Retrying... (${loadRetryCount + 1}/2)`);
        setLoadRetryCount(prev => prev + 1);
        setTimeout(() => loadGoogleMapsScript(), 2000);
      } else {
        setLoadError('Không thể tải Google Maps. Vui lòng kiểm tra:\n• API key có đúng không?\n• Đã bật Maps JavaScript API chưa?\n• Domain đã được cấu hình chưa?');
      }
    };

    document.head.appendChild(script);
  }, [apiKey, initializeMap, loadRetryCount]);

  useEffect(() => {
    if (!apiKey || !validateApiKey(apiKey)) {
      console.log('⚠️ Invalid or missing API key');
      setIsLoaded(false);
      setLoadError('');
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      console.log('✅ Google Maps already loaded');
      setIsLoaded(true);
      setIsLoading(false);
      setTimeout(initializeMap, 100);
      return;
    }

    loadGoogleMapsScript();

    return () => {
      // Cleanup on unmount
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, [apiKey, initializeMap, loadGoogleMapsScript]);

  // Update marker when selectedLocation changes
  useEffect(() => {
    if (isLoaded && selectedLocation && mapInstanceRef.current) {
      console.log('📍 Updating marker position to:', selectedLocation);
      updateMarkerPosition(selectedLocation.lat, selectedLocation.lng);
    }
  }, [selectedLocation, isLoaded]);

  if (!apiKey || !validateApiKey(apiKey)) {
    return (
      <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center max-w-md">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">Vui lòng nhập Google Maps API Key hợp lệ</p>
          <p className="text-gray-500 text-sm">API key phải có format: AIza...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-96 bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-700 font-bold text-lg mb-2">Lỗi tải Google Maps</div>
          <pre className="text-red-600 text-sm mb-4 whitespace-pre-wrap text-left bg-red-100 p-3 rounded">
            {loadError}
          </pre>
          <Button 
            onClick={() => {
              setLoadRetryCount(0);
              loadGoogleMapsScript();
            }}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-96 w-full rounded-lg overflow-hidden border">
      <div ref={mapRef} className="w-full h-full" />
      {(isLoading || !isLoaded) && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 font-medium">
              {isLoading ? 'Đang tải Google Maps...' : 'Đang khởi tạo bản đồ...'}
            </p>
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
  const [apiKeyStatus, setApiKeyStatus] = useState<'valid' | 'invalid' | 'unchecked'>('unchecked');
  const [formData, setFormData] = useState<LocationForm>({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    radius_meters: 100
  });

  // Validate API key on change
  useEffect(() => {
    if (!apiKey) {
      setApiKeyStatus('unchecked');
      return;
    }
    
    if (validateApiKey(apiKey)) {
      setApiKeyStatus('valid');
    } else {
      setApiKeyStatus('invalid');
    }
  }, [apiKey]);

  useEffect(() => {
    console.log('🌍 Getting current location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('✅ Current location obtained:', location);
          setCurrentLocation(location);
        },
        (error) => {
          console.error('❌ Error getting location:', error);
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
      
      console.log('📍 Set current location to form:', lat, lng);
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
    
    console.log('🎯 Map location selected:', roundedLat, roundedLng, address);
    
    setFormData(prev => ({
      ...prev,
      latitude: roundedLat,
      longitude: roundedLng,
      address: address || prev.address
    }));

    toast({
      title: 'Đã chọn vị trí',
      description: `Lat: ${roundedLat}, Lng: ${roundedLng}`,
    });
  };

  const handleOpenGoogleMaps = () => {
    const lat = formData.latitude || (currentLocation?.lat || 21.0285);
    const lng = formData.longitude || (currentLocation?.lng || 105.8542);
    const url = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
    window.open(url, '_blank');
  };

  const validateCoordinates = (lat: number, lng: number): boolean => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Submitting form data:', formData);
    
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
    
    if (!validateCoordinates(lat, lng)) {
      toast({
        title: 'Lỗi',
        description: 'Tọa độ không hợp lệ. Vĩ độ: -90 đến 90, Kinh độ: -180 đến 180',
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

    console.log('💾 Processed location data:', locationData);

    try {
      if (editingLocation) {
        console.log('✏️ Updating location:', editingLocation);
        await updateLocation.mutateAsync({ id: editingLocation, data: locationData });
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật địa điểm chấm công'
        });
      } else {
        console.log('➕ Creating new location');
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
      
      console.log('🔄 Form reset successfully');
      
    } catch (error) {
      console.error('❌ Error saving location:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu địa điểm chấm công. Vui lòng thử lại.',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (location: any) => {
    console.log('✏️ Editing location:', location);
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
    console.log('❌ Cancelling edit');
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
    console.log('🗑️ Deleting location:', id);
    try {
      await deleteLocation.mutateAsync(id);
    } catch (error) {
      console.error('❌ Error deleting location:', error);
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
              {apiKeyStatus === 'valid' && <Badge variant="default" className="text-green-600 bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />Hợp lệ</Badge>}
              {apiKeyStatus === 'invalid' && <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Không hợp lệ</Badge>}
            </div>
            <Input
              id="apiKey"
              type="password"
              placeholder="Nhập Google Maps API Key (AIza...)..."
              value={apiKey}
              onChange={(e) => {
                console.log('🔑 API key entered');
                setApiKey(e.target.value);
              }}
              className={apiKeyStatus === 'invalid' ? 'border-red-500' : ''}
            />
            
            {apiKeyStatus === 'invalid' && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  API key không đúng format. Google Maps API key phải bắt đầu bằng "AIza" và có 39 ký tự.
                </AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-gray-600 bg-white p-4 rounded border-l-4 border-blue-400">
              <div className="space-y-3">
                <div>
                  <strong className="text-blue-700">🔧 Hướng dẫn lấy API key:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Truy cập <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center gap-1">Google Cloud Console <ExternalLink className="h-3 w-3" /></a></li>
                    <li>Tạo API key mới (Create Credentials → API Key)</li>
                    <li>Bật <strong>Maps JavaScript API</strong> trong Libraries</li>
                    <li>Thêm domain này vào Authorized domains</li>
                  </ol>
                </div>
                
                <div>
                  <strong className="text-orange-700">⚠️ Nếu vẫn lỗi, kiểm tra:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>API key đã được kích hoạt chưa?</li>
                    <li>Maps JavaScript API đã được bật chưa?</li>
                    <li>Domain đã được thêm vào restrictions chưa?</li>
                    <li>Billing account đã được setup chưa?</li>
                  </ul>
                </div>
              </div>
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
                  placeholder="Địa chỉ chi tiết (tự động điền khi chọn trên bản đồ)"
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
                <p className="text-xs text-gray-500 mt-1">Khoảng cách tối đa để có thể chấm công (10-1000m)</p>
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
              {apiKeyStatus === 'valid' 
                ? 'Click vào bản đồ để chọn vị trí chấm công. Kéo thả marker để điều chỉnh.' 
                : 'Nhập API key hợp lệ để sử dụng bản đồ.'
              }
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
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=15`;
                        window.open(url, '_blank');
                      }}
                    >
                      <Globe className="h-3 w-3" />
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
                <p className="text-sm">Nhập API key Google Maps và điền form để thêm địa điểm</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
