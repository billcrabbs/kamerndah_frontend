'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { selectModal, hideModal } from '@/store/slices/uiSlice';
import { FeedbackModal } from '@/components/shared/FeedbackModal';

export function UIProvider({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const modal = useSelector(selectModal);

  const handleClose = () => {
    if (modal.redirect) {
      router.push(modal.redirect);
    }
    dispatch(hideModal());
  };

  return (
    <>
      {children}
      <AnimatePresence>
        {modal.isOpen && (
          <FeedbackModal
            isOpen={modal.isOpen}
            onClose={handleClose}
            type={modal.type}
            title={modal.title}
            message={modal.message}
            actionText={modal.actionText}
          />
        )}
      </AnimatePresence>
    </>
  );
}
