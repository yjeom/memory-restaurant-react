import { createContext, useState } from 'react';

const ModalContext = createContext({
  state: {
    isOpen: false,
    place: [],
    isUpdate: false,
    rating: '2.5',
    content: '',
  },
  actions: {
    setIsOpen: () => {},
    setPlace: () => {},
    setIsUpdate: () => {},
    setRating: () => {},
    setContent: () => {},
  },
});

const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [place, setPlace] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [rating, setRating] = useState(2.5);
  const [content, setContent] = useState('');

  const value = {
    state: { isOpen, place, isUpdate, rating, content },
    actions: { setIsOpen, setPlace, setIsUpdate, setRating, setContent },
  };
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

const { Consumer: ModalConsumer } = ModalContext;

export { ModalProvider, ModalConsumer };
export default ModalContext;
