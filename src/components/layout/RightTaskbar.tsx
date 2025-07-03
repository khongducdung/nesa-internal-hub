import React, { useState } from 'react';
import { Settings, Bell, MessageCircle, Calendar, Search, Plus } from 'lucide-react';

export function RightTaskbar() {
  const [isVisible, setIsVisible] = useState(false);

  const utilities = [
    { icon: Plus, label: 'Thêm tiện ích' },
    { icon: Settings, label: 'Cài đặt' },
    { icon: Bell, label: 'Thông báo' },
    { icon: MessageCircle, label: 'Tin nhắn' },
    { icon: Calendar, label: 'Lịch' },
    { icon: Search, label: 'Tìm kiếm' },
  ];

  return (
    <>
      {/* Always visible trigger bar */}
      <div 
        className="fixed right-0 top-1/2 -translate-y-1/2 w-3 h-20 bg-blue-500 rounded-l-lg shadow-lg z-50 cursor-pointer hover:w-4 transition-all duration-200"
        onMouseEnter={() => setIsVisible(true)}
        style={{ zIndex: 99999 }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-1 h-8 bg-white rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Taskbar panel */}
      {isVisible && (
        <div 
          className="fixed right-4 top-1/2 -translate-y-1/2 w-16 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 z-50"
          onMouseLeave={() => setIsVisible(false)}
          style={{ zIndex: 99999 }}
        >
          <div className="flex flex-col gap-3">
            {utilities.map((utility, index) => (
              <button
                key={index}
                className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors duration-200 group"
                title={utility.label}
                onClick={() => alert(`Clicked: ${utility.label}`)}
              >
                <utility.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}