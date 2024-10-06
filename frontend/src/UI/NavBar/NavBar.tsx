import {AppBar, Toolbar, Container, Typography, Box, Grid} from '@mui/material';
import RealTimeTalkLogo from '../../assets/images/logo.png';
import {NavLink} from 'react-router-dom';
import {useAppSelector} from '../../app/hooks';
import {selectUser} from '../../features/users/usersSlice';
import UserMenu from './UserMenu';

const NavBar = () => {
  const user = useAppSelector(selectUser);

  return (
    <AppBar position="static" sx={{mb: 3, p: .4}}>
      <Toolbar>
        <Container maxWidth="lg">
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Box component={NavLink} to="/" display="flex" alignItems="center" sx={{textDecoration: 'none', color: '#fff'}}>
                <img src={RealTimeTalkLogo} alt="Logo" style={{width: 55, height: 55, marginRight: 10, borderRadius: '10px'}}/>
                <Typography variant="h5" component="span">
                  LiveChat
                </Typography>
              </Box>
            </Grid>
            {user && (<UserMenu user={user}/>)}
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;