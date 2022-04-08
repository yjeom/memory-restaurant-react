import { TextField } from '@material-ui/core';
import React, { useState } from 'react';
import KakaoMap from './KakaoMap';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(0),
      width: 300,
    },
  },
  iconButton: {
    padding: 10,
  },
}));

const Search = () => {
  const classes = useStyles();
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
    <div>
      <form className={classes.root} onSubmit={handleSubmit}>
        <TextField
          type="search"
          placeholder="검색할 장소를 입력해주세요"
          onChange={onChange}
          value={keyWord}
          variant="outlined"
          size="small"
        />
        <IconButton
          type="submit"
          className={classes.iconButton}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </form>
      <KakaoMap searchPlace={place} />
    </div>
  );
};

export default Search;
