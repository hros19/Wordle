document.addEventListener("DOMContentLoaded", () => {
  crearMatriz();

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

//Palabras sacadas del .json
//let objPrincipal = {};

//Botones elegidos actualmente
var letrasElegidas = [];

//Palabra elegida (al azar)
var palabraElegida = "";

//Cuadrado actual
var indCuadrado = 1;

//Estadisticas <<<<
var totalJugadas = 0;
var totalPerdidas = 0;
var partidasGanadas = [0, 0, 0, 0, 0, 0];
var rachaActual = 0;
var mejorRacha = 0;

//Botones del teclado
const teclas = document.querySelectorAll('.teclado button')

//Fila actual
var filaActual = 0;

//Leer desde el .json
/*
fetch("./lista_palabras.json")
    .then(function(resp) {
      return resp.json();
    })
    .then(function(data) {
      objPrincipal = data;
      elegirPalabra();
      verStats();
    });
*/

elegirPalabra();

function reiniciarJuego() {
  verStats();
  letrasElegidas = [];
  elegirPalabra();
  reiniciarTablero();
  indCuadrado = 1;
  filaActual = 0;
  desactivarTeclado();
  setTimeout(() => { encenderTeclado(); }, 2000);
}

function elegirPalabra() {
  palabraElegida = lista_palabras[getRandomInt(853)].toUpperCase();
}
/*
function elegirPalabra() {
  palabraElegida = objPrincipal[getRandomInt(853)].toUpperCase();
  //window.alert(palabraElegida)
}
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

function ocultarStats() {
  var ventanaStats = document.getElementById("modal-container");
  ventanaStats.style.opacity = "0";
  ventanaStats.style.pointerEvents = "none";
}

function mostrarStats() {
  verStats();
  var ventanaStats = document.getElementById("modal-container");
  ventanaStats.style.opacity = "100";
  ventanaStats.style.pointerEvents = "auto";
}

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

function verStats() {
  var parag = document.getElementById("statsParag");

  parag.innerHTML = statsToString();
}

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
    setTimeout(() => { reiniciarJuego(); }, 2000);
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

function arrayRemove(arr, value) {
  return arr.filter(function(ele) {
    return ele != value;
  });
}

function sumOfArray(arr) {
  var result = 0;
  for (let i in arr) {
    result += arr[i];
  }
  return result;
}

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
  stats += "Victorias segun cantidad de intentos: " + '<br/>';
  stats += "Un intento: " + partidasGanadas[0] + '<br/>';
  stats += "Dos intentos: " + partidasGanadas[1] + '<br/>';
  stats += "Tres intentos: " + partidasGanadas[2] + '<br/>';
  stats += "Cuatro intentos: " + partidasGanadas[3] + '<br/>';
  stats += "Cinco intentos: " + partidasGanadas[4] + '<br/>';
  stats += "Apenas: " + partidasGanadas[5] + '<br/>';

  return stats;
}

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

function palabraValida() {
  var palabraFinal = formarPalabra();

  for (let carac in lista_palabras) {
    if  (palabraFinal.toUpperCase() == lista_palabras[carac].toUpperCase()) {
      return true;
    }
  }
  return false;
}

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

function reiniciarTablero() {
  for (let i = 1; i < 31; i++) {
    var cuadrado = document.getElementById(i);
    cuadrado.style.borderColor = "#818181";
    cuadrado.style.background = "#000000";
    cuadrado.textContent = "";
  }
}

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

function desactivarTeclado() {
  document.getElementById("enter").disabled = true;
  document.getElementById("backspace").disabled = true;
  for (let i = 0; i < teclas.length; i++) {
    teclas[i].disabled = true;
    teclas[i].classList.add('fade');
  }
}