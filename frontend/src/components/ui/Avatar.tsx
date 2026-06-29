'use client';

import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  shape?: 'circle' | 'square';
}

export function Avatar({ src, alt, name, size = 'md', className, shape = 'circle' }: AvatarProps) {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  const shapeClasses = shape === 'circle' ? 'rounded-full' : 'rounded-lg';

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={cn(
          'object-cover bg-dark-100',
          sizes[size],
          shapeClasses,
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center font-medium bg-primary-100 text-primary-700',
        sizes[size],
        shapeClasses,
        className
      )}
      aria-label={name}
    >
      {name ? getInitials(name) : '?'}
    </div>
  );
}

export function AvatarGroup({ avatars, max = 5, size = 'md', className }: { 
  avatars: Array<{ src?: string; name?: string; alt?: string }>; 
  max?: number; 
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const sizes = {
    xs: '-ml-1',
    sm: '-ml-2',
    md: '-ml-2',
    lg: '-ml-3',
    xl: '-ml-4',
  };

  return (
    <div className={cn('flex', className)} role="group" aria-label={`${avatars.length} people`}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          alt={avatar.alt}
          size={size}
          className={cn(index > 0 && sizes[size], 'border-2 border-white dark:border-dark-900')}
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'inline-flex items-center justify-center font-medium bg-dark-100 text-dark-600 border-2 border-white dark:border-dark-900',
            sizes[size],
            size === 'xs' ? 'rounded-full' : 'rounded-full'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}