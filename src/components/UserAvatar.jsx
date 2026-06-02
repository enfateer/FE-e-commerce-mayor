import { getProfilePictureUrl } from '../utils/media';

const sizeClasses = {
  sm: 'w-9 h-9 text-sm',
  md: 'w-12 h-12 text-lg',
  lg: 'w-14 h-14 text-xl',
  xl: 'w-28 h-28 text-4xl',
};

const UserAvatar = ({ name, profilePicture, size = 'sm', className = '' }) => {
  const src = getProfilePictureUrl(profilePicture);
  const initial = name?.charAt(0)?.toUpperCase() || 'U';
  const sizeClass = sizeClasses[size] || sizeClasses.sm;

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'User'}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 border border-surface-200 dark:border-surface-600 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}
    >
      {initial}
    </div>
  );
};

export default UserAvatar;
