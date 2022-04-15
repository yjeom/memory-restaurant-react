import {
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import { API_BASE_URL } from './app-config';

const SingUp = () => {
  const submitHandler = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const name = data.get('name');
    const email = data.get('email');
    const password = data.get('password');
    signUp({ name: name, email: email, password: password });
  };
  function signUp(memberDto) {
    axios
      .post(API_BASE_URL + '/auth/signUp', memberDto, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        window.location.href = '/login';
      });
  }
  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: '8%' }}>
      <form noValidate onSubmit={submitHandler}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography component="h1" variant="h5">
              회원가입
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="fname"
              name="name"
              id="name"
              variant="outlined"
              required
              fullWidth
              label="이름"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="email"
              name="email"
              id="email"
              variant="outlined"
              required
              fullWidth
              label="이메일 주소"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="current-password"
              name="password"
              id="password"
              variant="outlined"
              type="password"
              required
              fullWidth
              label="패스워드"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              회원가입
            </Button>
          </Grid>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                이미 회원이신가요? 로그인 하세요.
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};
export default SingUp;
