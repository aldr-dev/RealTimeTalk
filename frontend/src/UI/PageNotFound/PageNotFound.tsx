import {Link} from 'react-router-dom';
import {Container, Typography, Box, Button} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

const PageNotFound = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="calc(100vh - 150px)"
      py={{md: 5}}>
      <Container>
        <Box textAlign="center">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
            mb={1}>
            <Typography variant="h1" fontWeight="bold" color="#fff">
              4
            </Typography>
            <ErrorIcon color="error" sx={{fontSize: '50px'}}/>
            <Typography variant="h1" fontWeight="bold" sx={{transform: 'scaleX(-1)'}} color="#fff">
              4
            </Typography>
          </Box>
          <Typography variant="h4" color="#fff" mb={2}>
            Упс! Вы потерялись.
          </Typography>
          <Typography variant="body1" color="#fff" mb={5}>
            Страница, которую вы ищете, не найдена.
          </Typography>
          <Button
            to="/"
            component={Link}
            size="large"
            sx={{
              borderRadius: '50px',
              px: 5,
              color: '#fff',
              backgroundColor: '#1BD760',
              '&:hover': {
                backgroundColor: '#14A94B',
              }
              }}>Вернуться на главную
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PageNotFound;