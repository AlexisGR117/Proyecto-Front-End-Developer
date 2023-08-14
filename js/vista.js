const COLORES = ["Blanco", "Negro", "Rojo"];

var vistaInicio = {
    init: function() {
        COLORES.forEach(function(color) {
            const opcion = $('<option>', {
                value: color,
                text: color
            });
            $('.colores').append(opcion);
        });
        Juego.TAMANOS_VALIDOS.forEach(function(tamano) {
            const opcion = $('<option>', {
                value: tamano,
                text: `${tamano}x${tamano}`
            });
            $('#tamano-tablero').append(opcion);
        });
        $('#nuevo-color-uno').val("Negro");
        $('#nuevo-color-uno').change(function() {
            $('#imagen-uno').attr("src", `img/Dama${$(this).val()}G.png`);
        });
        $('#nuevo-color-dos').change(function() {
            $('#imagen-dos').attr("src", `img/Dama${$(this).val()}G.png`);
        });
        $('#boton-jugar').click(function() {
            const nombreUno = $('#nuevo-nombre-uno').val();
            const colorUno = $('#nuevo-color-uno').val();
            const nombreDos = $('#nuevo-nombre-dos').val();
            const colorDos = $('#nuevo-color-dos').val();
            const tamanoTablero = $('#tamano-tablero').val();
            try {
                controlador.crearJuego(nombreUno, colorUno, nombreDos, colorDos, +tamanoTablero);
                $('#inicio').addClass("oculto");
                $('#juego').removeClass("oculto");
            } catch (e) {
                alert(e.message);
            }
        });
    }
}

var vistaTablero = {

    init: function() {
        this.casillas = $('#casillas');
        this.casillas.empty();
        let tamanoTablero = controlador.getTablero().length;
        this.casillas.css("gridTemplateRows", `repeat(${tamanoTablero}, ${100 / tamanoTablero}%)`);
        this.casillas.css("gridTemplateColumns", `repeat(${tamanoTablero}, ${100 / tamanoTablero}%)`);
        this.colocarCasillas();  
        this.render(); 
        this.casillas.off();
        this.casillas.click(function(evt) {
            if ($(evt.target).hasClass('ficha')) {
                let idCasilla = evt.target.parentNode.id.split('-');
                if ($(evt.target).hasClass('transparente')) {
                    vistaTablero.mover(+idCasilla[1], +idCasilla[3]);
                } else {
                    vistaTablero.seleccionar(+idCasilla[1], +idCasilla[3]);
                }
            } 
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
        $('.archivo').empty();
        $('.rango').empty();
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
    
    seleccionar: function(fila, columna) {
        try {
            let fichaActual = controlador.seleccionarFicha(fila, columna);
            if(fichaActual === controlador.getFicha(fila, columna)){
                $(".transparente").remove();
                $(".seleccion").removeClass("seleccion");
                if (controlador.isBloqueado()){
                    fichaActual.saltosPosibles().forEach(function(salto) {
                        $(`#fila-${salto[0]}-columna-${salto[1]}`).prepend( 
                        `<img class="ficha transparente" src="img/${fichaActual.getTipo()}${fichaActual.getColor()}Transparente.png">`);
                    });
                } else {
                    fichaActual.movimientosPosibles().forEach(function(movimiento) {
                        $(`#fila-${movimiento[0]}-columna-${movimiento[1]}`).append( 
                        `<img class="ficha transparente" src="img/${fichaActual.getTipo()}${fichaActual.getColor()}Transparente.png">`);
                    });
                }
                $(`#fila-${fila}-columna-${columna}`).addClass("seleccion");
            }
        } catch (e) {
            alert(e.message);
        }
    },
    
    mover: function(fila, columna) {
        try {
            let fichaActual = controlador.getFichaActual();
            let filaAnterior = fichaActual.fila;
            let columnaAnterior = fichaActual.columna;
            let casillaAnterior = $(`#fila-${filaAnterior}-columna-${columnaAnterior}`);
            casillaAnterior.removeClass("seleccion");
            $(".transparente").remove();
            controlador.moverSeleccion(fila, columna);
            this.render();
            if(controlador.isBloqueado()) this.seleccionar(fila, columna);
            if(controlador.hayGanador()) {
                alert("Felicidades ha ganado " + controlador.getNombreGanador());
                $('#inicio').removeClass("oculto");
                $('#juego').addClass("oculto");
            }
        } catch (e) {
            alert(e.message);
        }
    }
}

var vistaInformacion = {

    init: function() {
        $('#boton-rendirse').off();
        $('#boton-rendirse').click(function() {
            const opcion = confirm(controlador.getTurno() + ", ¿Seguro que te quieres rendir?");
            if (opcion === true) {
                controlador.rendirse();
                alert("Felicidades ha ganado " + controlador.getNombreGanador());
                $('#inicio').removeClass("oculto");
                $('#juego').addClass("oculto");
            }
        });
    },

}


