import * as React from 'react'; // Importar React
import Avatar from '@mui/material/Avatar'; // Importa el componente Avatar de Material-UI
import Button from '@mui/material/Button'; // Importa el componente Button de Material-UI
import CssBaseline from '@mui/material/CssBaseline'; // Importa el componente CssBaseline de Material-UI
import TextField from '@mui/material/TextField'; // Importa el componente TextField de Material-UI
import Box from '@mui/material/Box'; // Importa el componente Box de Material-UI
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Importa el icono LockOutlined de Material-UI
import Typography from '@mui/material/Typography'; // Importa el componente Typography de Material-UI
import Container from '@mui/material/Container'; // Importa el componente Container de Material-UI
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { firebaseApp } from '../firebase/firebaseConfig'; // Importa la configuración de Firebase desde firebaseConfig.js
import{getAuth,signInWithEmailAndPassword,onAuthStateChanged }from "firebase/auth"; // Importa funciones de autenticación de Firebase

// Obtiene la instancia de autenticación de Firebase
const auth = getAuth(firebaseApp);

// Define el tema de Material-UI
const theme = createTheme();
// Define el componente funcional SignIn
const SignIn=()=> {
  // Función asincrónica para manejar el envío del formulario
  async function handleSubmit(event){
    event.preventDefault(); // Evita el comportamiento por defecto del formulario
    const data = new FormData(event.currentTarget); // Obtiene los datos del formulario
    const email=data.get('email'); // Obtiene el valor del campo de correo electrónico
    const password=data.get('password'); // Obtiene el valor del campo de contraseña
    await signInWithEmailAndPassword(auth, email, password); // Inicia sesión con el correo electrónico y la contraseña proporcionados
  };

  return (
    <ThemeProvider theme={theme}> {/* Aplica el tema de Material-UI */}
      <Box alignItems="center" justifyContent="center" borderRadius={12}>
      <Container component="main" maxWidth="xs"> {/* Define el contenedor principal */}
        <CssBaseline /> {/* Restablece los estilos predeterminados del navegador */}
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}> {/* Muestra el icono de bloqueo */}
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5"> {/* Muestra el título */}
            Iniciar Sesión
          </Typography>
          {/* Define el formulario */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            /> {/* Campo de entrada para el correo electrónico */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            /> {/* Campo de entrada para la contraseña */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            > {/* Botón para iniciar sesión */}
              Sign In
            </Button> 
          </Box>
        </Box>
      </Container>
      </Box>
    </ThemeProvider>
  );
}
// Exporta el componente SignIn por defecto
export default SignIn;