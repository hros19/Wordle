# Wordle Clone :jigsaw:
Clon del juego 'Wordle' con algunas limitaciones que lo diferencia del juego original capaz de correr sin necesidad de un servidor.

![](https://img.shields.io/badge/JavaScript-ED8B00?style=for-the-badge&logo=javascript&logoColor=white) ![](https://img.shields.io/badge/-CSS3-blue?style=for-the-badge&logo=css3&logoColor=white) ![](https://img.shields.io/badge/-HTML-red?style=for-the-badge&logo=html5&logoColor=white)

## Descripción
Este proyecto es una implementación del juego 'Wordle' utilizando solamente JavaScript Vanilla, HTML y CSS. Las reglas son iguales a las del juego originales solamente con algunas diferencias.
- El juego no tiene un límite de una palabras por día.
- La variedad y cantidad de palabras es considerablemente más pequeña.
- Se pueden ver las estadísticas detalladas de la sesión actual del juego, pero estas se pierden al momento de refrescar o abandonar la página.
- No se tiene un modo 'screenshot' o una forma para compartir el resultado obtenido de alguna forma. Sin embargo, luego de ganar una partida se eliminan las letras del tablero (matriz) por unos segundos simulando al juego original.
- Una vez se haya terminado el juego, sin importar el resultado (ganado o perdido) el juego se reinicia automáticamente al cabo de unos segundos.
- Existe la posibilidad de reiniciar el juego en cualquier momento perdiendo todo el progreso logrado pero no se sumará la derrota como tal, sin embargo, la palabra que se debe adivinar se vuelve a elegir (Esto se puede hacer ilimitadas veces).
- La palabra que se haya digitado debe existir en la lista de palabras del sistema, no se permite elegir letras al azar sin sentido y debe jugarse considerando en elegir palabras ya existentes.
- Ya sea que se adiviné la palabra, el juego se va a terminar indicando gráficamente que el usuario ganó, se desactivarán las teclas, las estadísticas se actualizan y se reinicia todo el juego.
- Al igual que el juego original, en caso de elegir una palabra que existe en la lista de palabras del sistema pero que ninguna de sus letras pertenecen a la palabra que se debe adivinar entonces todas las letras que se hayan elegido originalmente van a desaparecer del teclado (Ayudando al usuario a no tener que memorizar las letras que ya no le sirven).
- En caso de elegir una palabra con una o más letras que pertenezcan a la palabra original pero que esta no sea igual a la palabra elegida, entonces dichas letras se van a marcar como amarillo, indicando que el usuario debe usar esas letras en otras posición para dar con la palabra a adivinar.
- Las letras que se hayan elegido que pertenezcan a la palabra a adivinar y que a su vez se encuentren en la posición correcta se van a marcar con color verde indicando que esa letra pertenece a la palabra a adivinar pero que debe seguir intentando.
- Una vez el usuario haya dado con la palabra, va a indicar un mensaje de éxito mediante una alerta y se hará el proceso detallado anteriormente. 

## Como jugar :writing_hand:
- El tablero comenzará vacío, debes elegir manualmente letra por letra la palabra que deseas para luego presionar la tecla 'Enter'. En caso de cualquier equivocación podrás usar la tecla 'Backspace'.
- Podrás elegir un máximo de 5 letras por cada ronda, y el juego tiene un máximo de 6 rondas. En caso de no adivinar la palabra con 6mo intento entonces se va a contar como una pérdida (incluida en la estadísticas).
- Puedes reiniciar el juego en cualquier momento en caso de estancarse. (Hay que considerar que el juego solamente acepta palabras que existan en la lista de palabras previamente, y la lista actual que utiliza la aplicación es bastante precaria comparándola con la base de datos que utiliza el juego original. Por lo que incluso perder apropósito es todo un reto). La ventaja es que se soluciona fácilmente colocando más palabras en la lista de palabras, cosa que vendrá en siguientes actualizaciones.

## Empezar a jugar :gem:
Se puede abrir el archivo index.js en el navegador de preferencia o se puedes jugar directamente sin descargar ningún archivo haciendo [click aquí](https://hros19.github.io/Wordle/).

## Autor 🤓
![Hansol's GitHub stats](https://github-readme-stats.vercel.app/api?username=hros19&bg_color=60,1c3773,0055fb&title_color=ff5d05&text_color=fff&show_icons=true&count_private=true&icon_color=FF3838)
