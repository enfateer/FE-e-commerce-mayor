import { HiInbox } from 'react-icons/hi';

const EmptyState = ({ icon: Icon = HiInbox, title = 'No data found', description = 'There is nothing here yet.' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-primary-500" />
      </div>
      <h3 className="text-xl font-semibold text-surface-800 dark:text-surface-200 mb-2">{title}</h3>
      <p className="text-surface-500 dark:text-surface-400 max-w-sm">{description}</p>
    </div>
  );
};

export default EmptyState;
