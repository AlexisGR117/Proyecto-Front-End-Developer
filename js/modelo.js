class Ficha {

    constructor(jugador, fila, columna) {
      this.jugador = jugador;
      this.fila = fila;
      this.columna = columna;
      jugador.fichas.push(this);
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
  }

class Peon extends Ficha {

    /**
     * Da las posibles posiciones en las que la ficha puede capturar al moverse.
     * 
     * @returns {number[][]} Arreglo con los saltos posibles en arreglos donde en la posicion 0 está la final y en la 1 la columna.
     */
    saltosPosibles() {
            let saltos = [];
            let fila = this.fila;
            let columna = this.columna;
            let diferenciaFila = 1;
            if (this.getLado() === "Sur") diferenciaFila = -1;
            let filaOponente = fila + diferenciaFila;
            let nuevaFila = fila + diferenciaFila * 2;
            for (let diferenciaColumna = -1; diferenciaColumna < 2; diferenciaColumna += 2) {
                let columnaOponente = columna + diferenciaColumna;
                let nuevaColumna = columna + diferenciaColumna * 2;
                if (modelo.dentroTablero(filaOponente, columnaOponente) && modelo.getFicha(filaOponente, columnaOponente) !== null 
                    && modelo.getFicha(filaOponente, columnaOponente).getLado() !== this.getLado()
                    && modelo.dentroTablero(nuevaFila, nuevaColumna) && modelo.getFicha(nuevaFila, nuevaColumna) === null) {
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
        let movimientos = [];
        let fila = this.fila;
        let columna = this.columna;
        let diferenciaFila = 1;
        if (this.getLado() === "Sur") diferenciaFila = -1;
        let nuevaFila = fila + diferenciaFila;
        for (let diferenciaColumna = -1; diferenciaColumna < 2; diferenciaColumna ++) {
            let nuevaColumna = columna + diferenciaColumna;
            if (diferenciaColumna !== 0 && modelo.dentroTablero(nuevaFila, nuevaColumna) 
                && modelo.getFicha(nuevaFila, nuevaColumna) === null) {
                movimientos.push([nuevaFila, nuevaColumna]);
            }
        }
        movimientos.push(...this.saltosPosibles());
        return movimientos;
    }
}

class Dama extends Ficha {

    saltosPosibles() {
        let saltos = [];
        let filaActual = this.fila;
        let columnaActual = this.columna;
        let tamano = modelo.tablero.length;
        for(let movimientoFila = -1; movimientoFila < 2; movimientoFila += 2) for(let movimientoColumna = -1; movimientoColumna < 2; movimientoColumna += 2) {
            let oponente = false;
            let diferencia = 1;
            let fila = filaActual+diferencia*movimientoFila;
            let columna = columnaActual+diferencia*movimientoColumna;
            while (0 <= fila && 0 <= columna && fila < tamano && columna < tamano) {
                let ficha = modelo.getFicha(fila, columna);
                if (ficha !== null) {
                    if (this.getLado() !== ficha.getLado() && !oponente) oponente = true;
                    else break;
                } else if (oponente) {
                    saltos.push([fila, columna]);
                }
                diferencia ++;
                fila = filaActual+diferencia*movimientoFila;
                columna = columnaActual+diferencia*movimientoColumna;
            }
        }
        return saltos;
    }
    
    movimientosPosibles() {
        let movimientos = [];
        let filaActual = this.fila;
        let columnaActual = this.columna;
        let tamano = modelo.tablero.length;
        for(let diferencia = 1; diferencia <= filaActual && diferencia <= columnaActual; diferencia++){
            if (modelo.getFicha(filaActual-diferencia, columnaActual-diferencia) !== null) break;
            else  movimientos.push([filaActual-diferencia, columnaActual-diferencia]);
        }
        for(let diferencia = 1; diferencia < tamano - filaActual && diferencia < tamano - columnaActual; diferencia++){
            if (modelo.getFicha(filaActual+diferencia, columnaActual+diferencia) !== null) break;
            else movimientos.push([filaActual+diferencia, columnaActual+diferencia]);
        }
        for(let diferencia = 1; diferencia <= filaActual && diferencia < tamano - columnaActual; diferencia++){
            if (modelo.getFicha(filaActual-diferencia, columnaActual+diferencia) !== null) break;
            else movimientos.push([filaActual-diferencia, columnaActual+diferencia]);
        }
        for(let diferencia = 1; diferencia < tamano - filaActual && diferencia <= columnaActual; diferencia++){
            if (modelo.getFicha(filaActual+diferencia, columnaActual-diferencia) !== null) break;
            else movimientos.push([filaActual+diferencia, columnaActual-diferencia]);
        }
        movimientos.push(...this.saltosPosibles());
        return movimientos;
    };

}

var modelo = {
    tablero: [],
    jugadores: [{
        color: "Negro",
        nombre: "Jefer",
        lado: "Norte",
        fichas: [],
        movimientos: 0,
    },
    {
        color: "Blanco",
        nombre: "Alexis",
        lado: "Sur",
        fichas: [],
        movimientos: 0,
    }],
    turno: 1,
    fichaActual: null,
    init: function(tamanoLado) {
        for (let i = 0; i < tamanoLado; i++) {
            let fila = [];
            for (let j = 0; j < tamanoLado; j++) {
                let ficha = null;
                if((i%2 == 0 && j%2 != 0) || (i%2 != 0 && j%2 == 0)) {
                    if (i < tamanoLado/2 - 1) ficha = new Peon(this.jugadores[0], i, j);
                    else if (i > tamanoLado/2) ficha = new Peon(this.jugadores[1], i, j);
                }
                fila.push(ficha)
            }
            this.tablero.push(fila);
        }
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
    dentroTablero: function(fila, columna) {
        return 0 <= fila && fila < this.tablero.length && 0 <= columna && columna < this.tablero.length;
    },

    imprimirTablero: function() {
        for (let i = 0; i < this.tablero.length; i++) {
            let fila = '['
            for (let j = 0; j < this.tablero.length; j++){
                if (this.tablero[i][j] === null || (this.tablero[i][j] !== null && this.tablero[i][j] === null)) fila += 'null, ';
                else fila += this.tablero[i][j].constructor.name + this.tablero[i][j].jugador.color + ', ';
            }
            fila += ']'
            console.log(fila);
        }    
    },

    seleccionarFicha: function(fila, columna) {
        if (this.tablero[fila][columna].jugador == this.jugadores[this.turno]) {
            this.fichaActual = this.tablero[fila][columna];
        }
    },

    moverSeleccion(fila, columna) {
        let movimientos = this.fichaActual.movimientosPosibles();
        let fichaActual = this.fichaActual;
        let filaActual = fichaActual.fila;
        let columnaActual = fichaActual.columna;
        let jugadorActual = this.jugadores[this.turno];
        for (let i = 0; i < movimientos.length; i++) {
            console.log(movimientos[i][0] + ", " + movimientos[i][1]);
        }
        let movimiento = [fila, columna];
        let posible = movimientos.some(arreglo => JSON.stringify(arreglo) === JSON.stringify(movimiento));
        if (posible) {
            let diferenciaFilas = fila - filaActual;
            let diferenciaColumnas = columna - columnaActual;
            let movimientoFila = 1;
            let movimientoColumna = 1;
            if (diferenciaFilas < 0) movimientoFila = -1;
            if (diferenciaColumnas < 0) movimientoColumna = -1;			
            if (Math.abs(diferenciaFilas) > 1) {
                let captura = false;
                for (let i = 1; i < Math.abs(diferenciaFilas) && !captura; i++) {
                    let filaCaptura = filaActual+i*movimientoFila;
                    let columnaCaptura = columnaActual+i*movimientoColumna;
                    let fichaCaptura =  this.tablero[filaCaptura][columnaCaptura];
                    if (fichaCaptura != null) {
                        fichaCaptura.jugador.fichas.splice(fichaCaptura.jugador.fichas.indexOf(fichaCaptura), 1);
                        this.tablero[filaCaptura][columnaCaptura] = null;
                        captura = true;
                    }
                }	
            }
            this.tablero[filaActual][columnaActual] = null;
            fichaActual.fila = fila;
            fichaActual.columna = columna;
            this.tablero[fila][columna] = fichaActual;
            jugadorActual.movimientos ++;
            this.fichaActual = null;
            if (fichaActual instanceof Peon && ((fichaActual.getLado() === 'Norte' && fichaActual.fila === this.tablero.length - 1) ||
            (fichaActual.getLado() === 'Sur' &&  fichaActual.fila === 0))) {
                const index = jugadorActual.fichas.indexOf(fichaActual);
                jugadorActual.fichas.splice(index, 1);
                this.tablero[fila][columna] = new Dama(jugadorActual, fila, columna);
            }
            this.turno = this.turno === 0 ? 1 : 0;
        }
        this.imprimirTablero();
        console.log();
    }
}

