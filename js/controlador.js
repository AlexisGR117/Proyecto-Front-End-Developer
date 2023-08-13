var controlador = {
    init: function() {
        vistaInicio.init();
    },

    crearJuego: function(nombreUno, colorUno, nombreDos, colorDos, tamanoLado) {
        modelo = new Juego(nombreUno, colorUno, nombreDos, colorDos, tamanoLado);
        ko.applyBindings(modelo);
        vistaTablero.init();
        vistaInformacion.init();
    },

    getNombreGanador: function() {
        return modelo.jugadores[modelo.ganador].nombre;
    },

    rendirse: function() {
        modelo.rendirse();
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
    },

    hayGanador: function() {
        return modelo.ganador !== null;
    }
}

controlador.init();