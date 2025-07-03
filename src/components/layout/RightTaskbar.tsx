import React, { useState } from 'react';
import { Settings, Bell, MessageCircle, Calendar, Search } from 'lucide-react';

export function RightTaskbar() {
  const [isVisible, setIsVisible] = useState(false);

  const utilities = [
    { icon: Settings, label: 'Cài đặt', color: 'text-slate-600' },
    { icon: Bell, label: 'Thông báo', color: 'text-blue-600' },
    { icon: MessageCircle, label: 'Tin nhắn', color: 'text-green-600' },
    { icon: Calendar, label: 'Lịch', color: 'text-purple-600' },
    { icon: Search, label: 'Tìm kiếm', color: 'text-orange-600' },
  ];

  return (
    <div className="fixed right-0 top-0 h-full z-50">
      {/* Hover trigger area */}
      <div
        className="absolute right-0 top-0 w-4 h-full bg-transparent cursor-pointer"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      />

      {/* Taskbar */}
      <div
        className={`
          absolute right-2 top-1/2 -translate-y-1/2
          w-16 px-3 py-4
          bg-white/80 backdrop-blur-xl
          border border-white/20
          rounded-2xl shadow-2xl
          transition-all duration-300 ease-out
          ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
        `}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <div className="flex flex-col items-center space-y-4">
          {utilities.map((utility, index) => (
            <button
              key={index}
              className={`
                w-10 h-10 rounded-xl
                bg-white/60 hover:bg-white/80
                border border-white/30
                flex items-center justify-center
                transition-all duration-200
                hover:scale-110 hover:shadow-lg
                group
              `}
              title={utility.label}
            >
              <utility.icon className={`w-5 h-5 ${utility.color} group-hover:scale-110 transition-transform`} />
            </button>
          ))}
        </div>

        {/* Indicator dot */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2">
          <div className="w-2 h-2 rounded-full bg-blue-500/60 animate-pulse" />
        </div>
      </div>

      {/* Small indicator when hidden */}
      {!isVisible && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500/40 to-purple-500/40 rounded-l-full" />
      )}
    </div>
  );
}