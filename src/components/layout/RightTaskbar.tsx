import React from 'react';
import { Settings, Bell, MessageCircle, Calendar, Search, Plus, Home, User, BarChart3, FileText } from 'lucide-react';

export function RightTaskbar() {
  const utilities = [
    { icon: Home, label: 'Trang chủ', color: 'from-blue-500 to-blue-600' },
    { icon: User, label: 'Hồ sơ', color: 'from-green-500 to-green-600' },
    { icon: BarChart3, label: 'Thống kê', color: 'from-purple-500 to-purple-600' },
    { icon: FileText, label: 'Báo cáo', color: 'from-orange-500 to-orange-600' },
    { icon: Bell, label: 'Thông báo', color: 'from-red-500 to-red-600' },
    { icon: MessageCircle, label: 'Tin nhắn', color: 'from-teal-500 to-teal-600' },
    { icon: Calendar, label: 'Lịch', color: 'from-indigo-500 to-indigo-600' },
    { icon: Search, label: 'Tìm kiếm', color: 'from-pink-500 to-pink-600' },
    { icon: Settings, label: 'Cài đặt', color: 'from-gray-500 to-gray-600' },
    { icon: Plus, label: 'Thêm tiện ích', color: 'from-emerald-500 to-emerald-600' },
  ];

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-4">
        <div className="flex flex-col gap-3">
          {utilities.map((utility, index) => (
            <button
              key={index}
              className={`
                relative group w-14 h-14 rounded-2xl
                bg-gradient-to-br ${utility.color}
                hover:scale-110 hover:rotate-3 
                transition-all duration-300 ease-out
                shadow-lg hover:shadow-xl
                flex items-center justify-center
                overflow-hidden
              `}
              title={utility.label}
              onClick={() => alert(`Clicked: ${utility.label}`)}
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Icon */}
              <utility.icon className="w-6 h-6 text-white z-10 group-hover:scale-110 transition-transform duration-300" />
              
              {/* Tooltip */}
              <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap translate-x-2 group-hover:translate-x-0">
                {utility.label}
                <div className="absolute left-full top-1/2 -translate-y-1/2 border-l-4 border-l-gray-900/90 border-y-4 border-y-transparent"></div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500/30 rounded-full blur-sm"></div>
        <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-purple-500/30 rounded-full blur-sm"></div>
      </div>
    </div>
  );
}