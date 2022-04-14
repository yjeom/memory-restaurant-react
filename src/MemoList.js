import { Grid, List, ListItem } from '@material-ui/core';
import { Favorite } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import { withStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from './app-config';
import './memo.css';

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);

const MemoList = ({ responseMemoList, responsePlaceName }) => {
  const [memoList, setMemoList] = useState([]);
  const [placeName, setPlaceName] = useState('');
  useEffect(() => {
    setMemoList(responseMemoList);
    setPlaceName(responsePlaceName);
  }, [responseMemoList]);
  return (
    <div className="memoList">
      <Grid container>
        <Grid item xs={6}>
          {memoList && <h4> [{placeName}] 리뷰</h4>}
          <List>
            {memoList &&
              memoList.map((memo, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <Grid
                    item
                    xs={3}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      className="memoList-img"
                      src={API_BASE_URL + memo.imgUrl}
                    />
                  </Grid>
                  <Grid item xs={9} className="memoList-info">
                    <Grid
                      item
                      xs={12}
                      container
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                    >
                      <StyledRating
                        name="rating"
                        value={memo.rating}
                        precision={0.5}
                        icon={<Favorite fontSize="inherit" />}
                        size="small"
                        readOnly
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      container
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                    >
                      <div className="memoList-content">{memo.content}</div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      container
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="flex-end"
                    >
                      <span style={{ color: '#757575' }}>
                        작성일: {memo.regDate}
                      </span>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default MemoList;
