import React, { useState } from 'react';
import { Settings, Bell, MessageCircle, Calendar, Search, Plus } from 'lucide-react';

export function RightTaskbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const utilities = [
    { icon: Plus, label: 'Thêm tiện ích', color: 'text-blue-600' },
    { icon: Settings, label: 'Cài đặt', color: 'text-slate-600' },
    { icon: Bell, label: 'Thông báo', color: 'text-amber-600' },
    { icon: MessageCircle, label: 'Tin nhắn', color: 'text-green-600' },
    { icon: Calendar, label: 'Lịch', color: 'text-purple-600' },
    { icon: Search, label: 'Tìm kiếm', color: 'text-orange-600' },
  ];

  const handleMouseEnter = () => {
    setIsVisible(true);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    setIsHovering(false);
  };

  return (
    <div className="fixed right-0 top-0 h-full z-[9999] pointer-events-none">
      {/* Hover trigger area - wider and more visible */}
      <div
        className="absolute right-0 top-0 w-8 h-full bg-transparent pointer-events-auto cursor-pointer"
        onMouseEnter={handleMouseEnter}
      />

      {/* Taskbar */}
      <div
        className={`
          absolute right-3 top-1/2 -translate-y-1/2
          w-16 px-3 py-4
          bg-white/90 backdrop-blur-xl
          border border-gray-200/50 shadow-2xl
          rounded-2xl
          transition-all duration-300 ease-out
          pointer-events-auto
          ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col items-center space-y-3">
          {utilities.map((utility, index) => (
            <button
              key={index}
              className={`
                w-10 h-10 rounded-xl
                bg-white/80 hover:bg-white
                border border-gray-200/50 hover:border-gray-300
                flex items-center justify-center
                transition-all duration-200
                hover:scale-110 hover:shadow-md
                group relative
              `}
              title={utility.label}
              onClick={() => console.log(`Clicked: ${utility.label}`)}
            >
              <utility.icon className={`w-5 h-5 ${utility.color} group-hover:scale-110 transition-transform`} />
              
              {/* Tooltip */}
              <div className="absolute right-full mr-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {utility.label}
              </div>
            </button>
          ))}
        </div>

        {/* Indicator dot */}
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg" />
        </div>
      </div>

      {/* Always visible indicator when hidden */}
      <div 
        className={`
          absolute right-0 top-1/2 -translate-y-1/2 
          w-2 h-12 
          bg-gradient-to-b from-blue-500 to-purple-500 
          rounded-l-lg shadow-lg
          transition-all duration-300
          pointer-events-auto cursor-pointer
          ${isHovering ? 'opacity-100 w-3' : 'opacity-70 hover:opacity-100 hover:w-3'}
        `}
        onMouseEnter={handleMouseEnter}
      />
    </div>
  );
}