import React from "react"; // Importa React
import "../css/vistasBD.css"; // Importa el archivo CSS correspondiente

export function ItemMenu({ item, bandera }) { // Define un componente de función llamado ItemMenu que recibe props 'item' y 'bandera'
  var Clase = "contenedor-item" // Inicializa una variable 'Clase' con el valor "contenedor-item"
  if (bandera == true){ // Verifica si la prop 'bandera' es verdadera
    Clase = "contenedor-recomendado" // Si es verdadera, actualiza la variable 'Clase' con el valor "contenedor-recomendado"
  }
  console.log(bandera); // Imprime la prop 'bandera' en la consola
  return (
    <> {/* Fragmento de React */}
      <div className={Clase} key={item.IdItem}> {/* Renderiza un div con una clase determinada por la variable 'Clase' y una clave única proporcionada por la propiedad 'item.IdItem' */}
        <img src={item.Foto} alt={item.Nombre} className="imagen-item" /> {/* Renderiza una imagen con la URL proporcionada por 'item.Foto' y un texto alternativo proporcionado por 'item.Nombre' */}
        <div className="contenedor-nombre"> {/* Renderiza un div con la clase 'contenedor-nombre' */}
          <p className="nombre-item">{item.Nombre}</p> {/* Renderiza un párrafo con la clase 'nombre-item' y el nombre proporcionado por 'item.Nombre' */}
        </div>
      </div>
    </>
  );
}