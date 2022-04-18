import { createContext, useState } from 'react';

const MemoListContext = createContext({
  memoList: {
    isShow: false,
    memoList: [],
    listPlace: [],
  },
  listFunc: {
    setIsShow: () => {},
    setMemoList: () => {},
    setListPlace: () => {},
  },
});

const MemoListProvider = ({ children }) => {
  const [isShow, setIsShow] = useState(false);
  const [memoList, setMemoList] = useState([]);
  const [listPlace, setListPlace] = useState([]);

  const value = {
    memoList: { isShow, memoList, listPlace },
    listFunc: { setIsShow, setMemoList, setListPlace },
  };
  return (
    <MemoListContext.Provider value={value}>
      {children}
    </MemoListContext.Provider>
  );
};

const { Consumer: MemoListConsumer } = MemoListContext;

export { MemoListProvider, MemoListConsumer };
export default MemoListContext;
