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
let objPrincipal = {};

//Botones elegidos actualmente
var letrasElegidas = [];

//Palabra elegida (al azar)
var palabraElegida = "";

//Cuadrado actual
var indCuadrado = 1;

//Botones del teclado
const teclas = document.querySelectorAll('.teclado button')

//Fila actual
var filaActual = 0;

/*Borrar en entrega
let mostrarObj = function() {
  for (let carac in objPrincipal) {
    console.log(objPrincipal[carac]);
  };
}*/

fetch("./lista_palabras.json")
    .then(function(resp) {
      return resp.json();
    })
    .then(function(data) {
      objPrincipal = data;
      elegirPalabra();
    });

function reiniciarJuego() {
  letrasElegidas = [];
  elegirPalabra();
  indCuadrado = 1;
  filaActual = 0;
}

function elegirPalabra() {
  palabraElegida = objPrincipal[getRandomInt(853)].toUpperCase();
  //window.alert(palabraElegida)
}

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
    mostrarMsjError("La palabra no es valida!");
    return;
  } else {
    verificarCampos();
    return;
  }
}

function reiniciarJuego() {
  window.alert("Felicidades, has ganado!")
}
function verificarCampos() {
  var palabraDigitada = formarPalabra();

  var flagPalabraNull = true;

  //Jugador termino y gano
  if (palabraDigitada == palabraElegida) {
    desactivarTeclado();
    window.alert("Felicidades, has ganado!");
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
    return;
  }

  var posIguales = getPosIguales(); //Son letras que esta en la posicion correcta.
  var posRotables = getPosRotables(); //Rotable es que pertenece a la palabra pero no en esa posicion.
  var totalElemCambiar = posIguales.length + posRotables.length;

  //Colorear posiciones rotables
  if (posRotables.length != 0) {
    for (let i = 0; i < 5; i++) {
      if (posRotables.indexOf(i) != -1) {
        totalElemCambiar--;
        var letra = document.getElementById(letrasElegidas[i]);
        letra.style.backgroundColor = 'orange';
        letra.style.borderColor = 'white';

        var cuadrado = document.getElementById(i + 1 + (5 * filaActual));
        cuadrado.style.backgroundColor = 'orange';
        cuadrado.style.borderColor = 'white';
      } else {
        if (posRotables.indexOf(i) != -1) {
          continue;
        }
        var letra = document.getElementById(letrasElegidas[i]);
        if (posIguales.indexOf(i) == -1 && palabraElegida.indexOf(letra.textContent.charAt(7)) == -1) {
          var cuadrado = document.getElementById(i + 1 + (5 * filaActual));
          cuadrado.style.backgroundColor = '#252525';
          cuadrado.style.borderColor = '#252525';

          var letra = document.getElementById(letrasElegidas[i]);
          letra.style.backgroundColor = '#252525';
          letra.style.borderColor = '#252525';
          letra.disabled = true;
        } else {
          var cuadrado = document.getElementById(i + 1 + (5 * filaActual));
          cuadrado.style.backgroundColor = '#252525';
          cuadrado.style.borderColor = '#252525';
        }
      }
    }
    flagPalabraNull = false;
  }

  //Colorear posiciones iguales
  if (posIguales.length != 0) {
    for (let i = 0; i < 5; i++) {
      if (posIguales.indexOf(i) != -1) {
        totalElemCambiar--;
        var letra = document.getElementById(letrasElegidas[i]);
        letra.style.backgroundColor = 'green';
        letra.style.borderColor = 'white';
        letra.disabled = false;

        var cuadrado = document.getElementById(i + 1 + (5 * filaActual));
        cuadrado.style.backgroundColor = 'green';
        cuadrado.style.borderColor = 'white';
      } else {
        for (let i = 0; i < 5; i++) {
          var letra = document.getElementById(letrasElegidas[i]);
          if (palabraElegida.indexOf(letra.textContent.charAt(7)) == -1) {
            letra.style.backgroundColor = '#252525';
            letra.style.borderColor = '#252525';
            letra.disabled = true;

            var cuadrado = document.getElementById(i + 1 + (5 * filaActual));
            cuadrado.style.backgroundColor = '#252525';
            cuadrado.style.borderColor = '#252525';
          } else {
            if (totalElemCambiar == 0) {
              var cuadrado = document.getElementById(i + 1 + (5 * filaActual));
              cuadrado.style.backgroundColor = '#252525';
              cuadrado.style.borderColor = '#252525';
            }
          }
        }
        flagPalabraNull = false;
      } // fin else
    }
    for (let i = 0; i < 5; i++) {
      if (posIguales.indexOf(i) == -1 && posRotables.indexOf(i) == -1) {
        var cuadrado = document.getElementById(i + 1 + (5 * filaActual));
        cuadrado.style.backgroundColor = '#252525';
        cuadrado.style.borderColor = '#252525';
      }
    }
    flagPalabraNull = false;
  }

  if (flagPalabraNull == false) {
    avanzarFila();
    return;
  }

  //Son completamente diferentes
  else {
    for (let i = 0; i < 5; i++) {
      var letra = document.getElementById(letrasElegidas[i]);
      letra.style.backgroundColor = '#252525';
      letra.style.borderColor = '#252525';
      letra.disabled = true;

      var cuadrado = document.getElementById(i + 1 + (5 * filaActual));
      cuadrado.style.backgroundColor = '#252525';
      cuadrado.style.borderColor = '#252525';
    }
  }
  avanzarFila();
  window.alert(palabraElegida + " / " + palabraDigitada);
}

function avanzarFila() {
  if (filaActual == 5) {
    //Termino el juego.
    desactivarTeclado();
    window.alert("La respuesta es: " + palabraElegida + ". Mejor suerte a la proxima!");
    return;
  }
  filaActual++;
  letrasElegidas = [];
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

//borrar entrega
function setPalabra(palabra) {
  palabraElegida = palabra;
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

  for (let carac in objPrincipal) {
    if  (palabraFinal.toUpperCase() == objPrincipal[carac].toUpperCase()) {
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

/*
function reiniciarTeclado() {
  document.getElementById("enter").disabled = false;
  document.getElementById("backspace").disabled = false;
  for (let i = 0; i < teclas.length; i++) {
    teclas[i].disabled = false;
  }
} */

function desactivarTeclado() {
  document.getElementById("enter").disabled = true;
  document.getElementById("backspace").disabled = true;
  for (let i = 0; i < teclas.length; i++) {
    teclas[i].disabled = true;
  }
}