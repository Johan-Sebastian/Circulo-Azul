//Código para realizar una recomendación en base a condiciones
function RecomendarBebida(platillo) {
    if (platillo == "Chilaquiles Verdes con Pollo") {
        return("Jugo");
    } else if (platillo == "Chilaquiles Rojos con Huevo"){
        return("Jugo");
    } else if (platillo == "Omelet de Jamón con Queso"){
        return("Leche");
    } else if (platillo == "Huevo con Jamón"){
        return("Jugo");
    } else if (platillo == "Chilaquiles Verdes con Huevo"){
        return("Leche");
    } else if (platillo == "Chilaquiles Rojos con Pollo"){
        return("Jugo");
    } else if (platillo == "Hot Cakes con Jamón"){
        return("Avena Caliente");
    } else if (platillo == "Club Sandwich con Papas"){
        return("Café");
    } else if (platillo == "Huevo con Chorizo de Soya"){
        return("Jugo");
    } else if (platillo == "Bisteck Ranchero"){
        return("Café");
    } else if (platillo == "Huevo con Salchicha"){
        return("Jugo");
    }
  }

  export default RecomendarBebida;