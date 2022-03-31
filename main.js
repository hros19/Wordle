document.addEventListener("DOMContentLoaded", () => {
  crearMatriz();
  
  /**
   * Creamos la matriz desde el inicio de carga del documento.
   */
  function crearMatriz() {
    const matriz = document.getElementById("matriz")
    for (let i = 0; i < 30; i++) {
      let cuadrado = document.createElement("div")
      cuadrado.classList.add("cuadrado")
      cuadrado.setAttribute("id", i + 1)
      matriz.appendChild(cuadrado);
    }
  }
});

// Botones elegidos actualmente
var letrasElegidas = [];

// Palabra elegida (al azar)
var palabraElegida = "";

// Cuadrado actual (incial de la matriz)
var indCuadrado = 1;

// Variable para las estadísticas
var totalJugadas = 0;
var totalPerdidas = 0;
var partidasGanadas = [0, 0, 0, 0, 0, 0];
var rachaActual = 0;
var mejorRacha = 0;

// Todos los botones del teclado como un array
const teclas = document.querySelectorAll('.teclado button')

// Fila actual en donde se encuentra, tambien puede verse como cantidad de palabras correctas.
var filaActual = 0;

// Se elije una palabra de forma aleatoria.
elegirPalabra();

/**
 * Función que reiniciar el juego y por ende todos sus elementos a sus valores por defecto.
 */
function reiniciarJuego() {
  verStats();
  letrasElegidas = [];
  elegirPalabra();
  reiniciarTablero();
  indCuadrado = 1;
  filaActual = 0;
  desactivarTeclado();
  setTimeout(() => { encenderTeclado(); }, 2000);
  setTimeout(() => { reiniciarAnimaciones(); }, 2010);
}

/**
 * Función que elige una palabra de forma aleatoria.
 */
function elegirPalabra() {
  palabraElegida = lista_palabras[getRandomInt(853)].toUpperCase();
}

/**
 * Acción de los botones de las letras del teclado. Que se encarga de agregar la letra a la matriz y a la lista de letras elegidas.
 * @param {String} letter El valor de la letra elegida 
 * @param {*} id El id del elemento del HTML.
 * @returns --
 */
function letra(letter, id) {
  if (letrasElegidas.length == 5) {
    window.alert("Ya no puedes elegir mas letras!")
    return;
  }
  let cuadradoActual = document.getElementById(indCuadrado++);
  cuadradoActual.textContent = letter;
  cuadradoActual.backgroundColor = "#1f1f1f";
  letrasElegidas.push(id);
}

/**
 * Función que oculta la ventana modal que es donde se almacenan las estadísticas.
 */
function ocultarStats() {
  var ventanaStats = document.getElementById("modal-container");
  ventanaStats.style.opacity = "0";
  ventanaStats.style.pointerEvents = "none";
}

/**
 * Función que permite mostrar la ventana modal de las estadísticas.
 */
function mostrarStats() {
  verStats();
  var ventanaStats = document.getElementById("modal-container");
  ventanaStats.style.opacity = "100";
  ventanaStats.style.pointerEvents = "auto";
}

/**
 * Función encargada de darle vida a los botones del teclado con funciones especiales.
 * @param {String} nombre Nombre del botón como tal.
 * @returns --
 */
function teclaFuncional(nombre) {
  if (nombre == 'backspace') {
    if (letrasElegidas.length == 0) {
      return;
    }
    let cuadradoFinal = document.getElementById(--indCuadrado);
    cuadradoFinal.textContent = "";
    cuadradoFinal.backgroundColor = "#000000";
    letrasElegidas.pop();
    return;
  }
  //Si ha elegido pocas palabras
  if (letrasElegidas.length < 5) {
    mostrarMsjError("Debe elegir letras suficientes!");
    return;
  }
  if (!palabraValida()) {
    mostrarMsjError("La palabra esta en la lista de palabras");
    return;
  } else {
    verificarCampos();
    return;
  }
}

/**
 * Hace una llamada al reinicio del juego luego de 1 segundo.
 * @returns --
 */
function callReinicio() {
  setTimeout(() => { reiniciarJuego(); }, 1000);
  return;
}

/**
 * Función que en realidad actualiza los stats, un olor de software.
 */
function verStats() {
  var parag = document.getElementById("statsParag");

  parag.innerHTML = statsToString();
}

/**
 * Verifica los campos en donde el usuario ha colocado letras y hace
 * la respectiva lógica.
 * @returns --
 */
function verificarCampos() {
  var palabraDigitada = formarPalabra();

  var flagPalabraNull = true;

  //Jugador termino y gano
  if (palabraDigitada == palabraElegida) {
    actualizarStats("gano");
    verStats();
    for (let i in letrasElegidas) {
      var letra = document.getElementById(letrasElegidas[i]);
      letra.style.backgroundColor = 'green';
      letra.style.borderColor = 'white';
    }
    for (let i = indCuadrado-1; i != indCuadrado-6; i--) {
      var cuadrado = document.getElementById(i);
      cuadrado.style.backgroundColor = 'green';
      cuadrado.style.borderColor = 'white';
    }
    window.alert("Felicidades, has ganado!");
    quitarLetrasTablero();
    return;
  }

  var posIguales = getPosIguales(); //Son letras que esta en la posicion correcta.
  var posRotables = getPosRotables(); //Rotable es que pertenece a la palabra pero no en esa posicion.
  var totalElemCambiar = posIguales.length + posRotables.length;
  var posRestantes = [0, 1, 2, 3 ,4];

  //Colorear posiciones iguales
  if (posIguales.length != 0) {
    for (let i = 0; i < 5; i++) {
      if (posIguales.indexOf(i) != -1) {
        totalElemCambiar--;
        posRestantes = arrayRemove(posRestantes, i);
        var letra = document.getElementById(letrasElegidas[i]);
        letra.style.backgroundColor = 'green';
        letra.style.borderColor = 'white';

        var cuadrado = document.getElementById(i + 1 + (5 * filaActual));
        cuadrado.style.backgroundColor = 'green';
        cuadrado.style.borderColor = 'white';
      }
    }
  }

  //Colorear posiciones rotables
  if (posRotables.length != 0) {
    for (let i = 0; i < 5; i++) {
      if (posRotables.indexOf(i) != -1) {
        var letra = document.getElementById(letrasElegidas[i]);
        var cuadrado = document.getElementById(i + 1 + (5 * filaActual));
        if (cuadrado.style.backgroundColor != 'green') {
          letra.style.backgroundColor = 'orange';
          letra.style.borderColor = 'white';

          cuadrado.style.backgroundColor = 'orange';
          cuadrado.style.borderColor = 'white';
          posRestantes = arrayRemove(posRestantes, i);
          totalElemCambiar--;
        }
      }
    }
  }

  //No pertenecen a la palabra
  for (let i = 0; i < 5; i++) {
    if (posRestantes.indexOf(i) != -1) {
      var letra = document.getElementById(letrasElegidas[i]);
      var cuadrado = document.getElementById(i + 1 + (5 * filaActual));
      
      if (palabraElegida.indexOf(letra.textContent.charAt(7)) == -1) {
        letra.classList.add('fade');
        letra.disabled = true;
        letra.style.backgroundColor = "#252525";
        letra.style.borderColor = "#252525";
      }

      cuadrado.style.backgroundColor = "#252525";
      cuadrado.style.borderColor = "#252525";
    }
  }
  avanzarFila();
  return;
}

/**
 * Reinicia todos los valores de animaciones y demás.
 */
function reiniciarAnimaciones() {
  for (let i = 0; i < teclas.length; i++) {
    teclas[i].classList.remove("fade");
    teclas[i].classList.remove("fadeSonic");
  }
}

/**
 * Función que actualiza las estadísticas dependiendo del resultado obtenido.
 * @param {String} estado String que indica si gano o perdio.
 */
function actualizarStats(estado) {
  totalJugadas++;

  if (rachaActual > mejorRacha) {
    mejorRacha = rachaActual;
  }

  if (estado == "perdio") {
    totalPerdidas++;
    rachaActual = 0;
  } else {
    calcularGanadas();
  }
}

/**
 * Función que le suma un punto a la victoria dependiendo de cuantas
 * palabras requirio el jugador para ganar.
 */
function calcularGanadas() {
  switch (filaActual) {
    case 0: //a la primera
      partidasGanadas[0]++;
      break;
    case 1: //a la segunda
      partidasGanadas[1]++;
      break;
    case 2: //a la tercera
      partidasGanadas[2]++;
      break;
    case 3: //a la cuarta
      partidasGanadas[3]++;
      break;
    case 4: //a la quinta
      partidasGanadas[4]++;
      break;
    case 5: //apenas
      partidasGanadas[5]++;
  }
}

/**
 * Función que devuelve un array con las posiciones de las letras que se borraron.
 * @param {Array} arr Array que contiene los valores a eliminar. 
 * @param {*} value El valor a eliminar.
 * @returns --
 */
function arrayRemove(arr, value) {
  return arr.filter(function(ele) {
    return ele != value;
  });
}

/**
 * Función para sacar la sumatoria de un array.
 * @param {Array} arr El array a sumar sus valores. 
 * @returns El resultado de todos los valores sumados del array.
 */
function sumOfArray(arr) {
  var result = 0;
  for (let i in arr) {
    result += arr[i];
  }
  return result;
}

/**
 * Función que sirve para volver a darle vida al teclado, tanto para animaciones como para que se pueda volver a usar.
 */
function encenderTeclado() {
  //Activar
  var enter = document.getElementById("enter")
  var backspace = document.getElementById("backspace")
  for (let i = 0; i < teclas.length; i++) {
    teclas[i].disabled = false;
    teclas[i].classList.add('fadeSonic');
    teclas[i].style.backgroundColor = "#504f4f";
    teclas[i].style.borderColor = "#797979";
  }
  enter.style.background = "#f14519";
  enter.style.borderColor = "#eee";
  backspace.style.background = "#f14519";
  backspace.style.borderColor = "#eee";
}

/**
 * Función para avanzar de fila ya sea que perdió o si puede seguir avanzando.
 * @returns --
 */
function avanzarFila() {
  if (filaActual == 5) {
    //Termino el juego.
    actualizarStats("perdio");
    verStats();
    desactivarTeclado();
    window.alert("La respuesta es: " + palabraElegida + ". Mejor suerte a la proxima!");
    reiniciarJuego();
    return;
  }
  filaActual++;
  letrasElegidas = [];
}

/**
 * Función que permite obtener las estadísticas como un String.
 * @returns Un String con todas las estadísticas del usuario en la sesión.
 */
function statsToString() {
  let stats = "";
  var totalGanadas = totalJugadas - totalPerdidas;
  var winrate = Math.round((totalGanadas/totalJugadas)*100);

  stats += "Partidas Jugadas: " + totalJugadas + '<br/>';
  stats += "Partidas Ganadas: " + totalGanadas + '<br/>';
  stats += "Partidas Perdidas: " + totalPerdidas + '<br/>';
  stats += "Porcentaje de victorias: " + winrate + "%" + '<br/>';
  stats += "Racha actual: " + rachaActual + '<br/>';
  stats += "Mejor racha: " + mejorRacha + '<br/><br/>';
  stats += "Victorias según cantidad de intentos: " + '<br/>';
  stats += "Un intento: " + partidasGanadas[0] + '<br/>';
  stats += "Dos intentos: " + partidasGanadas[1] + '<br/>';
  stats += "Tres intentos: " + partidasGanadas[2] + '<br/>';
  stats += "Cuatro intentos: " + partidasGanadas[3] + '<br/>';
  stats += "Cinco intentos: " + partidasGanadas[4] + '<br/>';
  stats += "Apenas: " + partidasGanadas[5] + '<br/>';

  return stats;
}

/**
 * @returns un array con todas las posiciones que son rotables de la palabra.
 * Entiendose como rotables a aquellas posiciones de la palabra que si pertenecen
 * a ella pero que no están en el lugar correcto.
 */
function getPosRotables() {
  var palabraDigitada = formarPalabra();
  var posicionesRotables = [];

  var posIguales = getPosIguales();
  var letrasRotables = [];

  for (let i = 0; i < 5; i++) {
    var letraActual = palabraDigitada.charAt(i);

    if (palabraElegida.indexOf(letraActual) != -1 &&
        posIguales.indexOf(palabraElegida.indexOf(letraActual)) == -1) {
      if (posicionesRotables.indexOf(i) == -1 && letrasRotables.indexOf(letraActual) == -1) {
        letrasRotables.push(letraActual);
        posicionesRotables.push(i);
      }
    }
  }
  return posicionesRotables;
}

/**
 * @returns un array con las posiciones de las letras que están en el lugar correcto.
 */
function getPosIguales() {
  var posicionesIguales = [];
  var palabraDigitada = formarPalabra();

  if (palabraDigitada.charAt(0) == palabraElegida.charAt(0)) {
    posicionesIguales.push(0);
  }
  if (palabraDigitada.charAt(1) == palabraElegida.charAt(1)) {
    posicionesIguales.push(1);
  }
  if (palabraDigitada.charAt(2) == palabraElegida.charAt(2)) {
    posicionesIguales.push(2);
  }
  if (palabraDigitada.charAt(3) == palabraElegida.charAt(3)) {
    posicionesIguales.push(3);
  }
  if (palabraDigitada.charAt(4) == palabraElegida.charAt(4)) {
    posicionesIguales.push(4);
  }
  return posicionesIguales;
}

function getIndCuadroActual() {
  return indCuadrado;
}

function mostrarMsjError(mensaje) {
  window.alert(mensaje)
}

/**
 * @returns True, si la palabra digitada es correcta. False, si no lo es.
 */
function palabraValida() {
  var palabraFinal = formarPalabra();

  for (let carac in lista_palabras) {
    if  (palabraFinal.toUpperCase() == lista_palabras[carac].toUpperCase()) {
      return true;
    }
  }
  return false;
}

/**
 * @returns Un string con todas las letras que digitó el usuario.
 */
function formarPalabra() {
  var palabraFinal = "";
  for (let i in letrasElegidas) {
    var letra = document.getElementById(letrasElegidas[i]);
    palabraFinal += letra.textContent.charAt(7);
  }
  return palabraFinal;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Función para borrar todas las letras que se han elegido hasta ahora.
 */
function quitarLetrasTablero() {
  for (let i = 1; i < 31; i++) {
    var cuadrado = document.getElementById(i);
    cuadrado.textContent = "";
  }
}

/**
 * Función para reiniciar el tablero como tal, entendionse como la matriz
 * que se muestra en la página
 */
function reiniciarTablero() {
  for (let i = 1; i < 31; i++) {
    var cuadrado = document.getElementById(i);
    cuadrado.style.borderColor = "#818181";
    cuadrado.style.background = "#000000";
    cuadrado.textContent = "";
  }
}

/**
 * Función para reiniciar todas las animaciones y funcionalidades del teclado.
 */
function reiniciarTeclado() {
  var enter = document.getElementById("enter")
  var backspace = document.getElementById("backspace")
  for (let i = 0; i < teclas.length; i++) {
    teclas[i].disabled = false;
    teclas[i].classList.add('fadeSonic');
    teclas[i].style.backgroundColor = "#504f4f";
    teclas[i].style.borderColor = "#797979";
  }
  enter.style.background = "#f14519";
  enter.style.borderColor = "#eee";
  backspace.style.background = "#f14519";
  backspace.style.borderColor = "#eee";
} 

/**
 * Función para desactivar el teclado.
 */
function desactivarTeclado() {
  document.getElementById("enter").disabled = true;
  document.getElementById("backspace").disabled = true;
  for (let i = 0; i < teclas.length; i++) {
    teclas[i].disabled = true;
    teclas[i].classList.add('fade');
  }
}