import { ModalProvider } from './contexts/ModalContext';
import Memo from './Memo';
import Search from './Search';

const Home = () => {
  return (
    <div style={{ padding: 20 }}>
      <ModalProvider>
        <Search />
        <Memo />
      </ModalProvider>
    </div>
  );
};
export default Home;
