import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import ModalContext, { ModalConsumer } from './contexts/ModalContext';
import { withStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';
import axios from 'axios';
import { API_BASE_URL } from './app-config';
import MemoListContext from './contexts/MemoListContext';

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    height: 500,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    '& .MuiGrid-root': {
      marginBottom: theme.spacing(3),
    },
  },
  oneLine: {
    width: 350,
    display: 'relative',
  },
}));

const Memo = () => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [imgName, setImgName] = useState('');
  const { state, actions } = useContext(ModalContext);
  const { memoList, listFunc } = useContext(MemoListContext);

  function validate() {
    if (state.content === '') {
      document.getElementById('content-error').style.display = 'block';
      document.getElementById('content').focus();
      return false;
    }
    return true;
  }
  function setFormData() {
    let formData = new FormData();
    formData.append(
      'imgFile',
      document.getElementById('icon-button-file').files[0],
    );
    let data = {
      rating: state.rating,
      content: state.content,
      memoId: state.memoId,
    };
    formData.append(
      'memo',
      new Blob([JSON.stringify(data)], { type: 'application/json' }),
    );
    formData.append(
      'place',
      new Blob([JSON.stringify(state.place)], { type: 'application/json' }),
    );
    return formData;
  }
  function submitHandler() {
    let check = validate();
    if (!check) {
      return;
    }
    let formData = setFormData();
    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    axios
      .post(API_BASE_URL + '/placeMemo', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(function (response) {
        if (response.status == 200) {
          console.log(response);
          alert('저장되었습니다');
          actions.setIsOpen(false);
          memoReset();
          if (memoList.isShow) {
            let reverse = memoList.memoList.reverse().concat(response.data);
            let next = reverse.reverse();
            listFunc.setMemoList(next);
          }
        }
      })
      .catch(function (error) {});
  }
  function updateHandler() {
    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    let formData = setFormData();
    formData.delete('place');
    axios
      .put(API_BASE_URL + '/placeMemo', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(function (response) {
        if (response.status == 200) {
          console.log(response);
          alert('수정되었습니다');
          actions.setIsOpen(false);
          memoReset();
          if (memoList.isShow) {
            const back = memoList.memoList.filter(
              (memoList) => memoList.placeMemoId > response.data.placeMemoId,
            );
            const front = memoList.memoList.filter(
              (memoList) => memoList.placeMemoId < response.data.placeMemoId,
            );
            const next = back.concat(response.data).concat(front);
            listFunc.setMemoList(next);
          }
        }
      })
      .catch(function (error) {});
  }

  function deleteHandler() {
    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    const deleteId = state.memoId;
    console.log(accessToken);
    axios
      .delete(API_BASE_URL + '/placeMemo', {
        data: {
          memoId: deleteId,
        },

        headers: {
          // 'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      })
      .then(function (response) {
        if (response.status == 200) {
          console.log(response);
          alert('삭제되었습니다');
          actions.setIsOpen(false);
          memoReset();
          if (memoList.isShow) {
            const next = memoList.memoList.filter(
              (memoList) => memoList.placeMemoId !== deleteId,
            );
            listFunc.setMemoList(next);
          }
        }
      })
      .catch(function (error) {});
  }

  function memoReset() {
    actions.setIsUpdate(false);
    actions.setRating(2.5);
    setImgName('');
    actions.setContent('');
    actions.setMemoId(0);
  }
  return (
    <div>
      <Modal
        open={state.isOpen}
        onClose={() => {
          actions.setIsOpen(false);
          memoReset();
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form
            id="memoForm"
            className={classes.root}
            onSubmit={() => {
              return false;
            }}
          >
            <input
              type="hidden"
              value={state.memoId}
              name="memo-id"
              id="memo-id"
            />

            <Grid container>
              <input
                name="memo-place"
                id="memo-place"
                type="hidden"
                value={state.place}
              ></input>
              <h2 id="simple-modal-title">{state.place.place_name}</h2>
              <Grid item xs={12}>
                <Box component="fieldset" borderColor="transparent">
                  <Typography component="legend">점수</Typography>
                  <StyledRating
                    name="rating"
                    value={state.rating}
                    precision={0.5}
                    icon={<FavoriteIcon fontSize="inherit" />}
                    onChange={(event, newValue) => {
                      actions.setRating(newValue);
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Input
                    placeholder="이미지를 등록해주세요"
                    value={imgName}
                    readOnly
                    endAdornment={
                      <InputAdornment position="end">
                        <Input
                          accept="image/*"
                          id="icon-button-file"
                          name="imgFile"
                          type="file"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            var fileName = e.target.value.split('\\').pop();
                            setImgName(fileName);
                          }}
                        />
                        <InputLabel htmlFor="icon-button-file">
                          <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                          >
                            <PhotoCamera />
                          </IconButton>
                        </InputLabel>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="content"
                  label="리뷰내용을 작성해주세요"
                  multiline
                  minRows={4}
                  variant="outlined"
                  onChange={(e) => {
                    if (e.target.value !== '') {
                      document.getElementById('content-error').style.display =
                        'none';
                    }
                    actions.setContent(e.target.value);
                  }}
                  value={state.content}
                />
                <Typography
                  id="content-error"
                  variant="button"
                  display="block"
                  gutterBottom
                  color="error"
                  style={{ display: 'none' }}
                >
                  내용을 작성해주세요
                </Typography>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="flex-end"
              >
                {state.isUpdate ? (
                  <div>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={updateHandler}
                    >
                      수정하기
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={deleteHandler}
                    >
                      삭제하기
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      submitHandler();
                    }}
                  >
                    작성완료
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
    </div>
  );
};
export default Memo;
