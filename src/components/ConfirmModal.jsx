import { HiOutlineExclamationCircle } from "react-icons/hi";

const ConfirmModal = ({
  show,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Yes, I'm sure",
  cancelText = "Cancel",
  danger = true,
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-xl p-6">
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-surface-400 dark:text-surface-200" />
          <h3 className="mb-2 text-lg font-semibold text-surface-800 dark:text-surface-200">
            {title}
          </h3>
          <p className="mb-5 text-sm text-surface-500 dark:text-surface-400">
            {message}
          </p>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={onConfirm}
              className={
                danger
                  ? "px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
                  : "px-4 py-2 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors"
              }
            >
              {confirmText}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-900 dark:text-white transition-colors"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
