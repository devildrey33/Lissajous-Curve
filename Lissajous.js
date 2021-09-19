/*
    Lissajous Curve creado por Josep Antoni Bover Comas el 19/09/2021

    Creado a partir de este concepto : https://twitter.com/pickover/status/1439386263451222017

        Vista por defecto en el Laboratorio de pruebas  
		devildrey33_Lab->Opciones->Vista = Filas;

        Ultima modificación el 19/09/2021
*/


// Constructor SIN TIPO, el tipo se especifica según la animación
var LissajousCurve = function() {
    // Llamo al constructor del ObjetoBanner, y si devuelve un error salgo retornando false.
    // El Tipo puede ser "2d" o "THREE".
    // El Entorno puede ser "Normal" o "Banner"
    if (ObjetoCanvas.call(this, { 
        'Tipo'          : '2d',
        'Ancho'         : 'Auto',
        'Alto'          : 'Auto',
        'Entorno'       : 'Normal',
        'MostrarFPS'    : true,
        'ColorFondo'    : 0x000000,
        'ElementoRaiz'  : "",
        'Pausar'        : false
    }) === false) { return false; }

    // Retorno true para advertir que se ha creado el canvas correctamente
    return true;
};

LissajousCurve.prototype = Object.assign( Object.create(ObjetoCanvas.prototype) , {
    constructor     : LissajousCurve, 
    // Datos de la animación [requerido]
    Nombre          : "LissajousCurve",
    IdeaOriginal    : "Cliff Pickover", // https://twitter.com/pickover/status/1439386263451222017
    URL             : "/Lab/Ejemplos/BannerTest/LissajousCurve.html",
    NombreURL       : "Lab : Lissajous Curve",    
    TamParrilla     : 16,                   // Número de circulos por lado de la parrilla (sin contar las cabeceras)
    Margen          : 40,                   // Margen entre los objetos en pixeles (NO TOCAR, se recaulcula solo)
    Velocidad       : (Math.PI * 2) / 720,  // Velocidad de la animación, contra más bajo sea el valor, mas lento irá
    Curvas          : [],
    Colores         : [ "#CECC61", "#59CA33", "#DE0B2C", "#805FEB", "#F86F19", "#9BFAB2", "#E996BC", "#F0E92B", "#96CDC4", "#F0DAA8", "#4F85C5", "#951070", "#7B9739", "#8430F5", "#9A0259","#630B69" ],
    // Función que se llama al redimensionar el documento
    Redimensionar   : function() {  this.Iniciar();  },

    // Función que inicia el ejemplo
    Iniciar         : function() {
        
        this.Margen = this.Alto / 35;
        // Creo los canvas necesarios según la parrilla
        // Estos canvas guardaran los resultados de la curva Lissajous
        var Marco = this.TamMarco();
        this.Circulo = new BufferCanvas(Marco, Marco);
        this.PintarCirculo();
        this.Curvas = [];
        for (var z = 0; z < this.TamParrilla; z++) {
            for (var i = 0; i < this.TamParrilla; i++) {
                this.Curvas.push(new this.Curva(1 + i, 1 + z,  Marco, this.Margen, this.Velocidad, this.Colores[i]));
            }
        }

        this.Cargando(false);

    },

    // Objeto que dibuja la curva Lissajous dentro de un buffer canvas
    Curva : function(Ratio1, Ratio2, Tam, Margen, Velocidad, Color) {
        this.Color      = Color;
        this.Ratio1     = Ratio1;
        this.Ratio2     = Ratio2;
        this.Tam        = Tam - Margen; // Le resto el margen
        this.Margen     = Margen;
        this.Canvas     = new BufferCanvas(Tam, Tam);
        this.Velocidad  = Velocidad;
        this.PosicionX  = 0;
        this.PosicionY  = 0;
        this.x          = 2 + (this.Tam / 2) + (Math.cos(this.PosicionX) * (this.Tam / 2));
        this.y          = 2 + (this.Tam / 2) + (Math.sin(this.PosicionY) * (this.Tam / 2));

        this.Canvas.Context.clearRect(0, 0, Tam, Tam);
        
        this.Canvas.Context.strokeStyle = Color;

        this.Canvas.Context.beginPath();
        this.Canvas.Context.moveTo(this.x, this.y);

        this.Avance = function() {
            var rad = Math.PI * 4;
            if (this.PosicionX >  (rad * Ratio1) && this.PosicionY > (rad * Ratio2)) {
                this.Canvas.Context.clearRect(0, 0, this.Tam + this.Margen, this.Tam + this.Margen);
                this.Canvas.Context.beginPath();
                this.PosicionX = 0;
                this.PosicionY = 0;
            }
            this.Canvas.Context.clearRect(0, 0, this.Tam, this.Tam);
            this.x = 2 + (this.Tam / 2) + (Math.cos(this.PosicionX) * (this.Tam / 2));
            this.y = 2 + (this.Tam / 2) + (Math.sin(this.PosicionY) * (this.Tam / 2));
            this.PosicionX += (this.Velocidad * Ratio1);
            this.PosicionY += (this.Velocidad * Ratio2);
            this.Canvas.Context.lineTo(this.x, this.y);
            this.Canvas.Context.stroke();            
        };
    },

    PintarCirculo : function() {
        var tam = this.Circulo.Ancho - this.Margen;
        var pos = 0;
        var x  = 2 + (tam / 2) + (Math.cos(pos) * (tam / 2));
        var y  = 2 + (tam / 2) + (Math.sin(pos) * (tam / 2));
        var tope = (Math.PI * 2)  + this.Velocidad;
        this.Circulo.Context.strokeStyle = "rgb(96,96,96)";
        this.Circulo.Context.beginPath();
        this.Circulo.Context.moveTo(x, y);
        for (pos = 0; pos < tope; pos += this.Velocidad) {
            var x  = 2 + (tam / 2) + (Math.cos(pos) * (tam / 2));
            var y  = 2 + (tam / 2) + (Math.sin(pos) * (tam / 2));
            this.Circulo.Context.lineTo(x, y);
        }
        this.Circulo.Context.stroke();
    },

    TamMarco : function() {
        // Cada circulo tendrá un marco igual a la altura del canvas (menos 20 pixeles de margen) dividida por TamParrilla mas 1 fila y 1 columna para las cabeceras.
        if (this.Alto > this.Ancho) 
            return  (this.Ancho - (this.Margen * 2)) / (this.TamParrilla + 1);
        else                        
            return  (this.Alto - (this.Margen * 2)) / (this.TamParrilla + 1);
    },

    // Pinta los circulos de la cabecera
    PintarCirculos  : function() {
        var Marco = this.TamMarco(); 
        
        this.Context.strokeStyle = "rgba(98, 94, 96, 0.75)";
        this.Context.fillStyle = "rgb(96,96,96)";

        this.Context.textAlign = 'center';
        this.Context.font = "20px Arial";
        this.Context.setLineDash([5, 5]);

        var x = (this.Ancho > this.Alto) ? ((this.Ancho - this.Alto) / 2) + (Marco / 2) : this.Margen + (Marco * 0.5);
        var y = (this.Margen + ((Marco - this.Margen) / 2)) + (Marco / 2);

        // Pinto los circulos verticales
        for (var i = 1; i < this.TamParrilla + 1; i++) {            
            // Pinto la línea gris
            this.Context.beginPath();
            var n = (this.TamParrilla * (i - 1)) + (i - 1);
            this.Context.moveTo(3 + x + this.Curvas[n].x, 3 + y + this.Curvas[n].y);
            this.Context.lineTo(3 + x + this.Curvas[this.Curvas.length - 1].x + (Marco * this.TamParrilla), 3 + y + this.Curvas[n].y);
            this.Context.stroke();
            // Pinto el circulo
            this.Context.drawImage(this.Circulo.Canvas, x, y, Marco + 5, Marco + 5);
            // Pinto el punto de unión del circulo con la línea gris
            this.Context.beginPath();
            this.Context.arc(x + this.Curvas[n].x + 2, 2 + y + this.Curvas[n].y, 5, 0, Math.PI * 2);
            this.Context.fill();
            // Pinto el valor del circulo
            this.Context.fillText(i, x + (Marco / 2.5) , 10 + y + (Marco / 2.5));
            y += Marco;
        }

        // Pinto los circulos horizontales
        y = (this.Margen + ((Marco - this.Margen) / 2)) + (Marco / 2);
        y -= Marco;
        x += Marco;

        for (var i = 1; i < this.TamParrilla + 1; i++) {
            // Pinto la línea gris
            this.Context.beginPath();
            var n = (this.TamParrilla * (i - 1)) + (i - 1);
            this.Context.moveTo(3 + x + this.Curvas[n].x, 3 + y + this.Curvas[n].y);
            this.Context.lineTo(3+ x + this.Curvas[n].x, 3 + y + this.Curvas[this.Curvas.length - 1].y + (Marco * this.TamParrilla) );
            this.Context.stroke();
            // Pinto el circulo
            this.Context.drawImage(this.Circulo.Canvas, x, y, Marco + 5, Marco + 5);
            // Pinto el punto de unión del circulo con la línea gris
            this.Context.beginPath();
            this.Context.arc(x + this.Curvas[n].x + 2, 2 + y + this.Curvas[n].y, 4, 0, Math.PI * 2);
            this.Context.fill();
            // Pinto el valor del circulo
            this.Context.fillText(i, x + (Marco / 2.5) , 10 + y + (Marco / 2.5));
            x += Marco;
        }

        this.Context.fillStyle = "rgba(255, 255, 255, 1)";

        // Pinto los puntos de unión de las curvas
        x = (this.Ancho > this.Alto) ?  ((this.Ancho - this.Alto) / 2) + (Marco * 1.5) : (this.Margen / 2)  + (Marco * 1.5);
        y = (this.Margen + ((Marco - this.Margen) / 2)) + (Marco * 0.5);
        var t = 0;
        for (var i = 0; i < this.Curvas.length; i++) {
            this.Context.beginPath();
            this.Context.arc(x + this.Curvas[i].x + 2, 2 + y + this.Curvas[i].y, 3, 0, Math.PI * 2);
            this.Context.fill();
            x += Marco;
            if (t++ == this.TamParrilla - 1) {
                y += Marco;
                x = (this.Ancho > this.Alto) ? ((this.Ancho - this.Alto) / 2) + (Marco * 1.5) : (this.Margen / 2)  + (Marco * 1.5);
                t = 0;
            }
        }
    },

    // Pinta las curvas
    PintarCurvas    : function() {
        var Marco = this.TamMarco(); // Cada circulo tendrá un marco igual a la altura del canvas (menos 20 pixeles de margen) dividida por 10.
        
        var x = (this.Ancho > this.Alto) ? ((this.Ancho - this.Alto) / 2) + (Marco * 1.5) : (this.Margen / 2)  + (Marco * 1.5);
        var y = (this.Margen + ((Marco - this.Margen) / 2)) + (Marco / 2);
        var p = 0;
        for (var z = 0; z < this.TamParrilla; z++) {
            for (var i = 0; i < this.TamParrilla; i++) {
                this.Curvas[p].Avance();
                this.Context.drawImage(this.Curvas[p++].Canvas.Canvas, x, y, Marco + 5, Marco + 5);
                x += Marco;
            }
            y += Marco;
            x = (this.Ancho > this.Alto) ? ((this.Ancho - this.Alto) / 2) + (Marco * 1.5) : (this.Margen / 2)  + (Marco * 1.5);
        }

    },
    
    // Función que pinta cada frame de la animación
    Pintar          : function() {  
        // El fondo
        this.Context.fillStyle = "rgba(49, 46, 53, 0.75)";
        this.Context.fillRect(0, 0, this.Ancho, this.Alto);
        // Pinto las curvas primero ya que van en canvas independientes
        this.PintarCurvas();
        // Pinto los circulos que hacen de cabecera, las lineas grises que marcan el paso y los puntos de intersección
        this.PintarCirculos();
    }
});

var Canvas = new LissajousCurve;

