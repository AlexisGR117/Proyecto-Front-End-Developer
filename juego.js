function crearJuego() {
    const casillas = $('#casillas');
    casillas.css("gridTemplateRows", `repeat(${tablero.length}, ${100 / tablero.length}%)`);
    casillas.css("gridTemplateColumns", `repeat(${tablero.length}, ${100 / tablero.length}%)`);
    colocarFichas(casillas);   
    casillas.click(function(evt) {
        if (evt.target.className === 'ficha')  seleccionar(evt);
        else if (evt.target.className === 'ficha transparente')  mover(evt);
    });
    $("#nombre-uno").text(jugadorUno.nombre);
    $("#color-uno").text(jugadorUno.color);
    $("#nombre-dos").text(jugadorDos.nombre);
    $("#color-dos").text(jugadorDos.color);
    refrescarInformacion();
}

function refrescarInformacion() {
    $("#movimientos-uno").text(jugadorUno.movimientos);
    $("#fichas-uno").text(jugadorUno.fichas.length);
    $("#capturas-uno").text((tablero.length/2 - 1)  * (tablero.length/2) - jugadorDos.fichas.length);
    $("#movimientos-dos").text(jugadorDos.movimientos);
    $("#fichas-dos").text(jugadorDos.fichas.length);
    $("#capturas-dos").text((tablero.length/2 - 1)  * (tablero.length/2) - jugadorUno.fichas.length);
    $("#turno").text(turno.nombre);
}

function colocarFichas(casillas) {
    let letras = "";
    let numeros = "";
    for (let i = 0; i < tablero.length; i++) {
        letras += `<div>${String.fromCharCode(i + 65)}</div>`;
        numeros += `<div>${i + 1}</div>`;
        for (let j = 0; j < tablero.length; j++) {
            let nuevaCasilla = "";
            if (tablero[i][j] != null) {
                nuevaCasilla = `<div class="casilla" id="fila-${i}-columna-${j}">`;
                if (tablero[i][j].ficha !== null) {
                    nuevaCasilla += `<img class="ficha" src="img/${tablero[i][j].ficha.tipo}${tablero[i][j].ficha.jugador.color}.png"></div>`;
                } else {
                    nuevaCasilla += '</div>';
                }
            } else {
                nuevaCasilla = '<div></div>';
            }
            casillas.append(nuevaCasilla);
        }
    }
    $('.archivo').append(letras);
    $('.rango').append(numeros);
}

function seleccionar(evt) {
    let idCasilla = evt.target.parentNode.id.split('-');
    seleccionarFicha(idCasilla[1], idCasilla[3]);
    if(fichaSeleccionada === fichaTablero(idCasilla[1], idCasilla[3])){
        $(".transparente").remove();
        $(".seleccion").removeClass("seleccion");
        fichaSeleccionada.movimientosPosibles().forEach(function(movimiento) {
            $(`#fila-${movimiento[0]}-columna-${movimiento[1]}`).prepend( 
            `<img class="ficha transparente" src="img/${fichaSeleccionada.tipo}${fichaSeleccionada.jugador.color}Transparente.png">`);
        });
        $(evt.target).parent().addClass("seleccion");
    }
}

function mover(evt) {
    let idCasilla = evt.target.parentNode.id.split('-');
    console.log("(" + idCasilla[1] + ", " + idCasilla[3] + ")")
    let nuevaFila = idCasilla[1];
    let nuevaColumna = idCasilla[3];
    let filaAnterior = fichaSeleccionada.casilla.fila;
    let columnaAnterior = fichaSeleccionada.casilla.columna;
    let casillaAnterior = $(`#fila-${filaAnterior}-columna-${columnaAnterior}`);
    casillaAnterior.removeClass("seleccion");
    casillaAnterior.find(".ficha").remove();
    capturar(nuevaFila, nuevaColumna, filaAnterior, columnaAnterior);
    $(".transparente").remove();
    fichaSeleccionada.mover(+nuevaFila, +nuevaColumna);
    $(`#fila-${nuevaFila}-columna-${nuevaColumna}`).prepend( 
        `<img class="ficha" src="img/${fichaTablero(nuevaFila, nuevaColumna).tipo}${fichaTablero(nuevaFila, nuevaColumna).jugador.color}.png">`);
    refrescarInformacion();
}

function capturar(nuevaFila, nuevaColumna, filaAnterior, columnaAnterior) {
    let diferenciaFilas = nuevaFila - filaAnterior;
    let diferenciaColumnas = nuevaColumna - columnaAnterior;
    let movimientoFila = 1;
    let movimientoColumna = 1;
    if (diferenciaFilas < 0) movimientoFila = -1;
    if (diferenciaColumnas < 0) movimientoColumna = -1;			
    if (Math.abs(diferenciaFilas) > 1) {
        let captura = false;
        for (let i = 1; i < Math.abs(diferenciaFilas) && !captura; i++) {
            let fila = filaAnterior+i*movimientoFila;
            let columna = columnaAnterior+i*movimientoColumna;
            let elemento = $(`#fila-${fila}-columna-${columna}`);
            console.log(elemento);
            console.log(elemento.children().length);
            console.log(tablero[fila][columna].ficha);
            if (tablero[fila][columna].ficha !== null) {
                elemento.children().remove();
                captura = true; 
            }
        }	
    }
}

crearJuego();
