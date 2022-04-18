import { useState } from 'react';
import { MemoListProvider } from './contexts/MemoListContext';
import { ModalProvider } from './contexts/ModalContext';
import Memo from './Memo';
import MemoList from './MemoList';
import Search from './Search';

const Home = () => {
  const [memoList, setMemoList] = useState(null);
  return (
    <div style={{ padding: 20 }}>
      <ModalProvider>
        <MemoListProvider>
          <Search />
          <Memo />
          <MemoList />
        </MemoListProvider>
      </ModalProvider>
    </div>
  );
};
export default Home;
