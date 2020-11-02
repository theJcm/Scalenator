/*----------------------------- VARIABLES GLOBALES ----------------------------------------*/
//Diapason donde estan todas las notas
let fretboard = [];

//Nombre de notas
let fretNotes = [];

//Escala cromatica
let chromaticScale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

//Escala Mayor
let majorScale = [0, 2, 2, 1, 2, 2, 2];

//Escala Menor
let minorScale = [0, 2, 1, 2, 2, 1, 2];

//Escala Disminuida
let diminishedScale = [0, 3, 3, 3, 3, 3, 3];

//Acordes Mayor (Triada)
let majorTriadChords = ["Mayor", "Menor", "Menor", "Mayor", "Mayor", "Menor", "Semidisminuido"];

//Acordes Mayor (Cuatriada)
let majorTetradChords = ["Mayor 7", "Menor 7", "Menor 7", "Mayor 7", "7", "Menor 7", "Disminuido"];

//Acordes Menor (Triada)
let minorTriadChords = ["Menor", "Semidisminuido", "Mayor", "Menor", "Menor", "Mayor", "Mayor"];

//Acordes Menor (Cuatriada)
let minorTetradChords = ["Menor 7", "Disminuido", "Mayor 7", "Menor 7", "Menor 7", "Mayor 7", "7"];
/*-----------------------------------------------------------------------------------------*/

/*----------------------------- CANVAS ----------------------------------------*/
let canvas = document.getElementById("canvas");
let navbar = document.getElementById("navbar");

let availableWidth = navbar.offsetWidth;
let availableHeight = (window.innerHeight - navbar.offsetHeight);
let dpi = window.devicePixelRatio;

let width = availableWidth
let height = availableHeight;

let canvasFabric = new fabric.Canvas('canvas', {
    renderOnAddRemove: false,
    backgroundColor: 'rgb(255,255,255, 1)',
    hoverCursor: 'pointer',
    enableRetinaScaling: true,
    width: null,
    height: null,
    selection: false,
});

//Dispositivo
let device;
window.innerWidth < window.innerHeight ? device = 'mobile' : device = "desktop";

//Tone Js
let sampler = new Tone.Sampler({
    urls: {
        A1: 'A1.ogg',
        C3: 'C3.ogg',
        E2: 'E2.ogg',
    },
    baseUrl: 'https://raw.githubusercontent.com/theJcm/Scalenator/master/samples/guitar/',
    onload: function () {
        console.log('listo');
    },
}).toDestination();

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

function findDiminishedScale(root) {
    let res = [];
    let idx = chromaticScale.indexOf(root);
    diminishedScale.forEach(function (itm) {
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

function createDDlTuning() {
    //Cargar el combo de afinacion(tuning)
    let tunings = ["F", "E", "G"];
    let ddlTuning = document.getElementById("ddlTuning");
    for (let i in tunings) {
        let opt = document.createElement("option");
        opt.text = tunings[i];
        ddlTuning.add(opt);
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
    let instruments = ["Guitarra", "Bajo", "Ukelele", "Bajo quinto", "Acordeón"];
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

        element.set('fill', `rgb(255, 118, 117)`);

        let note = element.note;
        let octave = element.octave;
        sampler.triggerAttackRelease(note + octave, 1.6);

        console.log(element);
    });
};

function resizeCanvas() {

    canvasFabric.clear();

    device = getDevice();

    if (device == "mobile") {
        canvasFabric.enableRetinaScaling = true;
    } else {
        if (window.devicePixelRatio > 1) {
            canvasFabric.enableRetinaScaling = true;
        } else {
            canvasFabric.enableRetinaScaling = false;
        }
    }

    let body = document.getElementsByTagName('body')[0]

    availableWidth = navbar.offsetWidth;
    availableHeight = body.clientHeight - navbar.offsetHeight;

    canvasFabric.setWidth(availableWidth);
    canvasFabric.setHeight(availableHeight);
    console.log(availableHeight + " canvasFabric")

    canvas.style.width = availableWidth;
    canvas.style.height = availableHeight;
    console.log(availableHeight+ " canvas style")


    //Pintar todo de nuevo con las nuevas medidas
    setFretboard();
}

var timeoutResize;
window.onresize = function () {
    clearTimeout(timeoutResize);
    timeoutResize = setTimeout(resizeCanvas, 100);
};


function startElements() {
    //Instrumento
    createDdlInstrument();

    //Afinacion (solo aplica por el momento a el acordeon)
    createDDlTuning();

    //Tonalidad
    createDdlKey();

    //Escala
    createDdlScale();
}

function setFretboard() {
    let fretColumns;
    let fretRows;
    let ddlInstrument = document.getElementById('ddlInstrument').value;
    let ddlTuning = document.getElementById('ddlTuning').value;
    let stateFuelle = document.getElementById('fuelle').getAttribute('state');
    let notes;

    function prepareNotes(notesArray, instrument) {
        for (i=0; i < notesArray.length; i++) {
            for (j = 0; j < notesArray[i].length; j++) {
                notesArray[i][j] = [notesArray[i][j], ""]
            }
        }
        console.log(`----${instrument}---- Formated notes array:`);
        console.log(JSON.stringify(notesArray));
    }

    switch (ddlInstrument) {
        case 'Guitarra':
            notes = [
                [["E", "4"], ["F", "4"], ["F#", "4"], ["G", "4"], ["G#", "4"], ["A", "4"], ["A#", "4"], ["B", "4"], ["C", "5"], ["C#", "5"], ["D", "5"], ["D#", "5"], ["E", "5"], ["F", "5"], ["F#", "5"], ["G", "5"], ["G#", "5"], ["A", "5"], ["A#", "5"], ["B", "5"], ["C", "6"], ["C#", "6"], ["D", "6"], ["D#", "6"], ["E", "6"]],
                [["B", "3"], ["C", "4"], ["C#", "4"], ["D", "4"], ["D#", "4"], ["E", "4"], ["F", "4"], ["F#", "4"], ["G", "4"], ["G#", "4"], ["A", "4"], ["A#", "4"], ["B", "4"], ["C", "5"], ["C#", "5"], ["D", "5"], ["D#", "5"], ["E", "5"], ["F", "5"], ["F#", "5"], ["G", "5"], ["G#", "5"], ["A", "5"], ["A#", "5"], ["B", "5"]],
                [["G", "3"], ["G#", "3"], ["A", "3"], ["A#", "3"], ["B", "3"], ["C", "4"], ["C#", "4"], ["D", "4"], ["D#", "4"], ["E", "4"], ["F", "4"], ["F#", "4"], ["G", "4"], ["G#", "4"], ["A", "4"], ["A#", "4"], ["B", "4"], ["C", "5"], ["C#", "5"], ["D", "5"], ["D#", "5"], ["E", "5"], ["F", "5"], ["F#", "5"], ["G", "5"]],
                [["D", "3"], ["D#", "3"], ["E", "3"], ["F", "3"], ["F#", "3"], ["G", "3"], ["G#", "3"], ["A", "3"], ["A#", "3"], ["B", "3"], ["C", "4"], ["C#", "4"], ["D", "4"], ["D#", "4"], ["E", "4"], ["F", "4"], ["F#", "4"], ["G", "4"], ["G#", "4"], ["A", "4"], ["A#", "4"], ["B", "4"], ["C", "5"], ["C#", "5"], ["D", "5"]],
                [["A", "2"], ["A#", "2"], ["B", "2"], ["C", "3"], ["C#", "3"], ["D", "3"], ["D#", "3"], ["E", "3"], ["F", "3"], ["F#", "3"], ["G", "3"], ["G#", "3"], ["A", "3"], ["A#", "3"], ["B", "3"], ["C", "4"], ["C#", "4"], ["D", "4"], ["D#", "4"], ["E", "4"], ["F", "4"], ["F#", "4"], ["G", "4"], ["G#", "4"], ["A", "4"]],
                [["E", "2"], ["F", "2"], ["F#", "2"], ["G", "2"], ["G#", "2"], ["A", "2"], ["A#", "2"], ["B", "2"], ["C", "3"], ["C#", "3"], ["D", "3"], ["D#", "3"], ["E", "3"], ["F", "3"], ["F#", "3"], ["G", "3"], ["G#", "3"], ["A", "3"], ["A#", "3"], ["B", "3"], ["C", "4"], ["C#", "4"], ["D", "4"], ["D#", "4"], ["E", "4"]]
            ];
            break;
        case 'Bajo':
            notes = [
                ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G"],
                ["D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D"],
                ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"],
                ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"]];
            prepareNotes(notes, ddlInstrument);
            break;
        case 'Ukelele':
            notes = [
                [["A", "5"], ["A#", "5"], ["B", "5"], ["C", "5"], ["C#", "5"], ["D", "5"], ["D#", "5"], ["E", "5"], ["F", "5"], ["F#", "5"], ["G", "5"], ["G#", "5"], ["A", "5"]],
                [["E", "4"], ["F", "4"], ["F#", "4"], ["G", "4"], ["G#", "4"], ["A", "4"], ["A#", "4"], ["B", "4"], ["C", "4"], ["C#", "4"], ["D", "4"], ["D#", "4"], ["E", "4"]],
                [["C", "2"], ["C#", "2"], ["D", "2"], ["D#", "2"], ["E", "2"], ["F", "2"], ["F#", "2"], ["G", "2"], ["G#", "2"], ["A", "2"], ["A#", "2"], ["B", "2"], ["C", "2"]],
                [["G", "3"], ["G#", "3"], ["A", "3"], ["A#", "3"], ["B", "3"], ["C", "3"], ["C#", "3"], ["D", "3"], ["D#", "3"], ["E", "3"], ["F", "3"], ["F#", "3"], ["G", "3"]]];
            break;
        case "Bajo quinto":
            notes = [
                ["F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D"],
                ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"],
                ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"],
                ["D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
                ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#"]];
            prepareNotes(notes, ddlInstrument);
            break;
        case "Acordeón":
            switch (ddlTuning) {
                case "F":
                    if (stateFuelle == "0") {
                        notes = [
                            ["B", "D", "F", "G#", "C", "D", "F", "G#", "C", "D", ""],
                            ["F#", "A", "C", "D#", "G", "A", "C", "D#", "G", "A", "C"],
                            ["C#", "G", "A#", "D", "E", "G", "A#", "D", "E", "G", ""]];
                    }
                    else {
                        notes = [
                            ["C#", "A#", "D#", "G", "A#", "D#", "G", "A#", "D#", "G", ""],
                            ["E", "F", "A#", "D", "F", "A#", "D", "F", "A#", "D", "F"],
                            ["B", "F", "A", "C", "F", "A", "C", "F", "A", "C", ""]];
                    }
                    break;
                case "E":
                    if (stateFuelle == "0") {
                        notes = [
                            ["A#", "C#", "E", "G", "B", "C#", "E", "G", "B", "C#", ""],
                            ["F", "G#", "B", "D", "F#", "G#", "B", "D", "F#", "G#", "B"],
                            ["C", "F#", "A", "D#", "D#", "F#", "A", "C#", "D#", "F#", ""]];
                    }
                    else {
                        notes = [
                            ["C", "A", "D", "F#", "A", "D", "F#", "A", "D", "F#", ""],
                            ["D#", "E", "A", "C#", "E", "A", "C#", "E", "A", "C#", "E"],
                            ["A#", "E", "G#", "B", "E", "G#", "B", "E", "G#", "B", ""]];
                    }
                    break;
                case "G":
                    if (stateFuelle == "0") {
                        notes = [
                            ["C#", "E", "G", "A#", "D", "E", "G", "A#", "D", "E", ""],
                            ["G#", "B", "D", "F", "A", "B", "D", "F", "A", "B", "D"],
                            ["D#", "A", "C", "E", "F#", "A", "C", "E", "F#", "A", ""]];
                    }
                    else {
                        notes = [
                            ["D#", "C", "F", "A", "C", "F", "A", "C", "F", "A", ""],
                            ["F#", "G", "C", "E", "G", "C", "E", "G", "C", "E", "G"],
                            ["C#", "G", "B", "D", "G", "B", "D", "G", "B", "D", ""]];
                    }
                    break;
                default:
                    break;
            }

            //Mostrar fuelle
            let divFuelle = document.getElementById("divFuelle");
            divFuelle.style.display = "block";
            break;
        default:
            notes = [
                [["E", "4"], ["F", "4"], ["F#", "4"], ["G", "4"], ["G#", "4"], ["A", "4"], ["A#", "4"], ["B", "4"], ["C", "5"], ["C#", "5"], ["D", "5"], ["D#", "5"], ["E", "5"], ["F", "5"], ["F#", "5"], ["G", "5"], ["G#", "5"], ["A", "5"], ["A#", "5"], ["B", "5"], ["C", "6"], ["C#", "6"], ["D", "6"], ["D#", "6"], ["E", "6"]],
                [["B", "3"], ["C", "4"], ["C#", "4"], ["D", "4"], ["D#", "4"], ["E", "4"], ["F", "4"], ["F#", "4"], ["G", "4"], ["G#", "4"], ["A", "4"], ["A#", "4"], ["B", "4"], ["C", "5"], ["C#", "5"], ["D", "5"], ["D#", "5"], ["E", "5"], ["F", "5"], ["F#", "5"], ["G", "5"], ["G#", "5"], ["A", "5"], ["A#", "5"], ["B", "5"]],
                [["G", "3"], ["G#", "3"], ["A", "3"], ["A#", "3"], ["B", "3"], ["C", "4"], ["C#", "4"], ["D", "4"], ["D#", "4"], ["E", "4"], ["F", "4"], ["F#", "4"], ["G", "4"], ["G#", "4"], ["A", "4"], ["A#", "4"], ["B", "4"], ["C", "5"], ["C#", "5"], ["D", "5"], ["D#", "5"], ["E", "5"], ["F", "5"], ["F#", "5"], ["G", "5"]],
                [["D", "3"], ["D#", "3"], ["E", "3"], ["F", "3"], ["F#", "3"], ["G", "3"], ["G#", "3"], ["A", "3"], ["A#", "3"], ["B", "3"], ["C", "4"], ["C#", "4"], ["D", "4"], ["D#", "4"], ["E", "4"], ["F", "4"], ["F#", "4"], ["G", "4"], ["G#", "4"], ["A", "4"], ["A#", "4"], ["B", "4"], ["C", "5"], ["C#", "5"], ["D", "5"]],
                [["A", "2"], ["A#", "2"], ["B", "2"], ["C", "3"], ["C#", "3"], ["D", "3"], ["D#", "3"], ["E", "3"], ["F", "3"], ["F#", "3"], ["G", "3"], ["G#", "3"], ["A", "3"], ["A#", "3"], ["B", "3"], ["C", "4"], ["C#", "4"], ["D", "4"], ["D#", "4"], ["E", "4"], ["F", "4"], ["F#", "4"], ["G", "4"], ["G#", "4"], ["A", "4"]],
                [["E", "2"], ["F", "2"], ["F#", "2"], ["G", "2"], ["G#", "2"], ["A", "2"], ["A#", "2"], ["B", "2"], ["C", "3"], ["C#", "3"], ["D", "3"], ["D#", "3"], ["E", "3"], ["F", "3"], ["F#", "3"], ["G", "3"], ["G#", "3"], ["A", "3"], ["A#", "3"], ["B", "3"], ["C", "4"], ["C#", "4"], ["D", "4"], ["D#", "4"], ["E", "4"]]
            ];
            break;
    }

    //Obtener filas y columnas
    fretRows = notes.length;
    fretColumns = notes[0].length;

    // Freet parametros para dibujar canvas
    let freetLabel = availableHeight / 14;
    let freetStroke = 1;

    // Parametros de posicion
    let freetLeft = 0;
    let freetTop = freetLabel - freetStroke;

    // Parametros del canvas
    const canvasMargin = 16;

    // Parametros de dimension
    let freetWidth = (innerWidth - freetStroke - canvasMargin * 2) / fretColumns;
    let freetHeight = ((availableHeight - freetLabel) - (availableHeight / 3)) / fretRows;
    document.getElementsByClassName('canvas-container')[0].style.width = availableWidth - canvasMargin * 2 + "px";

    
    if (device == 'mobile') {
        freetWidth = innerWidth / 8;
        freetHeight = 40;

        canvasFabric.setWidth(parseInt((innerWidth / 8) * fretColumns + freetStroke));
        canvasFabric.setHeight(parseInt(freetHeight * fretRows + freetLabel));

        document.getElementsByClassName('canvas-container')[0].style.width = availableWidth - canvasMargin * 2 + "px";
    }

    // Setting for desktop
    // Set size of canvas to fit content
    let canvasFitWidth = innerWidth
    let canvasFitHeight = freetHeight * fretRows + freetLabel

    if (device == 'desktop') {
        canvasFabric.setWidth(parseInt(canvasFitWidth - canvasMargin*2));
        canvasFabric.setHeight(parseInt(canvasFitHeight))
    }

    for (i = 0; i < fretColumns; i++) {
        let circle = new fabric.Circle({
            left: freetLeft,
            top: 0,
            radius: 12,
            fill: '#ff6e611c',
            width: freetWidth,
            height: freetLabel,
            evented: false,
            selectable: false,
            backgroundColor: '#fff',
            objectCaching: false,
        });

        canvasFabric.add(circle);

        let freetNumber = new fabric.Textbox(ddlInstrument != "Acordeón" ? String(i) : String(i + 1), {
            left: freetLeft,
            top: freetLabel / 2.5 - 1,
            fontSize: 12,
            fontWeight: 'bold',
            textAlign: 'center',
            fontFamily: "sans-serif",
            fill: '#FF6E61',
            evented: false,
            selectable: false,
            width: freetWidth,
            height: freetLabel,
            objectCaching: false,
            caching: false
        });

        canvasFabric.add(freetNumber);

        for (j = 0; j < fretRows; j++) {
            let rect = new fabric.Rect({
                left: freetLeft,
                top: freetTop + 1,
                width: freetWidth,
                height: freetHeight - 1,
                // stroke: 'rgb(255, 110, 97, .39)',
                // stroke: '#000',
                strokeWidth: 0,
                selectable: false,
                fill: "#fff",
                objectCaching: false,
                paintFirst: 'fill',
                // strokeUniform: true,

                // Nombre de nota y su octava
                note: notes[j][i][0],
                octave: notes[j][i][1],
                degree: 0,
            });
            

            // Añadir traste al arreglo
            fretboard.push(rect);

            // Set event listener to current Object
            getclickedElement(rect);

            canvasFabric.add(rect);

            let rectNote = null;
            let fontSizeRecNote = device == "mobile" ? 10 : 12;

            rectNote = new fabric.Textbox(rect.note, {
                left: freetLeft,
                top: freetTop + freetHeight * 0.5,
                fontSize: fontSizeRecNote,
                textAlign: 'center',
                fontFamily: "Arial",
                evented: false,
                selectable: false,
                fill: '#E06155',
                width: freetWidth,
                height: freetHeight,
                originY: 'center',
                objectCaching: false,
            });

            fretNotes.push(rectNote);
            canvasFabric.add(rectNote);

            freetTop += freetHeight;
        }

        let freetLine = new fabric.Line([0, 0, 0, canvasFitHeight - freetLabel - 4], {
            left: freetLeft,
            top: freetLabel,
            stroke: "#FF6E61",
            strokeWidth: 4,
            selectable: false,
            selection: false,
            objectCaching: false,
            strokeLineCap: 'round',
            strokeLineJoin: 'round'
        });
        canvasFabric.add(freetLine);


        

        freetLeft += freetWidth;
        freetTop = freetLabel - freetStroke;
    }

    for (i=0; i < fretRows + 1; i++) {
        if (i == 6 ) {
            let strokeLine = new fabric.Line([0, 0, canvas.width, 0], {
                left: 0,
                top: canvasFitHeight - freetStroke,
                stroke: "#ffdbd8",
                strokeWidth: 1,
                selectable: false,
                selection: false,
                objectCaching: false,
                paintFirst: true
                // strokeLineCap: 'round',
                // strokeLineJoin: 'round'
            });
            canvasFabric.add(strokeLine);
            freetLabel = parseInt(freetLabel) + parseInt(freetHeight)
            console.log(freetLabel)
            canvasFabric.sendToBack(strokeLine)

        } else {
            let strokeLine = new fabric.Line([0, 0, canvas.width, 0], {
                left: 0,
                top: parseInt(freetLabel),
                stroke: "#ffdbd8",
                strokeWidth: 1,
                selectable: false,
                selection: false,
                objectCaching: false,
                paintFirst: true
                // strokeLineCap: 'round',
                // strokeLineJoin: 'round'
            });
            canvasFabric.add(strokeLine);
            freetLabel = parseInt(freetLabel) + parseInt(freetHeight)
            console.log(freetLabel)
            // canvasFabric.sendToBack(strokeLine)

        }

        

        

        // Sends grid backwards
        // canvasFabric.sendBackwards(strokeLine)

    }   

}

function onChangeDdlKey(ddl) {

    //Limpiar el mastil
    for (let i in fretboard) {
        let fret = fretboard[i];
        fret.set('fill', `rgb(255,255,255)`);
        fretNotes[i].set('fill', '#E06155');
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
            let fret = fretboard[i];
            if (fretboard[i].note == ScaleNotes[note]) {              
                fret.set('fill', '#ff6e6130');

                // Change letter color
                fretNotes[i].set('fill', '#FF6E61');
                fretNotes[i].fontWeight = 'bold';

                //Grado de la escala
                fret.degree = parseInt(note) + 1;
            }
        }
    }
    canvasFabric.requestRenderAll();

    //Limpiar acordes
    let chordContainer = document.getElementById("chordContainer");
    while (chordContainer.firstChild) {
        chordContainer.removeChild(chordContainer.firstChild);
    }

    //Generar acordes de la tonalidad
    for (let i in ScaleNotes) {
        let ChordNotes;
        let liElement = document.createElement("li");
        let buttonElement = document.createElement("button");
        switch (ddlScale) {
            case "Mayor":
                buttonElement.innerHTML = ScaleNotes[i] + " " + majorTriadChords[i];
                switch (majorTriadChords[i]) {
                    case "Mayor":
                        ChordNotes = findMayorScale(ScaleNotes[i]);
                        break;
                    case "Menor":
                        ChordNotes = findMinorScale(ScaleNotes[i]);
                        break;
                    case "Semidisminuido":
                        ChordNotes = findDiminishedScale(ScaleNotes[i]);
                        break;
                }
                break;
            case "Menor":
                buttonElement.innerHTML = ScaleNotes[i] + " " + minorTriadChords[i];
                switch (minorTriadChords[i]) {
                    case "Mayor":
                        ChordNotes = findMayorScale(ScaleNotes[i]);
                        break;
                    case "Menor":
                        ChordNotes = findMinorScale(ScaleNotes[i]);
                        break;
                    case "Semidisminuido":
                        ChordNotes = findDiminishedScale(ScaleNotes[i]);
                        break;
                }
                break;
        }

        buttonElement.setAttribute("Notes", ChordNotes[0] + ", " + ChordNotes[2] + ", " + ChordNotes[4]);
        buttonElement.setAttribute("onclick", "onClickChord(this);");

        liElement.appendChild(buttonElement);
        chordContainer.appendChild(liElement);

        //Mostrar contenedor de acordes
        let divChordContainer = document.getElementsByClassName("divChord-container")[0];
        divChordContainer.style.display = "block";
    }
}

function onChangeDdlInstrument(ddl) {
    canvasFabric.clear();
    setFretboard();
    canvasFabric.requestRenderAll();

    //Limpiar todo
    clearAll();
    let ddlInstrument = document.getElementById("ddlInstrument").value;
    let divDdlTuning = document.getElementById("divDdlTuning");
    let divFuelle = document.getElementById("divFuelle");
    if (ddlInstrument == "Acordeón") {
        divDdlTuning.style.display = "block";
        divFuelle.style.display = "block";
    }
    else {
        divDdlTuning.style.display = "none";
        divFuelle.style.display = "none";
    }
}

function onChangeDdlTuning(ddl) {
    canvasFabric.clear();
    setFretboard();
    canvasFabric.requestRenderAll();

    //Limpiar todo
    clearAll();
}

function onChangeDdlLabel(ddl) {

    let selectedLabel = ddl.value;

    switch (selectedLabel) {
        case 'Notas':
            for (let i in fretboard) {
                let fret = fretboard[i];

                if (fret.degree != 0) {
                    fretNotes[i].set("text", String(fret.note));
                }
            }
            break;
        case 'Grados':
            for (let i in fretboard) {
                let fret = fretboard[i];

                if (fret.degree != 0) {
                    fretNotes[i].set("text", String(fret.degree));
                }
            }
            break;
    }

    canvasFabric.requestRenderAll();
}

function clearAll() {
    //Resetear los elementos
    let ddlScale = document.getElementById('ddlScale');
    ddlScale.options[0].selected = true;
    let ddlKey = document.getElementById('ddlKey');
    ddlKey.options[0].selected = true;

    //Limpiar acordes
    let chordContainer = document.getElementById("chordContainer");
    while (chordContainer.firstChild) {
        chordContainer.removeChild(chordContainer.firstChild);
    }
    //Fuelle
    /*let divFuelle = document.getElementById("divFuelle");
    divFuelle.style.display = "none";*/
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

function getDevice() {
    window.innerWidth < window.innerHeight ? device = 'mobile' : device = "desktop";
    return device;
}

function onClickFuelle() {
    let stateFuelle = document.getElementById('fuelle');
    if (stateFuelle.getAttribute('state') == "0") {
        stateFuelle.setAttribute("state", "1");
        stateFuelle.innerHTML = "Cerrar fuelle";
    }
    else {
        stateFuelle.setAttribute("state", "0");
        stateFuelle.innerHTML = "Abrir fuelle";
    }

    setFretboard();
}

function onChangeRadChordType(rad) {
    let radSelected = rad.nextSibling.nextSibling.innerHTML;
    let divContainer = document.getElementById('chordContainer');
    let btnChords = divContainer.querySelectorAll("button");
    let ddlScale = document.getElementById("ddlScale").value;
    let ChordNotes;

    if (radSelected == "Triada") {
        for (let i = 0; i < btnChords.length; i++) {
            let degree = btnChords[i].getAttribute("notes").split(",")[0];
            switch (ddlScale) {
                case "Mayor":
                    btnChords[i].innerHTML = degree + " " + majorTriadChords[i];
                    switch (majorTriadChords[i]) {
                        case "Mayor":
                            ChordNotes = findMayorScale(degree);
                            break;
                        case "Menor":
                            ChordNotes = findMinorScale(degree);
                            break;
                        case "Semidisminuido":
                            ChordNotes = findDiminishedScale(degree);
                            break;
                    }
                    break;
                case "Menor":
                    btnChords[i].innerHTML = degree + " " + minorTriadChords[i];
                    switch (minorTriadChords[i]) {
                        case "Mayor":
                            ChordNotes = findMayorScale(degree);
                            break;
                        case "Menor":
                            ChordNotes = findMinorScale(degree);
                            break;
                        case "Semidisminuido":
                            ChordNotes = findDiminishedScale(degree);
                            break;
                    }
                    break;
            }
            btnChords[i].setAttribute("notes", ChordNotes[0] + ", " + ChordNotes[2] + ", " + ChordNotes[4]);
        }
    }
    else {
        for (let i = 0; i < btnChords.length; i++) {
            let degree = btnChords[i].getAttribute("notes").split(",")[0];
            switch (ddlScale) {
                case "Mayor":
                    btnChords[i].innerHTML = degree + " " + majorTetradChords[i];
                    switch (majorTetradChords[i]) {
                        case "Mayor 7":
                            ChordNotes = findMayorScale(degree);
                            break;
                        case "7":
                            ChordNotes = findMayorScale(degree);
                            break;
                        case "Menor 7":
                            ChordNotes = findMinorScale(degree);
                            break;
                        case "Disminuido":
                            ChordNotes = findDiminishedScale(degree);
                            break;
                    }
                    break;
                case "Menor":
                    btnChords[i].innerHTML = degree + " " + minorTetradChords[i];
                    switch (minorTetradChords[i]) {
                        case "Mayor 7":
                            ChordNotes = findMayorScale(degree);
                            break;
                        case "7":
                            ChordNotes = findMayorScale(degree);
                            break;
                        case "Menor 7":
                            ChordNotes = findMinorScale(degree);
                            break;
                        case "Disminuido":
                            ChordNotes = findDiminishedScale(degree);
                            break;
                    }
                    break;
            }
            btnChords[i].setAttribute("notes", ChordNotes[0] + ", " + ChordNotes[2] + ", " + ChordNotes[4] + ", " + ChordNotes[6]);
        }
    }
}

function onClickChord(e) {
    let notes = e.getAttribute("Notes").split(",");
    let ChordNotes = notes.map(function (i) {
        return i + "3";
    });

    //Reproducir el sonido
    sampler.triggerAttackRelease(ChordNotes, 1.5);
}
/*--------------------------------------------------------------------------------*/