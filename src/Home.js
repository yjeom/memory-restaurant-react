import { Link } from 'react-router-dom';
import Search from './Search';

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <p> Wellcom to first page </p>
      <Link to="/about">about</Link>
      <Search />
    </div>
  );
};
export default Home;
