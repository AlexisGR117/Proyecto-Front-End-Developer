class Ficha {

    constructor(jugador, fila, columna) {
      this.jugador = jugador;
      this.fila = fila;
      this.columna = columna;
    }

    getLado() {
        return this.jugador.lado;
    }

    getColor() {
        return this.jugador.color;
    }

    getTipo() {
        return this.constructor.name;
    }

    isFichaOponente(ficha) {
        return ficha.getLado() !== this.getLado();
    }
  }

class Peon extends Ficha {

    /**
     * Da las posibles posiciones en las que la ficha puede capturar al moverse.
     * 
     * @returns {number[][]} Arreglo con los saltos posibles en arreglos donde en la posicion 0 está la final y en la 1 la columna.
     */
    saltosPosibles() {
        const saltos = [];
        const diferenciaFila = this.getLado() === "Sur" ? -1 : 1;
        const filaOponente = this.fila + diferenciaFila;
        const nuevaFila = this.fila + diferenciaFila * 2;
        const direcciones = [-1, 1];
        for (const diferenciaColumna of direcciones) {
            const columnaOponente = this.columna + diferenciaColumna;
            const nuevaColumna = this.columna + diferenciaColumna * 2;
            if (modelo.isPosicionOcupada(filaOponente, columnaOponente)
                && this.isFichaOponente(modelo.getFicha(filaOponente, columnaOponente))
                && modelo.isPosicionDisponible(nuevaFila, nuevaColumna)) {
                saltos.push([nuevaFila, nuevaColumna]);
            }
        }
        return saltos;
    }

    /**
     * Da las posibles posiciones a las que se puede mover la ficha en el tablero.
     * 
     * @returns {number[][]} Arreglo con los movimientos posibles en arreglos donde en la posicion 0 está la final y en la 1 la columna.
     */
    movimientosPosibles() {
        const movimientos = [];
        const diferenciaFila = this.getLado() === "Sur" ? -1 : 1;
        const nuevaFila = this.fila + diferenciaFila;
        const direcciones = [-1, 1];
        for (const diferenciaColumna of direcciones) {
            const nuevaColumna = this.columna + diferenciaColumna;
            if (modelo.isPosicionDisponible(nuevaFila, nuevaColumna)) {
                movimientos.push([nuevaFila, nuevaColumna]);
            }
        }
        movimientos.push(...this.saltosPosibles());
        return movimientos;
    }
}

class Dama extends Ficha {

    saltosPosibles() {
        const saltos = [];
        const direcciones  = [-1, 1];
        for(const f of direcciones) for(const c of direcciones) {
            let oponente = false;
            let diferencia = 1;
            let fila = this.fila+diferencia*f;
            let columna = this.columna+diferencia*c;
            while (modelo.isPosicionValida(fila, columna)) {
                const ficha = modelo.getFicha(fila, columna);
                if (ficha !== null) {
                    if (this.isFichaOponente(ficha) && !oponente) oponente = true;
                    else break;
                } else if (oponente) {
                    saltos.push([fila, columna]);
                }
                diferencia ++;
                fila = this.fila+diferencia*f;
                columna = this.columna+diferencia*c;
            }
        }
        return saltos;
    }
    
    movimientosPosibles() {
        const movimientos = [];
        const direcciones  = [-1, 1];
        for(const f of direcciones) for(const c of direcciones) {
            let diferencia = 1;
            let fila = this.fila+diferencia*f;
            let columna = this.columna+diferencia*c;
            while(modelo.isPosicionDisponible(fila, columna)) {
                movimientos.push([fila, columna]);
                diferencia ++;
                fila = this.fila+diferencia*f;
                columna = this.columna+diferencia*c;
            }
        }
        movimientos.push(...this.saltosPosibles());
        return movimientos;
    }

}

var modelo = {
    tablero: [],
    jugadores: [{
        color: "Negro",
        nombre: "Jefer",
        lado: "Norte",
        fichas: 0,
        movimientos: 0,
    },
    {
        color: "Blanco",
        nombre: "Alexis",
        lado: "Sur",
        fichas: 0,
        movimientos: 0,
    }],
    turno: 1,
    fichaActual: null,
    bloqueo: false,
    init: function(tamanoLado) {
        for (let i = 0; i < tamanoLado; i++) {
            const fila = [];
            for (let j = 0; j < tamanoLado; j++) {
                let ficha = null;
                if((i%2 == 0 && j%2 != 0) || (i%2 != 0 && j%2 == 0)) {
                    if (i < tamanoLado/2 - 1) {
                        ficha = new Peon(this.jugadores[0], i, j);
                    }
                    else if (i > tamanoLado/2) {
                        ficha = new Peon(this.jugadores[1], i, j);
                    }
                }
                fila.push(ficha)
            }
            this.tablero.push(fila);
        }
        this.jugadores[0].fichas = (tamanoLado/2 - 1) * (tamanoLado/2);
        this.jugadores[1].fichas = (tamanoLado/2 - 1) * (tamanoLado/2);
    },
    /**
     * Retorna la ficha de la casilla ubicada en la posicion dada.
     * 
     * @param {number} fila - La fila de la casilla en la que esta la ficha.
     * @param {number} columna - La columna de la casilla en la que esta la ficha.
     * @returns {boolean} La ficha que esta en la posicion dada.
     */
    getFicha: function(fila, columna) {
        return this.tablero[fila][columna];
    },

    /**
     * Dice si una posicion dada esta dentro del tablero.
     * 
     * @param {number} fila - La fila de la posicion que se quiere verificar.
     * @param {number} columna - La columna de la posicion que se quiere verificar.
     * @returns {boolean} True si la posicion esta dentro del tablero, de lo contario, False.
     */
    isPosicionValida: function(fila, columna) {
        return 0 <= fila && fila < this.tablero.length && 0 <= columna && columna < this.tablero.length;
    },

    isPosicionDisponible: function(fila, columna) {
        return this.isPosicionValida(fila, columna) && modelo.getFicha(fila, columna) === null;
    },

    isPosicionOcupada: function(fila, columna) {
        return this.isPosicionValida(fila, columna) && modelo.getFicha(fila, columna) !== null;
    },

    imprimirTablero: function() {
        for (let i = 0; i < this.tablero.length; i++) {
            let fila = '['
            for (let j = 0; j < this.tablero.length; j++){
                if (this.tablero[i][j] === null 
                    || (this.tablero[i][j] !== null && this.tablero[i][j] === null)) fila += 'null, ';
                else fila += this.tablero[i][j].constructor.name + this.tablero[i][j].jugador.color + ', ';
            }
            fila += ']'
            console.log(fila);
        }    
    },

    seleccionarFicha: function(fila, columna) {
        if (this.tablero[fila][columna].jugador == this.jugadores[this.turno] && !this.bloqueo) {
            this.fichaActual = this.tablero[fila][columna];
        }
    },

    isMovimientoPosible: function(fila, columna) {
        const movimientos =  this.bloqueo ? this.fichaActual.saltosPosibles() : this.fichaActual.movimientosPosibles();
        for (let i = 0; i < movimientos.length; i++) {
            console.log(movimientos[i][0] + ", " + movimientos[i][1]);
        }
        return movimientos.some(arreglo => JSON.stringify(arreglo) === JSON.stringify([fila, columna]));
    },

    capturarFichas: function(fila, columna) {
        const filaActual = this.fichaActual.fila;
        const columnaActual = this.fichaActual.columna;
        const diferenciaFilas = fila - filaActual;
        const diferenciaColumnas = columna - columnaActual;
        const direccionFila = diferenciaFilas < 0 ? -1 : 1;
        const direccionColumna = diferenciaColumnas < 0 ? -1 : 1;
        if (Math.abs(diferenciaFilas) > 1) {
            for (let i = 1; i < Math.abs(diferenciaFilas); i++) {
                const filaCaptura = filaActual+i*direccionFila;
                const columnaCaptura = columnaActual+i*direccionColumna;
                const ficha = this.tablero[filaCaptura][columnaCaptura];
                if (ficha != null) {
                    ficha.jugador.fichas --;
                    this.tablero[filaCaptura][columnaCaptura] = null;
                    return true;
                }
            }	
        }
        return false;
    },

    isCambioDama: function(ficha) {
        return ficha instanceof Peon 
                && ((ficha.getLado() === 'Norte' && ficha.fila === this.tablero.length - 1) 
                || (ficha.getLado() === 'Sur' && ficha.fila === 0));
    },

    moverSeleccion(fila, columna) {
        if (this.isMovimientoPosible(fila, columna)) {
            const filaActual = this.fichaActual.fila;
            const columnaActual = this.fichaActual.columna;
            const jugadorActual = this.jugadores[this.turno];
            const captura = this.capturarFichas(fila, columna);
            this.tablero[filaActual][columnaActual] = null;
            this.fichaActual.fila = fila;
            this.fichaActual.columna = columna;
            if (this.isCambioDama(this.fichaActual)) {
                this.tablero[fila][columna] = new Dama(jugadorActual, fila, columna);
            } else {
                this.tablero[fila][columna] = this.fichaActual;
            }
            jugadorActual.movimientos ++;
            if (captura && this.fichaActual.saltosPosibles().length > 0) {
                this.bloqueo = true;
            } else {
                if(this.bloqueo) this.bloqueo = false;
                this.fichaActual = null;
                this.turno = this.turno === 0 ? 1 : 0;
            }   
            if (this.jugadores[0].fichas === 0 || this.jugadores[1].fichas === 0) {

            }
        }
        this.imprimirTablero();
        console.log();
    }
}

