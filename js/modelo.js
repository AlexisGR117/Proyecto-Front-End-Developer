/**
 * Clase abstracta para representar una ficha en el juego.
 */
class Ficha {

    constructor(jugador, fila, columna, juego) {
      this.jugador = jugador;
      this.fila = fila;
      this.columna = columna;
      this.juego = juego;
    }

    /**
     * Obtiene el lado de la ficha (0 o 1).
     * @returns {number} El lado de la ficha.
     */
    getLado() {
        return this.jugador.lado;
    }

    /**
     * Obtiene el color de la ficha (Blanco, Negro o Rojo).
     * @returns {string} El color de la ficha.
     */
    getColor() {
        return this.jugador.color;
    }

    /**
     * Obtiene el tipo de la ficha.
     * @returns {string} El tipo de la ficha.
     */
    getTipo() {
        return this.constructor.name;
    }

    /**
     * Comprueba si la ficha es del oponente.
     * @param {Ficha} ficha - La ficha a comparar.
     * @returns {boolean} True si la ficha es del oponente, false en caso contrario.
     */
    isFichaOponente(ficha) {
        return ficha.getLado() !== this.getLado();
    }
  }

/**
 * Clase que representa un peón en el juego.
 */
class Peon extends Ficha {

    /**
     * Devuelve las posibles posiciones en las que la ficha puede capturar al moverse.
     * @returns {number[][]} Arreglo con los saltos posibles en arreglos donde en la posición 0 está la final y en la 1 la columna.
     */
    saltosPosibles() {
        const saltos = [];
        const diferenciaFila = this.getLado() === 1 ? -1 : 1;
        const filaOponente = this.fila + diferenciaFila;
        const nuevaFila = this.fila + diferenciaFila * 2;
        const direcciones = [-1, 1];
        for (const diferenciaColumna of direcciones) {
            const columnaOponente = this.columna + diferenciaColumna;
            const nuevaColumna = this.columna + diferenciaColumna * 2;
            if (this.juego.isPosicionOcupada(filaOponente, columnaOponente)
                && this.isFichaOponente(this.juego.getFicha(filaOponente, columnaOponente))
                && this.juego.isPosicionDisponible(nuevaFila, nuevaColumna)) {
                saltos.push([nuevaFila, nuevaColumna]);
            }
        }
        return saltos;
    }

    /**
     * Devuelve las posibles posiciones a las que se puede mover la ficha en el tablero.
     * @returns {number[][]} Arreglo con los movimientos posibles en arreglos donde en la posición 0 está la final y en la 1 la columna.
     */
    movimientosPosibles() {
        const movimientos = [];
        const diferenciaFila = this.getLado() === 1 ? -1 : 1;
        const nuevaFila = this.fila + diferenciaFila;
        const direcciones = [-1, 1];
        for (const diferenciaColumna of direcciones) {
            const nuevaColumna = this.columna + diferenciaColumna;
            if (this.juego.isPosicionDisponible(nuevaFila, nuevaColumna)) {
                movimientos.push([nuevaFila, nuevaColumna]);
            }
        }
        movimientos.push(...this.saltosPosibles());
        return movimientos;
    }
}

/**
 * Clase que representa una dama en el juego.
 */
class Dama extends Ficha {

    /**
     * Devuelve las posibles posiciones en las que la ficha puede capturar al moverse.
     * @returns {number[][]} Arreglo con los saltos posibles en arreglos donde en la posición 0 está la final y en la 1 la columna.
     */
    saltosPosibles() {
        const saltos = [];
        const direcciones  = [-1, 1];
        for(const f of direcciones) for(const c of direcciones) {
            let oponente = false;
            let diferencia = 1;
            let fila = this.fila+diferencia*f;
            let columna = this.columna+diferencia*c;
            while (this.juego.isPosicionValida(fila, columna)) {
                const ficha = this.juego.getFicha(fila, columna);
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
    
    /**
     * Devuelve las posibles posiciones a las que se puede mover la ficha en el tablero.
     * @returns {number[][]} Arreglo con los movimientos posibles en arreglos donde en la posición 0 está la final y en la 1 la columna.
     */
    movimientosPosibles() {
        const movimientos = [];
        const direcciones  = [-1, 1];
        for(const f of direcciones) for(const c of direcciones) {
            let diferencia = 1;
            let fila = this.fila+diferencia*f;
            let columna = this.columna+diferencia*c;
            while(this.juego.isPosicionDisponible(fila, columna)) {
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

/**
 * Clase que representa un jugador en el juego.
 */
class Jugador {
    constructor(color, nombre, lado, juego) {
        this.color = color;
        this.nombre = nombre;
        this.lado = lado;
        this.juego = juego;
        this.fichas = ko.observable((this.juego.tamano/2 - 1) * (this.juego.tamano/2));
        this.movimientos = ko.observable(0);
    } 
}

/**
 * Clase que representa el juego de damas.
 */
class Juego {

    static TAMANOS_VALIDOS = [6, 8, 10, 12];

    constructor(nombreUno, colorUno, nombreDos, colorDos, tamano) {
        if (nombreUno.length < 3) throw new JuegoException(JuegoException.SHORT_NAME);
        if (nombreUno === nombreDos) throw new JuegoException(JuegoException.SAME_NAMES);
        if (colorUno === colorDos) throw new JuegoException(JuegoException.SAME_COLORS);
        if (nombreDos.length < 3) throw new JuegoException(JuegoException.SHORT_NAME);
        if (!Juego.TAMANOS_VALIDOS.includes(tamano)) throw new JuegoException(JuegoException.INVALID_SIZE);
        this.tamano = tamano;
        this.crearJugadores(nombreUno, colorUno, nombreDos, colorDos);
        this.tablero = [],
        this.crearTablero();
        this.turno = ko.observable(1),
        this.ganador = null,
        this.fichaActual = null,
        this.bloqueo = false;
    }


    /**
     * Crea dos jugadores con los nombres y colores dados.
     * @param {string} nombreUno - El nombre del jugador 1.
     * @param {string} colorUno - El color del jugador 1.
     * @param {string} nombreDos - El nombre del jugador 2.
     * @param {string} colorDos - El color del jugador 2. 
     */
    crearJugadores(nombreUno, colorUno, nombreDos, colorDos) {
        const jugadorUno = new Jugador(colorUno, nombreUno, 0, this);
        const jugadorDos = new Jugador(colorDos, nombreDos, 1, this);
        this.jugadores = [jugadorUno, jugadorDos];
        this.jugadores[0].fichasCapturadas = ko.computed(function() {
            return (this.tamano/2 - 1)  * (this.tamano/2) - jugadorDos.fichas();
        }, this);
        this.jugadores[1].fichasCapturadas = ko.computed(function() {
            return (this.tamano/2 - 1)  * (this.tamano/2) - jugadorUno.fichas();
        }, this);
    }

    /**
     * Crea un tablero de damas vacío con el tamaño especificado.    
     */
    crearTablero() {
        for (let i = 0; i < this.tamano; i++) {
            const fila = [];
            for (let j = 0; j < this.tamano; j++) {
                let ficha = null;
                if((i%2 == 0 && j%2 != 0) || (i%2 != 0 && j%2 == 0)) {
                    if (i < this.tamano/2 - 1) {
                        ficha = new Peon(this.jugadores[0], i, j, this);
                    }
                    else if (i > this.tamano/2) {
                        ficha = new Peon(this.jugadores[1], i, j, this);
                    }
                } else {
                    ficha = false;
                }
                fila.push(ficha)
            }
            this.tablero.push(fila);
        }
    }

    /**
     * Obtiene la ficha de la casilla ubicada en la posicion dada.
     * @param {number} fila - La fila de la casilla en la que esta la ficha.
     * @param {number} columna - La columna de la casilla en la que esta la ficha.
     * @returns {Ficha} La ficha que esta en la posicion dada.
     */
    getFicha(fila, columna) {
        return this.tablero[fila][columna];
    }

    /**
     * Dice si una posicion dada esta dentro del tablero.
     * @param {number} fila - La fila de la posicion que se quiere verificar.
     * @param {number} columna - La columna de la posicion que se quiere verificar.
     * @returns {boolean} True si la posicion esta dentro del tablero, de lo contario, False. 
     */
    isPosicionValida(fila, columna) {
        return 0 <= fila && fila < this.tamano && 0 <= columna && columna < this.tamano;
    }

    /**
     * Dice si una casilla dada está disponible para ser ocupada por una ficha.
     * @param {number} fila - La fila de la casilla que se quiere verificar.
     * @param {number} columna - La columna de la casilla que se quiere verificar.
     * @returns {boolean} True si la casilla está vacía, de lo contrario, False. 
     */    
    isPosicionDisponible(fila, columna) {
        return this.isPosicionValida(fila, columna) && this.getFicha(fila, columna) === null;
    }

    /**
     * Dice si una casilla dada está ocupada por una ficha.
     * @param {number} fila - La fila de la casilla que se quiere verificar.
     * @param {number} columna - La columna de la casilla que se quiere verificar.
     * @returns {boolean} True si la casilla está ocupada, de lo contrario, False. 
     */
    isPosicionOcupada(fila, columna) {
        return this.isPosicionValida(fila, columna) && this.getFicha(fila, columna) !== null;
    }

    /**
     * Imprime el tablero del juego en la consola. 
     */
    imprimirTablero() {
        for (let i = 0; i < this.tamano; i++) {
            let fila = '['
            for (let j = 0; j < this.tamano; j++){
                if (this.tablero[i][j] === null) fila += 'null, ';
                else if (this.tablero[i][j] === false) fila += 'false, ';
                else fila += this.tablero[i][j].getTipo() + this.tablero[i][j].getColor() + ', ';
            }
            fila += ']'
            console.log(fila);
        }    
    }

    /**
     * Selecciona la ficha ubicada en la casilla dada.
     * @param {number} fila - La fila de la casilla que contiene la ficha.
     * @param {number} columna - La columna de la casilla que contiene la ficha.
     * @throws {JuegoException} Si la ficha no pertenece al jugador actual, si ya se ha
     * seleccionado una ficha y el jugador está obligado a comer otra, o si el juego
     * ya ha terminado. 
     */
    seleccionarFicha(fila, columna) {
        if (this.tablero[fila][columna].jugador !== this.jugadores[this.turno()] ) {
            throw new JuegoException(JuegoException.INVALID_PLAYER);
        }
        if (this.tablero[fila][columna] !== this.fichaActual && this.bloqueo) throw new JuegoException(JuegoException.ONE_TOKEN_PER_TURN); 
        if (this.ganador !== null) throw new JuegoException(JuegoException.GAME_FINISHED); 
        this.fichaActual = this.tablero[fila][columna];
    }

    /**
     * Dice si la ficha actual puede moverse a la casilla dada.
     * @param {number} fila - La fila de la casilla a la que se quiere mover la ficha.
     * @param {number} columna - La columna de la casilla a la que se quiere mover la ficha.
     * @returns {boolean} True si el movimiento es posible, de lo contrario, False. 
     */
    isMovimientoPosible(fila, columna) {
        const movimientos =  this.bloqueo ? this.fichaActual.saltosPosibles() : this.fichaActual.movimientosPosibles();
        return movimientos.some(arreglo => JSON.stringify(arreglo) === JSON.stringify([fila, columna]));
    }

    /**
     * Captura las fichas enemigas que se encuentran entre la ficha actual y la casilla dada.
     * @param {number} fila - La fila de la casilla a la que se quiere mover la ficha.
     * @param {number} columna - La columna de la casilla a la que se quiere mover la ficha.
     * @returns {boolean} True si se capturó alguna ficha, False de lo contrario. 
     */
    capturarFichas(fila, columna) {
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
                    ficha.jugador.fichas(ficha.jugador.fichas() - 1);
                    this.tablero[filaCaptura][columnaCaptura] = null;
                    return true;
                }
            }	
        }
        return false;
    }

    /**
     * Dice si la ficha dada puede convertirse en dama.
     * @param {Ficha} ficha - La ficha que se quiere verificar.
     * @returns {boolean} True si la ficha puede convertirse en dama, de lo contrario, False. 
     */
    isCambioDama(ficha) {
        return ficha instanceof Peon 
                && ((ficha.getLado() === 0 && ficha.fila === this.tamano - 1) 
                || (ficha.getLado() === 1 && ficha.fila === 0));
    }

    /**
     * Declara al jugador actual como perdedor. 
     */ 
    rendirse() {
        this.ganador = this.turno === 0 ? 1 : 0;
    }

    /**
     * Mueve la ficha seleccionada a la casilla dada.
     * @param {number} fila - La fila de la casilla a la que se quiere mover la ficha.
     * @param {number} columna - La columna de la casilla a la que se quiere mover la ficha.
     * @throws {JuegoException} Si el movimiento no es posible, si el juego ya ha terminado,
     * o si el jugador actual no tiene suficientes fichas. 
     */
    moverSeleccion(fila, columna) {
        if (!this.isMovimientoPosible(fila, columna)) throw new JuegoException(JuegoException.INVALID_MOVEMENT); 
        if (this.ganador !== null) throw new JuegoException(JuegoException.GAME_FINISHED); 
        const filaActual = this.fichaActual.fila;
        const columnaActual = this.fichaActual.columna;
        const jugadorActual = this.jugadores[this.turno()];
        const captura = this.capturarFichas(fila, columna);
        this.tablero[filaActual][columnaActual] = null;
        this.fichaActual.fila = fila;
        this.fichaActual.columna = columna;
        if (this.isCambioDama(this.fichaActual)) {
            this.tablero[fila][columna] = new Dama(jugadorActual, fila, columna, this);
        } else {
            this.tablero[fila][columna] = this.fichaActual;
        }
        jugadorActual.movimientos(jugadorActual.movimientos() + 1);
        if (captura && this.fichaActual.saltosPosibles().length > 0) {
            this.bloqueo = true;
        } else {
            if(this.bloqueo) this.bloqueo = false;
            this.fichaActual = null;
            this.turno(this.turno() === 0 ? 1 : 0);
            if(this.jugadores[this.turno()].fichas === 0) {
                this.ganador = this.turno() === 0 ? 1 : 0;
            };
        }  
    }
}

/**
 * Clase que representa una excepción en el juego de damas.
 */
class JuegoException extends Error {

    constructor(message) {
        super(message);
        this.name = "JuegoException";
    }

    static get SAME_NAMES() {
        return "Los nombres deben ser diferentes.";
    }

    static get SAME_COLORS() {
        return "Los colores de los jugadores deben ser diferentes.";
    }

    static get SHORT_NAME() {
        return "El nombre de los jugadores debe tener al menos 3 caracteres.";
    }

    static get INVALID_SIZE() {
        return "El tamaño del tablero solo puede ser 6x6, 8x8, 10x10 o 12x12.";
    }

    static get INVALID_PLAYER() {
        return "No es el turno de este jugador.";
    }

    static get ONE_TOKEN_PER_TURN() {
        return "En un turno solo se puede mover una ficha.";
    }

    static get INVALID_MOVEMENT() {
        return "No se puede realizar el movimiento.";
    }

    static get GAME_FINISHED() {
        return "El juego ya ha terminado, ya hay un ganador.";
    }
}