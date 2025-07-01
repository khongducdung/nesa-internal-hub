
import React from 'react';
import { GPSLocationManager } from './GPSLocationManager';
import { useSettings } from '@/components/ui/settings-context';

export function AttendanceSettingsManagement() {
  const { hideDescriptions } = useSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Cài đặt máy chấm công</h2>
        {!hideDescriptions && (
          <p className="text-gray-600 mt-1">Thiết lập địa điểm chấm công theo GPS</p>
        )}
      </div>

      <GPSLocationManager />
    </div>
  );
}
