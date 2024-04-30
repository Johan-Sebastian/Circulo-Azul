import React from "react"; // Importa React desde la biblioteca react
import cocinero from "../assets/images/Cocinero.jpg"; // Importa la imagen del cocinero desde la ruta de imágenes
import mesero from "../assets/images/Mesero.jpg"; // Importa la imagen del mesero desde la ruta de imágenes
import docente from "../assets/images/Maestra.jpg"; // Importa la imagen del docente desde la ruta de imágenes
import "../css/menu1.css"; // Importa el archivo de estilos CSS para el menú 1

import { styled } from '@mui/material/styles'; // Importa la función styled para crear estilos personalizados en Material-UI
import Paper from '@mui/material/Paper'; // Importa el componente Paper de Material-UI
import { getAuth, signOut } from "firebase/auth"; // Importa las funciones getAuth y signOut de Firebase Authentication
import { Link } from "react-router-dom"; // Importa el componente Link de react-router-dom
import { firebaseApp } from "../firebase/firebaseConfig"; // Importa la configuración de Firebase desde firebaseConfig.js
import Button from "@material-ui/core/Button"; // Importa el componente Button de Material-UI

const Item = styled(Paper)(({ theme }) => ({ // Estilos personalizados para el componente Paper
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  textAlign: 'center',
}));

// Obtiene la instancia de autenticación de Firebase
const auth = getAuth(firebaseApp);

// Definición del componente MenuUsuario
const MenuUsuario = () => {
  return (
    <React.Fragment>
      <div className="header_Line">
          <hr className="line" /> {/* Línea divisoria */}
          <h2 className="page_Title">Mi Circulo-Azul</h2> {/* Título de la página */}
      </div>
      <div className="header_Menu">
          {/* Otros elementos del encabezado del menú */}
          {/* Estilo personalizado para el botón de cerrar sesión */}
          <Button
            style={{ backgroundColor: "#b2dafa", fontWeight: "bolder" }}
            variant="contained"
            size="large"
            onClick={() => signOut(auth)}> {/* Manejador de evento para cerrar sesión */}
            Cerrar Sesión
          </Button>
      </div>
      <div class="container_Menu">
          {/* Contenedor de opciones de menú */}
          <div class="options_Menu">
              {/* Opciones de menú */}
              <div class="option_Menu">
                  <Link to="/Cocina"><img src={cocinero} onClick="" /> {/* Enlace a la página de Cocina */}
                  <h3 className="titles_Menu">COCINA</h3></Link> {/* Título de la opción */}
              </div>

              <div class="option_Menu" style={{ textDecoration: 'none' }}>
                  <Link to="/Docente"><img src={docente} onClick="" /> {/* Enlace a la página de Docente */}
                  <h3 className="titles_Menu">DOCENTE</h3></Link> {/* Título de la opción */}
              </div>
          </div>

          <div class="big-option_Menu">
              <Link to="/Meseros"><img src={mesero} onClick="" /> {/* Enlace a la página de Meseros */}
              <h3 className="titles_Menu">MESERO</h3></Link> {/* Título de la opción */}
          </div>
      </div>
    </React.Fragment>
  );
};
// Exporta el componente MenuUsuario
export default MenuUsuario;