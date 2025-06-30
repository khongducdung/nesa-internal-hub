
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, MapPin, Navigation } from 'lucide-react';
import { useAttendanceLocations } from '@/hooks/useAttendanceLocations';

export function AttendanceLocationsList() {
  const { data: locations, isLoading } = useAttendanceLocations();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Địa điểm chấm công</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm địa điểm
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations?.map((location) => (
          <Card key={location.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{location.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {location.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">{location.address}</span>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Vĩ độ:</span>
                  <div>{location.latitude}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Kinh độ:</span>
                  <div>{location.longitude}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Navigation className="h-4 w-4 text-muted-foreground" />
                <span>Bán kính: {location.radius_meters}m</span>
              </div>

              <div className="flex justify-end">
                <Badge variant={location.is_active ? 'default' : 'secondary'}>
                  {location.is_active ? 'Hoạt động' : 'Ngưng'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
