var vistaTablero = {

    init: function() {
        this.casillas = $('#casillas');
        let tamanoTablero = controlador.getTablero().length;
        this.casillas.css("gridTemplateRows", `repeat(${tamanoTablero}, ${100 / tamanoTablero}%)`);
        this.casillas.css("gridTemplateColumns", `repeat(${tamanoTablero}, ${100 / tamanoTablero}%)`);
        this.colocarCasillas();  
        this.render(); 
        this.casillas.click(function(evt) {
            if (evt.target.className === 'ficha') vistaTablero.seleccionar(evt);
            else if (evt.target.className === 'ficha transparente')  vistaTablero.mover(evt);
        });
    },

    render: function() {
        let tamanoTablero = controlador.getTablero().length;
        for (let i = 0; i < tamanoTablero; i++) for (let j = 0; j < tamanoTablero; j++) {
            if((i%2 == 0 && j%2 != 0) || (i%2 != 0 && j%2 == 0)) {
                let casilla = $(`#fila-${i}-columna-${j}`);
                let ficha = controlador.getFicha(i, j);
                if (ficha != null) {
                    let tipoFicha = ficha.getTipo();
                    let colorJugador = ficha.getColor();
                    if (casilla.children().length === 0) {
                        casilla.prepend( 
                            `<img class="ficha" alt="${tipoFicha} ${colorJugador}" src="img/${tipoFicha}${colorJugador}.png">`);
                    } else if (casilla.children().attr("alt") !== tipoFicha + " " + colorJugador) {
                        casilla.children().remove();
                        casilla.prepend( 
                            `<img class="ficha" alt="${tipoFicha} ${colorJugador}" src="img/${tipoFicha}${colorJugador}.png">`);
                    }
                } else if (casilla.children().length > 0) {
                    casilla.children().remove();
                }
            }
        }
    },

    colocarCasillas: function() {
        let letras = "";
        let numeros = "";
        let tamanoTablero = controlador.getTamanoTablero();
        for (let i = 0; i < tamanoTablero; i++) {
            letras += `<div>${String.fromCharCode(i + 65)}</div>`;
            numeros += `<div>${i + 1}</div>`;
            for (let j = 0; j < tamanoTablero; j++) {
                let nuevaCasilla = "";
                if ((i%2 == 0 && j%2 != 0) || (i%2 != 0 && j%2 == 0)) {
                    nuevaCasilla = `<div class="casilla" id="fila-${i}-columna-${j}"></div>`;
                } else {
                    nuevaCasilla = '<div></div>';
                }
                this.casillas.append(nuevaCasilla);
            }
        }
        $('.archivo').append(letras);
        $('.rango').append(numeros);
    },
    
    seleccionar: function(evt) {
        let idCasilla = evt.target.parentNode.id.split('-');
        let fichaActual = controlador.seleccionarFicha(idCasilla[1], idCasilla[3]);
        if(fichaActual === controlador.getFicha(idCasilla[1], idCasilla[3])){
            $(".transparente").remove();
            $(".seleccion").removeClass("seleccion");
            fichaActual.movimientosPosibles().forEach(function(movimiento) {
                $(`#fila-${movimiento[0]}-columna-${movimiento[1]}`).prepend( 
                `<img class="ficha transparente" src="img/${fichaActual.getTipo()}${fichaActual.getColor()}Transparente.png">`);
            });
            $(evt.target).parent().addClass("seleccion");
        }
    },
    
    mover: function(evt) {
        let idCasilla = evt.target.parentNode.id.split('-');
        console.log("(" + idCasilla[1] + ", " + idCasilla[3] + ")")
        let nuevaFila = idCasilla[1];
        let nuevaColumna = idCasilla[3];
        let fichaActual = controlador.getFichaActual();
        let filaAnterior = fichaActual.fila;
        let columnaAnterior = fichaActual.columna;
        let casillaAnterior = $(`#fila-${filaAnterior}-columna-${columnaAnterior}`);
        casillaAnterior.removeClass("seleccion");
        $(".transparente").remove();
        controlador.moverSeleccion(+nuevaFila, +nuevaColumna);
        this.render();
        vistaInformacion.render();
    }
}

var vistaInformacion = {

    init: function() {
        $("#nombre-uno").text(controlador.getNombreJugadorUno());
        $("#color-uno").text(controlador.getColorJugadorUno());
        $("#nombre-dos").text(controlador.getNombreJugadorDos());
        $("#color-dos").text(controlador.getColorJugadorDos());
        this.movimientosUno = $("#movimientos-uno")
        this.fichasUno = $("#fichas-uno")
        this.capturasUno = $("#capturas-uno")
        this.movimientosDos = $("#movimientos-dos")
        this.fichasDos = $("#fichas-dos")
        this.capturasDos = $("#capturas-dos")
        this.turno = $("#turno")
        this.render();
    },

    render: function() {
        this.movimientosUno.text(controlador.getNumeroMovimientosJugadorUno());
        this.fichasUno.text(controlador.getNumeroFichasJugadorUno());
        this.capturasUno.text(controlador.getNumeroCapturasJugadorUno());
        this.movimientosDos.text(controlador.getNumeroMovimientosJugadorDos());
        this.fichasDos.text(controlador.getNumeroFichasJugadorDos());
        this.capturasDos.text(controlador.getNumeroCapturasJugadorDos());
        this.turno.text(controlador.getTurno());
    }
}


