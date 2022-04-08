import { createContext, useState } from 'react';

const ModalContext = createContext({
  state: { isOpen: false, place: [] },
  actions: {
    setIsOpen: () => {},
    setPlace: () => {},
  },
});

const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [place, setPlace] = useState([]);

  const value = {
    state: { isOpen, place },
    actions: { setIsOpen, setPlace },
  };
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
const { Consumer: ModalConsumer } = ModalContext;

export { ModalProvider, ModalConsumer };
export default ModalContext;
