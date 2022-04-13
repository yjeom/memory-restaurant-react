import { useEffect, useState } from 'react';

const MemoList = ({ responseMemoList }) => {
  const [memoList, setMemoList] = useState([]);
  useEffect(() => {
    setMemoList(responseMemoList);
  }, [responseMemoList]);
  return (
    <div>
      <ul>
        {memoList &&
          memoList.map((memo, index) => (
            <li key={index}>
              <h1>{memo.content}</h1>
              <h1>{memo.rating}</h1>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default MemoList;
