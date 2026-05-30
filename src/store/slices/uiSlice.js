import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modal: {
    isOpen: false,
    type: 'success', // 'success' | 'error'
    title: '',
    message: '',
    actionText: '',
    redirect: '',
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type || 'success',
        title: action.payload.title || '',
        message: action.payload.message || '',
        actionText: action.payload.actionText || '',
        redirect: action.payload.redirect || '',
      };
    },
    hideModal: (state) => {
      state.modal.isOpen = false;
    }
  }
});

export const { showModal, hideModal } = uiSlice.actions;
export const selectModal = (state) => state.ui.modal;
export default uiSlice.reducer;
