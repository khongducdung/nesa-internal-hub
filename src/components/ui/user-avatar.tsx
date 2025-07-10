
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOnlineStatus?: boolean;
  forceRefresh?: boolean;
}

const sizeMap = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl'
};

export function UserAvatar({ size = 'md', className, showOnlineStatus = false, forceRefresh = false }: UserAvatarProps) {
  const { profile } = useAuth();
  const { employee } = useProfile();

  const displayName = employee?.full_name || profile?.full_name || 'User';
  // Add timestamp to force refresh the image if needed
  const avatarUrl = employee?.avatar_url ? 
    (forceRefresh ? `${employee.avatar_url}?t=${Date.now()}` : employee.avatar_url) : 
    undefined;
  const initials = displayName.charAt(0).toUpperCase();

  console.log('UserAvatar rendering:', {
    displayName,
    avatarUrl,
    employee: employee?.id,
    profile: profile?.id
  });

  return (
    <div className="relative">
      <Avatar className={cn(sizeMap[size], 'border-2 border-white shadow-sm', className)}>
        <AvatarImage 
          src={avatarUrl} 
          alt={displayName}
          className="object-cover"
          onLoad={() => console.log('Avatar image loaded:', avatarUrl)}
          onError={(e) => console.error('Avatar image load error:', e, avatarUrl)}
        />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {showOnlineStatus && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <div className="h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
      )}
    </div>
  );
}
