
import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb } from 'lucide-react';
import { IdeaWidget } from '@/components/widgets/IdeaWidget';

export function RightTaskbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const taskbarRef = useRef<HTMLDivElement>(null);

  const utilities = [
    { 
      id: 'idea',
      icon: Lightbulb, 
      label: 'iDea - Ý tưởng', 
      color: 'text-yellow-500',
      widget: IdeaWidget
    }
  ];

  const handleMouseEnter = () => {
    setIsVisible(true);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    setIsHovering(false);
  };

  const handleUtilityClick = (utilityId: string) => {
    if (activeWidget === utilityId) {
      setActiveWidget(null);
    } else {
      setActiveWidget(utilityId);
    }
  };

  const handleCloseWidget = () => {
    setActiveWidget(null);
  };

  return (
    <div className="fixed right-0 top-0 h-full z-[40] pointer-events-none">
      {/* Backdrop overlay when widget is active */}
      {activeWidget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] pointer-events-auto" />
      )}

      {/* Active Widget */}
      {activeWidget && (() => {
        const utility = utilities.find(u => u.id === activeWidget);
        const WidgetComponent = utility?.widget;
        return WidgetComponent ? (
          <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-auto" data-widget-container>
            <WidgetComponent onClose={handleCloseWidget} />
          </div>
        ) : null;
      })()}

      {/* Taskbar */}
      <div
        ref={taskbarRef}
        className={`
          absolute right-3 top-1/2 -translate-y-1/2
          w-16 px-3 py-4
          bg-white/90 backdrop-blur-xl
          border border-gray-200/50 shadow-2xl
          rounded-2xl
          transition-all duration-300 ease-out
          pointer-events-auto
          z-[50]
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
                ${activeWidget === utility.id 
                  ? 'bg-primary text-primary-foreground shadow-lg scale-110' 
                  : 'bg-white/80 hover:bg-white'}
                border border-gray-200/50 hover:border-gray-300
                flex items-center justify-center
                transition-all duration-200
                hover:scale-110 hover:shadow-md
                group relative
              `}
              title={utility.label}
              onClick={(e) => {
                e.stopPropagation();
                handleUtilityClick(utility.id);
              }}
            >
              <utility.icon className={`w-5 h-5 ${
                activeWidget === utility.id ? 'text-primary-foreground' : utility.color
              } group-hover:scale-110 transition-transform`} />
              
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

      {/* Always visible indicator when hidden - smaller hover area */}
      <div 
        className={`
          absolute right-0 top-1/2 -translate-y-1/2 
          w-2 h-12 
          bg-gradient-to-b from-blue-500 to-purple-500 
          rounded-l-lg shadow-lg
          transition-all duration-300
          pointer-events-auto cursor-pointer
          z-[50]
          ${isHovering ? 'opacity-100 w-3' : 'opacity-70 hover:opacity-100 hover:w-3'}
        `}
        onMouseEnter={handleMouseEnter}
        style={{ paddingTop: '8px', paddingBottom: '8px' }}
      />
    </div>
  );
}
