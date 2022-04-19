import { Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { Favorite } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import { withStyles } from '@material-ui/styles';
import jwtDecode from 'jwt-decode';
import React, { useContext, useEffect, useState } from 'react';
import { API_BASE_URL, HOST_URL } from './app-config';
import MemoListContext from './contexts/MemoListContext';
import ModalContext from './contexts/ModalContext';
import './memo.css';

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

const MemoList = () => {
  const { state, actions } = useContext(ModalContext);
  const { memoList, listFunc } = useContext(MemoListContext);
  const classes = useStyles();
  const token = localStorage.getItem('ACCESS_TOKEN');
  let member = 'member';
  if (token !== null) {
    member = jwtDecode(token).sub;
  }
  return (
    <div className="memoList">
      <Grid container>
        <Grid item xs={6}>
          {memoList.isShow && <h4> [{memoList.listPlace.place_name}] 리뷰</h4>}
          {memoList.isShow &&
            memoList.memoList.map((memo, index) => (
              <Paper key={index} className={classes.paper}>
                <Grid container spacing={2}>
                  <Grid item className={classes.image}>
                    <img
                      className={classes.img}
                      src={
                        memo.imgUrl != null
                          ? API_BASE_URL + memo.imgUrl
                          : HOST_URL + '/default.png'
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <StyledRating
                          name="rating"
                          value={memo.rating}
                          precision={0.5}
                          icon={<Favorite fontSize="inherit" />}
                          size="small"
                          readOnly
                        />
                        <Typography
                          gutterBottom
                          variant="subtitle1"
                          className="memoList-content"
                        >
                          {memo.content}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="textSecondary"
                          align="right"
                        >
                          {memo.regDate}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item>
                      {member === memo.memberEmail ? (
                        <Button
                          color="primary"
                          onClick={() => {
                            actions.setIsUpdate(true);
                            actions.setRating(memo.rating);
                            actions.setContent(memo.content);
                            actions.setMemoId(memo.placeMemoId);
                            actions.setPlace(memoList.listPlace);
                            actions.setIsOpen(true);
                          }}
                        >
                          편집하기
                        </Button>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default MemoList;
