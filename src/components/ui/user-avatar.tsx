import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOnlineStatus?: boolean;
}

const sizeMap = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl'
};

export function UserAvatar({ size = 'md', className, showOnlineStatus = false }: UserAvatarProps) {
  const { profile } = useAuth();
  const { employee } = useProfile();

  const displayName = employee?.full_name || profile?.full_name || 'User';
  const avatarUrl = employee?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <Avatar className={cn(sizeMap[size], 'border-2 border-white shadow-sm', className)}>
        <AvatarImage 
          src={avatarUrl} 
          alt={displayName}
          className="object-cover" 
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