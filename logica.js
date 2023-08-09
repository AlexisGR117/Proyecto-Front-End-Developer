var tablero = [];
var jugadorUno = {
    color: "Negro",
    nombre: "Jefer",
    lado: "Norte",
    fichas: [],
    movimientos: 0,
}
var jugadorDos = {
    color: "Blanco",
    nombre: "Alexis",
    lado: "Sur",
    fichas: [],
    movimientos: 0,
}
var turno = jugadorDos;
var fichaSeleccionada = null;
function hacerTablero(tamanoLado) {
    for (let i = 0; i < tamanoLado; i++) {
        let fila = [];
        for (let j = 0; j < tamanoLado; j++) {
            let casilla = null;
            if((i%2 == 0 && j%2 != 0) || (i%2 != 0 && j%2 == 0)) {
                casilla = { 
                    columna: j,
                    fila: i,
                    ficha: null
                }
                if (i < tamanoLado/2 - 1) casilla.ficha = crearFicha(jugadorUno, casilla);
				else if (i > tamanoLado/2) casilla.ficha = crearFicha(jugadorDos, casilla);
            }
            fila.push(casilla)
        }
        tablero.push(fila);
    }
}

function crearFicha(jugador, casilla) {
    jugador.fichas.push(this);
    let ficha = {
        jugador: jugador,
        casilla: casilla,
        tipo: "Peon",
        /**
         * Da las posibles posiciones en las que la ficha puede capturar al moverse.
         * 
         * @returns {number[][]} Arreglo con los saltos posibles en arreglos donde en la posicion 0 está la final y en la 1 la columna.
         */
        saltosPosibles: function() {
            let saltos = [];
            let fila = this.casilla.fila;
            let columna = this.casilla.columna;
            let diferenciaFila = 1;
            if (this.jugador.lado === "Sur") diferenciaFila = -1;
            let filaOponente = fila + diferenciaFila;
            let nuevaFila = fila + diferenciaFila * 2;
            for (let diferenciaColumna = -1; diferenciaColumna < 2; diferenciaColumna ++) {
                let columnaOponente = columna + diferenciaColumna;
                let nuevaColumna = columna + diferenciaColumna * 2;
                if (diferenciaColumna !== 0 && dentroTablero(filaOponente, columnaOponente) 
                    && fichaTablero(filaOponente, columnaOponente) !== null && fichaTablero(filaOponente, columnaOponente).jugador.lado !== this.jugador.lado
                    && dentroTablero(nuevaFila, nuevaColumna) && fichaTablero(nuevaFila, nuevaColumna) === null) {
                    saltos.push([nuevaFila, nuevaColumna]);
                }
            }
            return saltos;
        },
        /**
         * Da las posibles posiciones a las que se puede mover la ficha en el tablero.
         * 
         * @returns {number[][]} Arreglo con los movimientos posibles en arreglos donde en la posicion 0 está la final y en la 1 la columna.
         */
        movimientosPosibles: function() {
            let movimientos = [];
            let fila = this.casilla.fila;
            let columna = this.casilla.columna;
            let diferenciaFila = 1;
            if (this.jugador.lado === "Sur") diferenciaFila = -1;
            let nuevaFila = fila + diferenciaFila;
            for (let diferenciaColumna = -1; diferenciaColumna < 2; diferenciaColumna ++) {
                let nuevaColumna = columna + diferenciaColumna;
                if (diferenciaColumna !== 0 && dentroTablero(nuevaFila, nuevaColumna) 
                    && fichaTablero(nuevaFila, nuevaColumna) === null) {
                    movimientos.push([nuevaFila, nuevaColumna]);
                }
            }
            movimientos.push(...this.saltosPosibles());
            return movimientos;
        },
        /**
         * 
         * @param {number} fila 
         * @param {number} columna  
         */
        mover: function(fila, columna) {
            if (this.jugador === turno){
                let movimientos = this.movimientosPosibles();
                for (let i = 0; i < movimientos.length; i++) {
                    console.log(movimientos[i][0] + ", " + movimientos[i][1]);
                }
                let movimiento = [fila, columna];
                let posible = movimientos.some(arreglo => JSON.stringify(arreglo) === JSON.stringify(movimiento));
                if (posible) {
                    let diferenciaFilas = fila - this.casilla.fila;
                    let diferenciaColumnas = columna - this.casilla.columna;
                    let movimientoFila = 1;
                    let movimientoColumna = 1;
                    if (diferenciaFilas < 0) movimientoFila = -1;
                    if (diferenciaColumnas < 0) movimientoColumna = -1;			
                    if (Math.abs(diferenciaFilas) > 1) {
                        let captura = false;
                        for (let i = 1; i < Math.abs(diferenciaFilas) && !captura; i++) {
                            let fichaCaptura = tablero[this.casilla.fila+i*movimientoFila][this.casilla.columna+i*movimientoColumna].ficha;
                            if (fichaCaptura !== null) {
                                fichaCaptura.casilla.ficha = null;
                                fichaCaptura.casilla = null;
                                fichaCaptura.jugador.fichas.splice(fichaCaptura.jugador.fichas.indexOf(fichaCaptura), 1);
                                captura = true;
                            }
                        }	
                    }
                    this.casilla.ficha = null;
                    this.casilla = tablero[fila][columna];
                    this.casilla.ficha = this;
                    if (this.tipo === "Peon" && ((this.jugador.lado === 'Norte' && this.casilla.fila === tablero.length - 1) ||
                    (this.jugador.lado === 'Sur' &&  this.casilla.fila === 0))) {
                        this.tipo = "Dama";
                        this.saltosPosibles = function() {
                            let saltos = [];
                            let filaActual = this.casilla.fila;
                            let columnaActual = this.casilla.columna;
                            let tamano = tablero.length;
                            let diagonalSuperiorIzquierda = 0;
                            let diagonalInferiorDerecha = 0;
                            let diagonalSuperiorDerecha = 0;
                            let diagonalInferiorIzquierda = 0;
                            for(let diferencia = 1; diferencia <= filaActual && diferencia <= columnaActual && diagonalSuperiorIzquierda < 2; diferencia++){
                                let ficha = fichaTablero(filaActual-diferencia, columnaActual-diferencia);
                                if (ficha !== null) {
                                    if (ficha.jugador.lado !== this.jugador.lado) diagonalSuperiorIzquierda += 1;
                                    else diagonalSuperiorIzquierda += 2;
                                } else if (diagonalSuperiorIzquierda === 1) {
                                    saltos.push([filaActual-diferencia, columnaActual-diferencia]);
                                }
                            }
                            for(let diferencia = 1; diferencia < tamano - filaActual && diferencia < tamano - columnaActual && diagonalInferiorDerecha < 2; diferencia++){
                                let ficha = fichaTablero(filaActual+diferencia, columnaActual+diferencia);
                                if (ficha !== null) {
                                    if (ficha.jugador.lado !== this.jugador.lado) diagonalInferiorDerecha += 1;
                                    else diagonalInferiorDerecha += 2;
                                } else if (diagonalInferiorDerecha === 1) {
                                    saltos.push([filaActual+diferencia, columnaActual+diferencia]);
                                }
                            }
                            for(let diferencia = 1; diferencia <= filaActual && diferencia < tamano - columnaActual && diagonalSuperiorDerecha < 2; diferencia++){
                                let ficha = fichaTablero(filaActual-diferencia, columnaActual+diferencia);
                                if (ficha !== null) {
                                    if (ficha.jugador.lado !== this.jugador.lado) diagonalSuperiorDerecha += 1;
                                    else diagonalSuperiorDerecha += 2;
                                } else if (diagonalSuperiorDerecha === 1) {
                                    saltos.push([filaActual-diferencia, columnaActual+diferencia]);
                                }
                            }
                            for(let diferencia = 1; diferencia < tamano - filaActual && diferencia <= columnaActual && diagonalInferiorIzquierda < 2; diferencia++){
                                let ficha = fichaTablero(filaActual+diferencia, columnaActual-diferencia);
                                if (ficha !== null) {
                                    if (ficha.jugador.lado !== this.jugador.lado) diagonalInferiorIzquierda += 1;
                                    else diagonalInferiorIzquierda += 2;
                                } else if (diagonalInferiorIzquierda === 1) {
                                    saltos.push( [filaActual+diferencia, columnaActual-diferencia]);
                                }
                            }
                            return saltos;
                        };
                        this.movimientosPosibles = function() {
                            let movimientos = [];
                            let filaActual = this.casilla.fila;
                            let columnaActual = this.casilla.columna;
                            let tamano = tablero.length;
                            let diagonalSuperiorIzquierda = true;
                            let diagonalInferiorDerecha = true;
                            let diagonalSuperiorDerecha = true;
                            let diagonalInferiorIzquierda = true;
                            for(let diferencia = 1; diferencia <= filaActual && diferencia <= columnaActual && diagonalSuperiorIzquierda; diferencia++){
                                if (fichaTablero(filaActual-diferencia, columnaActual-diferencia) !== null) diagonalSuperiorIzquierda = false;
                                else  movimientos.push([filaActual-diferencia, columnaActual-diferencia]);
                            }
                            for(let diferencia = 1; diferencia < tamano - filaActual && diferencia < tamano - columnaActual && diagonalInferiorDerecha; diferencia++){
                                if (fichaTablero(filaActual+diferencia, columnaActual+diferencia) !== null) diagonalInferiorDerecha = false;
                                else movimientos.push([filaActual+diferencia, columnaActual+diferencia]);
                            }
                            for(let diferencia = 1; diferencia <= filaActual && diferencia < tamano - columnaActual && diagonalSuperiorDerecha; diferencia++){
                                if (fichaTablero(filaActual-diferencia, columnaActual+diferencia) !== null) diagonalSuperiorDerecha = false;
                                else movimientos.push([filaActual-diferencia, columnaActual+diferencia]);
                            }
                            for(let diferencia = 1; diferencia < tamano - filaActual && diferencia <= columnaActual && diagonalInferiorIzquierda; diferencia++){
                                if (fichaTablero(filaActual+diferencia, columnaActual-diferencia) !== null) diagonalInferiorIzquierda = false;
                                else movimientos.push([filaActual+diferencia, columnaActual-diferencia]);
                            }
                            movimientos.push(...this.saltosPosibles());
                            return movimientos;
                        };
                    }
                    fichaSeleccionada = null;
                    this.jugador.movimientos ++;
                    turno === jugadorUno ? turno = jugadorDos : turno = jugadorUno;
                }
            }
            imprimirTablero();
            console.log();
        }
    };
    return ficha;
}

/**
 * Retorna la ficha de la casilla ubicada en la posicion dada.
 * 
 * @param {number} fila - La fila de la casilla en la que esta la ficha.
 * @param {number} columna - La columna de la casilla en la que esta la ficha.
 * @returns {boolean} La ficha que esta en la posicion dada.
 */
function fichaTablero(fila, columna) {
    return tablero[fila][columna] !== null ? tablero[fila][columna].ficha : null;
}

/**
 * Dice si una posicion dada esta dentro del tablero.
 * 
 * @param {number} fila - La fila de la posicion que se quiere verificar.
 * @param {number} columna - La columna de la posicion que se quiere verificar.
 * @returns {boolean} True si la posicion esta dentro del tablero, de lo contario, False.
 */
function dentroTablero(fila, columna) {
    return 0 <= fila && fila < tablero.length && 0 <= columna && columna < tablero.length;
}


hacerTablero(10);

function imprimirTablero() {
    for (let i = 0; i < tablero.length; i++) {
        let fila = '['
        for (let j = 0; j < tablero.length; j++){
            if (tablero[i][j] === null || (tablero[i][j] !== null && tablero[i][j].ficha === null)) fila += 'null, ';
            else fila += tablero[i][j].ficha.tipo + tablero[i][j].ficha.jugador.color + ', ';
        }
        fila += ']'
        console.log(fila);
    }    
}

function seleccionarFicha(fila, columna) {
    if (tablero[fila][columna].ficha.jugador == turno) {
        fichaSeleccionada = tablero[fila][columna].ficha;
    }
}

