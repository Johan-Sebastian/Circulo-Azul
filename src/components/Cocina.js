// Cocina.js
import React from "react";
import "../css/cocina.css"; // Asegúrate de tener este archivo de estilos

const Docente = () => {
  return (
    <tbody>
        <div class="header">
        <h1>Meseros Activos</h1>
        <div class="meseros">
            <div class="mesero">Meseros - 1</div>

        </div>
        </div>
        <div class="section">
            <h2>Órdenes Pendientes</h2>
        </div>
        <table class="mesas-table">
            <tr>
                
                <td>Huevo frito - 2</td>
            </tr>
        </table>
        <table class="mesas-table">
            <tr>
                <td>Melones con Cotege - 3</td>
            </tr>
        </table>
        <div class="section">
            <h2>Órdenes en Preparación</h2>
        </div>
        <table class="mesas-table">
            <tr>
                <td>Chilaquiles Verdes con Pollo - 2</td>
            </tr>
        </table>
        <div class="section">
            <h2>Órdenes Listas</h2>
        </div>
        <table class="mesas-table">
            <tr>
                <td>Café - 1</td>
            </tr>
        </table>
        <button class="reservas-button">Ver Reservas de Bodega</button>
    </tbody>
  );
};

export default Docente;
