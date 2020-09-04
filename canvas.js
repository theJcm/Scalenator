/*----------------------------- VARIABLES GLOBALES ----------------------------------------*/
//Diapason donde estan todas las notas
let fretboard = [];

//Nombre de notas
let fretNotes = [];

//Escala cromatica
chromaticScale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

//Escala Mayor
majorScale = [0, 2, 2, 1, 2, 2, 2];

//Escala Menor
minorScale = [0, 2, 1, 2, 2, 1, 2];
/*-----------------------------------------------------------------------------------------*/

/*----------------------------- CANVAS ----------------------------------------*/
let canvas = document.getElementById("canvas");
let navbar = document.getElementById("navbar");

let availableWidth = navbar.offsetWidth;
let availableHeight = (window.innerHeight - navbar.offsetHeight);
let dpi = window.devicePixelRatio;

let width = availableWidth
let height = availableHeight;

var canvasFabric = new fabric.Canvas('canvas', {
    renderOnAddRemove: false,
    backgroundColor: 'rgb(255,255,255, 1)',
    hoverCursor: 'pointer',
    enableRetinaScaling: true,
    width: width,
    height: height,
    selection: false,
    
    // alpha:true,
});

//Dispositivo
let device;
if (window.innerWidth < window.innerHeight) {
    device = "mobile";
} else {
    device = "desktop";
}
/*---------------------------------------------------------------------------*/

/*----------------------------- FUNCION AL CARGAR ----------------------------------------*/
document.addEventListener('DOMContentLoaded', function () {

    //Cargar las opciones de los elementos
    startElements();

    //Pintar diapason(mastil)
    setFretboard();
});
/*----------------------------------------------------------------------------------------*/


/*----------------------------- Functions ----------------------------------------*/
function findMayorScale(root) {
    let res = [];
    let idx = chromaticScale.indexOf(root);
    majorScale.forEach(function (itm) {
        res.push(chromaticScale[idx + itm]);
        idx = idx + itm;
    });
    return res;
}

function findMinorScale(root) {
    let res = [];
    let idx = chromaticScale.indexOf(root);
    minorScale.forEach(function (itm) {
        res.push(chromaticScale[idx + itm]);
        idx = idx + itm;
    });
    return res;
}

function createDdlKey() {
    //Cargar el combo de tonalidad(key)
    let keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    let ddlKey = document.getElementById("ddlKey");
    ddlKey.add(document.createElement("option")); //Opcion vacia
    for (let i in keys) {
        let opt = document.createElement("option");
        opt.text = keys[i];
        ddlKey.add(opt);
    }
}

function createDdlScale() {
    //Cargar el combo de escalas
    let ddlScales = ["Mayor", "Menor"];
    let selectScale = document.getElementById("ddlScale");
    selectScale.add(document.createElement("option")); //Opcion vacia
    for (let i = 0; i < ddlScales.length; i++) {
        let opt = document.createElement("option");
        opt.text = ddlScales[i];
        selectScale.add(opt);
    }
}

function createDdlInstrument() {
    //Cargar el combo de los instrumentos
    let instruments = ["Guitarra", "Bajo", "Ukelele"];
    let ddlInstrument = document.getElementById("ddlInstrument");
    //ddlInstrument.add(document.createElement("option")); //Opcion vacia
    for (let i in instruments) {
        let opt = document.createElement("option");
        opt.text = instruments[i];
        ddlInstrument.add(opt);
    }
}

function getclickedElement(element) {
    element.on('mousedown', function () {
        // console.log(element);

        let alert = document.getElementById("alert");
        alert.innerText = element.name;

        element.set('fill', `rgb(0,255,255)`);
    });
};

function resizeCanvas(){
    // Haven't resized in 100ms!
    
    canvasFabric.clear();

    if (window.innerHeight > window.innerWidth) {
        device = "mobile";
        canvasFabric.enableRetinaScaling = true;
    } else {
        device = "desktop";
        if (window.devicePixelRatio > 1) {
            canvasFabric.enableRetinaScaling = true;
        } else {
            canvasFabric.enableRetinaScaling = false;
        }
    }

    let body = document.getElementsByTagName('body')[0]

    availableWidth = navbar.offsetWidth;
    availableHeight = body.clientHeight - navbar.offsetHeight;

    // dpi = window.devicePixelRatio;   

    canvasFabric.setWidth(availableWidth);
    canvasFabric.setHeight(availableHeight);

    canvas.style.width = availableWidth;
    canvas.style.height = availableHeight;

    //Pintar todo de nuevo con las nuevas medidas
    setFretboard();
}

var timeoutResize;
window.onresize = function(){
  clearTimeout(timeoutResize);
  timeoutResize = setTimeout(resizeCanvas, 0);
};


function startElements() {
    //Instrumento
    createDdlInstrument();

    //Tonalidad
    createDdlKey();

    //Escala
    createDdlScale();
}

function setFretboard() {
    let freetColumns;
    let freetRows;
    let ddlInstrument = document.getElementById('ddlInstrument').value;
    let notes;
    if (device == "mobile") {
        switch (ddlInstrument) {
            case 'Guitarra':
                notes = [
                    ["E", "A", "D", "G", "B", "E"],
                    ["F", "A#", "D#", "G#", "C", "F"],
                    ["F#", "B", "E", "A", "C#", "F#"],
                    ["G", "C", "F", "A#", "D", "G"],
                    ["G#", "C#", "F#", "B", "D#", "G#"],
                    ["A", "D", "G", "C", "E", "A"],
                    ["A#", "D#", "G#", "C#", "F", "A#"],
                    ["B", "E", "A", "D", "F#", "B"],
                    ["C", "F", "A#", "D#", "G", "C"],
                    ["C#", "F#", "B", "E", "G#", "C#"],
                    ["D", "G", "C", "F", "A", "D"],
                    ["D#", "G#", "C#", "F#", "A#", "D#"],
                    ["E", "A", "D", "G", "B", "E"],
                    ["F", "A#", "D#", "G#", "C", "F"],
                    ["F#", "B", "E", "A", "C#", "F#"],
                    ["G", "C", "F", "A#", "D", "G"],
                    ["G#", "C#", "F#", "B", "D#", "G#"],
                    ["A", "D", "G", "C", "E", "A"],
                    ["A#", "D#", "G#", "C#", "F", "A#"],
                    ["B", "E", "A", "D", "F#", "B"],
                    ["C", "F", "A#", "D#", "G", "C"],
                    ["C#", "F#", "B", "E", "G#", "C#"],
                    ["D", "G", "C", "F", "A", "D"],
                    ["D#", "G#", "C#", "F#", "A#", "D#"],
                    ["E", "A", "D", "G", "B", "E"]];
                freetColumns = 6;
                freetRows = 25;
                break;
            case 'Bajo':
                notes = [
                    ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G"],
                    ["D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D"],
                    ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"],
                    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"]];
                freetColumns = 25;
                freetRows = 4;
                break;
            case 'Ukelele':
                notes = [
                    ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"],
                    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"],
                    ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C"],
                    ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G"]];
                freetColumns = 13;
                freetRows = 4;
                break;
            default:
                notes = [
                    ["E", "A", "D", "G", "B", "E"],
                    ["F", "A#", "D#", "G#", "C", "F"],
                    ["F#", "B", "E", "A", "C#", "F#"],
                    ["G", "C", "F", "A#", "D", "G"],
                    ["G#", "C#", "F#", "B", "D#", "G#"],
                    ["A", "D", "G", "C", "E", "A"],
                    ["A#", "D#", "G#", "C#", "F", "A#"],
                    ["B", "E", "A", "D", "F#", "B"],
                    ["C", "F", "A#", "D#", "G", "C"],
                    ["C#", "F#", "B", "E", "G#", "C#"],
                    ["D", "G", "C", "F", "A", "D"],
                    ["D#", "G#", "C#", "F#", "A#", "D#"],
                    ["E", "A", "D", "G", "B", "E"],
                    ["F", "A#", "D#", "G#", "C", "F"],
                    ["F#", "B", "E", "A", "C#", "F#"],
                    ["G", "C", "F", "A#", "D", "G"],
                    ["G#", "C#", "F#", "B", "D#", "G#"],
                    ["A", "D", "G", "C", "E", "A"],
                    ["A#", "D#", "G#", "C#", "F", "A#"],
                    ["B", "E", "A", "D", "F#", "B"],
                    ["C", "F", "A#", "D#", "G", "C"],
                    ["C#", "F#", "B", "E", "G#", "C#"],
                    ["D", "G", "C", "F", "A", "D"],
                    ["D#", "G#", "C#", "F#", "A#", "D#"],
                    ["E", "A", "D", "G", "B", "E"]];
                freetColumns = 6;
                freetRows = 25;
                break;
        }
    } else {
        switch (ddlInstrument) {
            case 'Guitarra':
                notes = [
                    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"],
                    ["B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
                    ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G"],
                    ["D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D"],
                    ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"],
                    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"]];
                freetColumns = 25;
                freetRows = 6;
                break;
            case 'Bajo':
                notes = [
                    ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G"],
                    ["D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D"],
                    ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"],
                    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"]];
                freetColumns = 25;
                freetRows = 4;
                break;
            case 'Ukelele':
                notes = [
                    ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"],
                    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"],
                    ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C"],
                    ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G"]];
                freetColumns = 13;
                freetRows = 4;
                break;
            default:
                notes = [
                    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"],
                    ["B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
                    ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G"],
                    ["D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D"],
                    ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"],
                    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"]
                ];
                freetColumns = 25;
                freetRows = 6;
                break;
        }
    }

    console.log(`Device: ${device}`)

    let stroke = 1;

    let freetNumbers = availableHeight / 14;


    let freetLeft = 0;
    let freetTop = freetNumbers - stroke;
    let freetWidth = (innerWidth - stroke) / freetColumns;
    let freetHeight = (availableHeight - freetNumbers) / freetRows;

    for (i = 0; i < freetColumns; i++) {
        let circle = new fabric.Circle({
            left: freetLeft,
            top: 0,
            radius: 12,
            fill: '#0069ff',
            width: freetWidth,
            height: freetNumbers,
            centeredScaling: true,
            evented: false,
            selectable: false,
            backgroundColor: '#fff',
            objectCaching: false,
        });

        canvasFabric.add(circle);

        let freetNumber = new fabric.Textbox(String(i + 1), {
            left: freetLeft,
            top: freetNumbers / 2.5 - 1,
            fontSize: 12,
            fontWeight: 'bold',
            textAlign: 'center',
            fontFamily: "sans-serif",
            fill: '#fff',
            centeredScaling: true,
            evented: false,
            selectable: false,
            width: freetWidth,
            height: freetNumbers,
            objectCaching: false,
        });

        canvasFabric.add(freetNumber);

        for (j = 0; j < freetRows; j++) {
            let rect = new fabric.Rect({
                left: freetLeft,
                top: freetTop,
                width: freetWidth,
                height: freetHeight,
                stroke: '#c8e4ff',
                strokeWidth: stroke,

                selectable: false,
                fill: "rgb(255,255,255)",
                name: `Rectangle_[${i}][${j}]`,
                objectCaching: false,

                // Set tild Note
                note: notes[j][i]
            });

            // Add object to array  
            fretboard.push(rect);

            // Set event listener to current Object
            getclickedElement(rect);

            color1 = Math.floor(Math.random() * (255 - 0) + 0);
            color2 = Math.floor(Math.random() * (255 - 0) + 0);
            color3 = Math.floor(Math.random() * (255 - 0) + 0);

            canvasFabric.add(rect);

            let rectNote = new fabric.Textbox(rect.note, {
                left: freetLeft,
                top: freetTop + freetHeight * 0.5,
                fontSize: 10,
                textAlign: 'center',
                fontFamily: "sans-serif",
                evented: false,
                selectable: false,
                width: freetWidth,
                height: freetHeight,
                originY: 'center',
                objectCaching: false,
            });

            fretNotes.push(rectNote);
            canvasFabric.add(rectNote);

            freetTop += freetHeight;
        }

        let freetLine = new fabric.Line([0, 0, 0, availableHeight], {
            left: freetLeft,
            top: freetNumbers,
            stroke: "#66aaff",
            strokeWidth: 3,
            selectable: false,
            selection: false,
            objectCaching: false,
        });

        canvasFabric.add(freetLine);

        freetLeft += freetWidth;
        freetTop = freetNumbers - stroke;
    }
}

function onChangeDdlKey(ddl) {

    //Limpiar el mastil
    for (let i in fretboard) {
        let fret = fretboard[i];
        fret.set('fill', `rgb(255,255,255)`);

        fretNotes[i].set('fill', '#000000');
        fretNotes[i].fontWeight = 'normal';
    }

    //Saber que escala encontrar
    let ddlScale = document.getElementById("ddlScale").value;

    //Seleccion de notas de la escala sobre el mastil
    let selectedKey = ddl.value;
    let ScaleNotes;
    switch (ddlScale) {
        case "Mayor":
            ScaleNotes = findMayorScale(String(selectedKey));
            break;
        case "Menor":
            ScaleNotes = findMinorScale(String(selectedKey));
            break;
    }

    for (let note in ScaleNotes) {
        for (let i in fretboard) {
            if (fretboard[i].note == ScaleNotes[note]) {
                let fret = fretboard[i];
                //console.log(fret)
                fret.set('fill', '#0069ff');

                // Change letter color
                fretNotes[i].set('fill', '#ffffff');
                fretNotes[i].fontWeight = 'bold';            
            }
        }
    }
    canvasFabric.requestRenderAll()
}

function onChangeDdlInstrumen(ddl) {
    canvasFabric.clear();
    setFretboard();
    canvasFabric.requestRenderAll();

    //Resetear los elementos
    let ddlScale = document.getElementById('ddlScale');
    ddlScale.options[0].selected = true;

    let ddlKey = document.getElementById('ddlKey');
    ddlKey.options[0].selected = true;
}
/*--------------------------------------------------------------------------------*/

let toggleFullscreen = document.getElementsByTagName('nav')[0];

toggleFullscreen.addEventListener('click', () => {
    if (device == 'mobile') {
        if (!document.fullscreenElement) {
            document.body.requestFullscreen();
        }
    }
});