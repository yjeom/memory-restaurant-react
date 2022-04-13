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
import { call } from './service/ApiService';

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
  const [rating, setRating] = useState(2.5);
  const [imgName, setImgName] = useState('');
  const [content, setContent] = useState('');
  const { state, actions } = useContext(ModalContext);

  function submitHandler() {
    var formData = new FormData();
    formData.append(
      'imgFile',
      document.getElementById('icon-button-file').files[0],
    );
    let data = {
      rating: rating,
      content: content,
    };
    formData.append(
      'memo',
      new Blob([JSON.stringify(data)], { type: 'application/json' }),
    );
    formData.append(
      'place',
      new Blob([JSON.stringify(state.place)], { type: 'application/json' }),
    );
    axios
      .post(API_BASE_URL + '/placeMemo', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        if (response.status == 200) {
          alert('저장되었습니다');
          actions.setIsOpen(false);
          memoReset();
        }
      })
      .catch((error) => {
        console.log(error.response);
        console.log(error.message);
      });
  }
  function memoReset() {
    setRating(2.5);
    setImgName('');
    setContent('');
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
                    value={rating}
                    precision={0.5}
                    icon={<FavoriteIcon fontSize="inherit" />}
                    onChange={(event, newValue) => {
                      setRating(newValue);
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
                    setContent(e.target.value);
                  }}
                />
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="flex-end"
              >
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
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
    </div>
  );
};
export default Memo;
