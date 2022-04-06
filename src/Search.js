import React, { useState } from 'react';
import KakaoMap from './KakaoMap';

const Search = () => {
  const [keyWord, setKeyWord] = useState('');
  const [place, setPlace] = useState('');

  const onChange = (e) => {
    setKeyWord(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlace(keyWord);
    setKeyWord('');
  };

  return (
    <>
      <form className="inputForm" onSubmit={handleSubmit}>
        <input
          placeholder="검색할 장소를 입력해주세요"
          onChange={onChange}
          value={keyWord}
        />
        <button type="submit">검색</button>
      </form>
      <KakaoMap searchPlace={place} />
    </>
  );
};

export default Search;
