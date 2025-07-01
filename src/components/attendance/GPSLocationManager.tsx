
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MapPin, Plus, Edit, Trash2, Navigation, Globe } from 'lucide-react';
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

export function GPSLocationManager() {
  const { data: locations, isLoading } = useAttendanceLocations();
  const { createLocation, updateLocation, deleteLocation } = useAttendanceLocationMutations();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState<LocationForm>({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    radius_meters: 100
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleGetCurrentLocation = () => {
    if (currentLocation) {
      setFormData(prev => ({
        ...prev,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng
      }));
      toast({
        title: 'Đã lấy vị trí hiện tại',
        description: `Lat: ${currentLocation.lat.toFixed(6)}, Lng: ${currentLocation.lng.toFixed(6)}`
      });
    } else {
      toast({
        title: 'Không thể lấy vị trí',
        description: 'Vui lòng cho phép truy cập vị trí hoặc nhập tọa độ thủ công',
        variant: 'destructive'
      });
    }
  };

  const handleOpenGoogleMaps = () => {
    const lat = formData.latitude || (currentLocation?.lat || 21.0285);
    const lng = formData.longitude || (currentLocation?.lng || 105.8542);
    const url = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
    window.open(url, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.latitude === '' || formData.longitude === '') {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        variant: 'destructive'
      });
      return;
    }

    const locationData = {
      name: formData.name,
      address: formData.address,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      radius_meters: formData.radius_meters
    };

    try {
      if (editingLocation) {
        await updateLocation.mutateAsync({ id: editingLocation, data: locationData });
      } else {
        await createLocation.mutateAsync(locationData);
      }
      
      setShowForm(false);
      setEditingLocation(null);
      setFormData({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        radius_meters: 100
      });
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const handleEdit = (location: any) => {
    setFormData({
      name: location.name,
      address: location.address || '',
      latitude: location.latitude,
      longitude: location.longitude,
      radius_meters: location.radius_meters
    });
    setEditingLocation(location.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteLocation.mutateAsync(id);
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Quản lý địa điểm chấm công GPS</h3>
          <p className="text-sm text-gray-600">Thiết lập các vị trí được phép chấm công</p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm địa điểm
        </Button>
      </div>

      {/* Form thêm/sửa địa điểm */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingLocation ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm mới'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Vĩ độ (Latitude) *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value ? Number(e.target.value) : '' }))}
                    placeholder="21.0285"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Kinh độ (Longitude) *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value ? Number(e.target.value) : '' }))}
                    placeholder="105.8542"
                    required
                  />
                </div>
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
                <Button type="submit" disabled={createLocation.isPending || updateLocation.isPending}>
                  {editingLocation ? 'Cập nhật' : 'Thêm địa điểm'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingLocation(null);
                    setFormData({
                      name: '',
                      address: '',
                      latitude: '',
                      longitude: '',
                      radius_meters: 100
                    });
                  }}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Danh sách địa điểm */}
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
            <p className="text-sm">Nhấn "Thêm địa điểm" để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
}
