describe("Juego", function() {
    var juego;
  
    beforeEach(function() {
      juego = new Juego("Nombre Norte", "Rojo", "Nombre Sur", "Azul", 6);
    });
  
    describe("cuando un juego es creado", function() {

      it("deberian crearse los dos jugadores con sus respectivos valores", function() {
        expect(juego.jugadores.length).toEqual(2);
        expect(juego.jugadores[0].lado).toEqual(0);
        expect(juego.jugadores[0].nombre).toEqual("Nombre Norte");
        expect(juego.jugadores[0].color).toEqual("Rojo");
        expect(juego.jugadores[0].fichas()).toEqual(6);
        expect(juego.jugadores[0].movimientos()).toEqual(0);
        expect(juego.jugadores[1].lado).toEqual(1);
        expect(juego.jugadores[1].nombre).toEqual("Nombre Sur");
        expect(juego.jugadores[1].color).toEqual("Azul");
        expect(juego.jugadores[1].fichas()).toEqual(6);
        expect(juego.jugadores[1].movimientos()).toEqual(0);
      });
  
      it("deberia crearse el tablero con las respectivas fichas para cada jugador", function() {
        expect(juego.tamano).toEqual(6);
        for (let i = 0; i < juego.tamano; i++) for (let j = 0; j < juego.tamano; j++) {
    			if((i%2 == 0 && j%2 != 0) || (i%2 != 0 && j%2 == 0)) {
    				if (i < juego.tamano/2 - 1 || i > juego.tamano/2) {
              expect(juego.getFicha(i, j) instanceof Peon).toBeTruthy();
	    				if (i < juego.tamano/2 - 1) expect(juego.getFicha(i, j).jugador).toEqual(juego.jugadores[0]);
	    				if (i > juego.tamano/2) expect(juego.getFicha(i, j).jugador).toEqual(juego.jugadores[1]);
    				} else {
              expect(juego.getFicha(i, j)).toEqual(null);
            }
    			}
    		}
      });

      it("deberia inicializarce los atributos del juego de damas", function() {
        expect(juego.turno()).toEqual(1);
        expect(juego.ganador).toEqual(null);
        expect(juego.fichaActual).toEqual(null);
        expect(juego.bloqueo).toBeFalsy();
      });

      it("deberia lanzar una excepcion si los nombres tienen menos de 43 caracteres", function() {
        expect(() => {new Juego("NN", "Rojo", "Nombre Sur", "Azul", 6)}).toThrowError(JuegoException.SHORT_NAME);
        expect(() => {new Juego("Nombre Norte", "Rojo", "NS", "Azul", 6)}).toThrowError(JuegoException.SHORT_NAME);
      });

      it("deberia lanzar una excepcion si los nombres de los jugadores son iguales", function() {
        expect(() => {new Juego("Nombre Norte", "Rojo", "Nombre Norte", "Azul", 6)}).toThrowError(JuegoException.SAME_NAMES);
      });

      it("deberia lanzar una excepcion si los colores de los jugadores son iguales", function() {
        expect(() => {new Juego("Nombre Norte", "Rojo", "Nombre Sur", "Rojo", 6)}).toThrowError(JuegoException.SAME_COLORS);
      });

      it("deberia lanzar una excepcion si el tamano del esta dentro de los establecidos", function() {
        expect(() => {new Juego("Nombre Norte", "Rojo", "Nombre Sur", "Negro", 15)}).toThrowError(JuegoException.INVALID_SIZE);
        expect(() => {new Juego("Nombre Norte", "Rojo", "Nombre Sur", "Negro", "8")}).toThrowError(JuegoException.INVALID_SIZE);
      });
    });

    describe("cuando se juega", function() {
      
      it("deberia lanzar una excepcion si se selecciona una ficha del jugador que no tiene el turno", function() {
        expect(() => {juego.seleccionarFicha(1, 0);}).toThrowError(JuegoException.INVALID_PLAYER);
      });

      it("deberia lanzar una excepcion si en un mismo turno se selecciona una ficha diferente a la que se movio previamente", function() {
        juego.seleccionarFicha(4, 1);
        juego.moverSeleccion(3, 2);
        juego.seleccionarFicha(1, 2);
        juego.moverSeleccion(2, 1);
        juego.seleccionarFicha(3, 2);
        juego.moverSeleccion(2, 3);
        juego.seleccionarFicha(0, 3);
        juego.moverSeleccion(1, 2);
        juego.seleccionarFicha(5, 0);
        juego.moverSeleccion(4, 1);
        juego.seleccionarFicha(1, 4);
        juego.moverSeleccion(3, 2);
        expect(() => {juego.seleccionarFicha(2, 1)}).toThrowError(JuegoException.ONE_TOKEN_PER_TURN);
      });

      it("deberia poder seleccionar una ficha", function() {
        const ficha = juego.getFicha(4, 1);
        juego.seleccionarFicha(4, 1);
        expect(juego.fichaActual).toEqual(ficha);
      });

      it("deberia lanzar una excepcion si el movimiento no es posible", function() {
        juego.seleccionarFicha(4, 1);
        expect(() => {juego.moverSeleccion(2, 4);}).toThrowError(JuegoException.INVALID_MOVEMENT);
      });

      it("deberia poder mover las fichas el jugador sur", function() {
        const ficha = juego.getFicha(4, 1);
        juego.seleccionarFicha(4, 1);
        juego.moverSeleccion(3, 0);
        expect(juego.getFicha(4, 1)).toEqual(null);
        expect(juego.getFicha(3, 0)).toEqual(ficha);
        expect(juego.jugadores[1].movimientos()).toEqual(1);
      });

      it("deberia cambiar del turno al mover", function() {
        expect(juego.turno()).toEqual(1);
        juego.seleccionarFicha(4, 1);
        juego.moverSeleccion(3, 0);
        expect(juego.turno()).toEqual(0);
        juego.seleccionarFicha(1, 0);
        juego.moverSeleccion(2, 1);
        expect(juego.turno()).toEqual(1);
      });
            
      it("deberia poder mover las fichas el jugador norte", function() {
        juego.seleccionarFicha(4, 1);
        juego.moverSeleccion(3, 0);
        const ficha = juego.getFicha(1, 0);
        juego.seleccionarFicha(1, 0);
        juego.moverSeleccion(2, 1);
        expect(juego.getFicha(1, 0)).toEqual(null);
        expect(juego.getFicha(2, 1)).toEqual(ficha);
        expect(juego.jugadores[0].movimientos()).toEqual(1);
      });

      it("deberia poder capturar fichas del oponente con un peon", function() {
        const ficha = juego.getFicha(4, 5);
        juego.seleccionarFicha(4, 5);
        juego.moverSeleccion(3, 4);
        juego.seleccionarFicha(1, 2);
        juego.moverSeleccion(2, 3);
        juego.seleccionarFicha(3, 4);
        juego.moverSeleccion(1, 2);
        expect(juego.getFicha(2, 3)).toEqual(null);
        expect(juego.getFicha(1, 2)).toEqual(ficha);
        expect(juego.jugadores[0].fichas()).toEqual(5);
      });

      it("deberia poder volver a mover en un solo turno si puedo capturar de   nuevo", function() {
        juego.seleccionarFicha(4, 3);
        juego.moverSeleccion(3, 2);
        juego.seleccionarFicha(1, 0);
        juego.moverSeleccion(2, 1);
        juego.seleccionarFicha(4, 5);
        juego.moverSeleccion(3, 4);
        juego.seleccionarFicha(2, 1);
        juego.moverSeleccion(4, 3);
        juego.seleccionarFicha(4, 1);
        juego.moverSeleccion(3, 0);
        juego.seleccionarFicha(1, 2);
        juego.moverSeleccion(2, 1);
        expect(juego.turno()).toEqual(1);
        const ficha = juego.getFicha(5, 4);
        expect(juego.jugadores[1].movimientos()).toEqual(3);
        juego.seleccionarFicha(5, 4);
        juego.moverSeleccion(3, 2);
        expect(juego.turno()).toEqual(1);
        juego.seleccionarFicha(3, 2);
        juego.moverSeleccion(1, 0);
        expect(juego.jugadores[1].movimientos()).toEqual(5);
        expect(juego.getFicha(4, 3)).toEqual(null);
        expect(juego.getFicha(2, 1)).toEqual(null);
        expect(juego.getFicha(1, 0)).toEqual(ficha);
        expect(juego.jugadores[0].fichas()).toEqual(4);
      });

      it("deberia cambiarse el peon por una dama al llegar al otro lados", function() {
        juego.seleccionarFicha(4, 3);
        juego.moverSeleccion(3, 2);
        juego.seleccionarFicha(1, 0);
        juego.moverSeleccion(2, 1);
        juego.seleccionarFicha(3, 2);
        juego.moverSeleccion(1, 0);
        juego.seleccionarFicha(1, 2);
        juego.moverSeleccion(2, 1);
        juego.seleccionarFicha(4, 1);
        juego.moverSeleccion(3, 0);
        juego.seleccionarFicha(0, 1);
        juego.moverSeleccion(1, 2);
        juego.seleccionarFicha(1, 0);
        juego.moverSeleccion(0, 1);
        expect(juego.getFicha(0, 1) instanceof Dama).toBeTruthy();
      });

      it("deberia poder rendirse", function() {
        juego.rendirse();
        expect(juego.ganador).toEqual(0);
      });

      it("deberia lanzar una excepcion si se intenta seleccionar una ficha cuando el juego ya ha terminado", function() {
        juego.rendirse();
        expect(() => {juego.seleccionarFicha(4, 1);}).toThrowError(JuegoException.GAME_FINISHED);
      });

      it("deberia lanzar una excepcion si se intenta mover una ficha cuando el juego ya ha terminado", function() {
        juego.seleccionarFicha(4, 1);
        juego.rendirse();
        expect(() => {juego.moverSeleccion(3, 2);}).toThrowError(JuegoException.GAME_FINISHED);
      });

      it("deberia poder capturar fichas del oponente a mas de dos casillas con una dama", function() {
        juego.seleccionarFicha(4, 3);
        juego.moverSeleccion(3, 2);
        juego.seleccionarFicha(1, 0);
        juego.moverSeleccion(2, 1);
        juego.seleccionarFicha(3, 2);
        juego.moverSeleccion(1, 0);
        juego.seleccionarFicha(1, 2);
        juego.moverSeleccion(2, 1);
        juego.seleccionarFicha(4, 1);
        juego.moverSeleccion(3, 0);
        juego.seleccionarFicha(0, 1);
        juego.moverSeleccion(1, 2);
        juego.seleccionarFicha(1, 0);
        juego.moverSeleccion(0, 1);
        juego.seleccionarFicha(1, 2);
        juego.moverSeleccion(2, 3);
        const ficha = juego.getFicha(0, 1);
        juego.seleccionarFicha(0, 1);
        juego.moverSeleccion(3, 4);
        expect(juego.getFicha(2, 3)).toEqual(null);
        expect(juego.getFicha(3, 4)).toEqual(ficha);
        expect(juego.jugadores[0].fichas()).toEqual(4);
      });
    });
  });
  