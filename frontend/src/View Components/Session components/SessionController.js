// modalController.js

let modalCallback = () => {};

export const showModal = () => {
  if (typeof modalCallback === 'function') {
    modalCallback();
  }
};

export const setModalCallback = (callback) => {
  modalCallback = callback;
};
