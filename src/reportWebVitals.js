const reportWebVitals = onPerfEntry => { // Define la función reportWebVitals que recibe una función onPerfEntry como argumento
  if (onPerfEntry && onPerfEntry instanceof Function) { // Verifica si onPerfEntry es una función
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => { // Importa las funciones de medición de rendimiento de web-vitals
      getCLS(onPerfEntry); // Obtiene el Layout Shift Cumulativo (CLS)
      getFID(onPerfEntry); // Obtiene el First Input Delay (FID)
      getFCP(onPerfEntry); // Obtiene el First Contentful Paint (FCP)
      getLCP(onPerfEntry); // Obtiene el Largest Contentful Paint (LCP)
      getTTFB(onPerfEntry); // Obtiene el Time to First Byte (TTFB)
    });
  }
};
// Exporta el componente reportWebVitals para index
export default reportWebVitals;