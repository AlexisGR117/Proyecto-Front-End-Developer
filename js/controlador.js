var controlador = {
    init: function() {
        vistaInicio.init();
    },

    crearJuego: function(nombreUno, colorUno, nombreDos, colorDos, tamanoLado) {
        modelo = new Juego(nombreUno, colorUno, nombreDos, colorDos, tamanoLado);
        ko.cleanNode(document.getElementById('juego'));
        ko.applyBindings(modelo, document.getElementById('juego'));
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
        return modelo.tamano;
    },

    getFicha: function(fila, columna) {
        return modelo.getFicha(fila, columna);
    },

    getFichaActual: function() {
        return modelo.fichaActual;
    },

    seleccionarFicha: function(fila, columna) {
        modelo.seleccionarFicha(fila, columna);
        return modelo.fichaActual;
    },

    getTurno: function() {
        return modelo.jugadores[modelo.turno()].nombre;
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