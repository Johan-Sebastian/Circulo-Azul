import React from 'react'; // Importa React desde la biblioteca 'react'
import ReactDOM from 'react-dom/client'; // Importa ReactDOM desde 'react-dom/client'
import './index.css'; // Importa el archivo de estilos index.css
import App from './App'; // Importa el componente App desde './App'
import reportWebVitals from './reportWebVitals'; // Importa la función reportWebVitals desde './reportWebVitals'

const root = ReactDOM.createRoot(document.getElementById('root')); // Crea un contenedor de raíz utilizando ReactDOM.createRoot y lo asigna a la variable root
root.render( // Renderiza el componente App dentro del contenedor de raíz
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);
// Llama a la función reportWebVitals para medir el rendimiento de la aplicación web
reportWebVitals();