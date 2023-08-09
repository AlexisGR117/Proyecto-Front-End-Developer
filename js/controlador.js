var controlador = {
    init: function() {
        modelo.init(10);
        vistaTablero.init();
        vistaInformacion.init();
    },

    getTablero: function () {
        return modelo.tablero;
    },

    getTamanoTablero: function () {
        return modelo.tablero.length;
    },

    getFicha: function(fila, columna) {
        return modelo.tablero[fila][columna];
    },

    getFichaActual: function() {
        return modelo.fichaActual;
    },

    seleccionarFicha: function(fila, columna) {
        modelo.seleccionarFicha(fila, columna);
        return modelo.fichaActual;
    },

    getNombreJugadorUno: function() {
        return modelo.jugadores[0].nombre;
    },

    getColorJugadorUno: function() {
        return modelo.jugadores[0].color;
    },

    getNumeroFichasJugadorUno: function() {
        return modelo.jugadores[0].fichas;
    },

    getNumeroMovimientosJugadorUno: function() {
        return modelo.jugadores[0].movimientos;
    },

    getNumeroCapturasJugadorUno: function() {
        let tablero = this.getTablero();
        return (tablero.length/2 - 1)  * (tablero.length/2) - modelo.jugadores[1].fichas;
    },

    getNombreJugadorDos: function() {
        return modelo.jugadores[1].nombre;
    },

    getColorJugadorDos: function() {
        return modelo.jugadores[1].color;
    },

    getNumeroFichasJugadorDos: function() {
        return modelo.jugadores[1].fichas;
    },

    getNumeroMovimientosJugadorDos: function() {
        return modelo.jugadores[1].movimientos;
    },

    getNumeroCapturasJugadorDos: function() {
        let tablero = this.getTablero();
        return (tablero.length/2 - 1)  * (tablero.length/2) - modelo.jugadores[0].fichas;
    },

    getTurno: function() {
        return modelo.jugadores[modelo.turno].nombre;
    },

    moverSeleccion: function(fila, columna) {
        modelo.moverSeleccion(fila, columna);
    },

    isBloqueado: function() {
        return modelo.bloqueo;
    }
}

controlador.init();