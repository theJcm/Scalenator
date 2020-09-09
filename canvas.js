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

//Acordes Mayor
let majorChords = ["Mayor", "Menor", "Menor", "Mayor", "Mayor", "Menor", "Semidisminuido"];

//Acordes Menor
let minorChords = ["Menor", "Semidisminuido", "Mayor", "Menor", "Menor", "Mayor", "Mayor"];
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
    width: null,
    height: null,
    selection: false,
});

//Dispositivo
let device;
window.innerWidth < window.innerHeight ? device = 'mobile' : device = "desktop";

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
        // console.log(element);

        let alert = document.getElementById("alert");
        alert.innerText = element.name;

        element.set('fill', `rgb(0,255,255)`);
    });
};

function resizeCanvas() {
    // Haven't resized in 100ms!

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

    // dpi = window.devicePixelRatio;   

    canvasFabric.setWidth(availableWidth);
    canvasFabric.setHeight(availableHeight);

    canvas.style.width = availableWidth;
    canvas.style.height = availableHeight;

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
    let freetColumns;
    let freetRows;
    let ddlInstrument = document.getElementById('ddlInstrument').value;
    let ddlTuning = document.getElementById('ddlTuning').value;
    let stateFuelle = document.getElementById('fuelle').getAttribute('state');
    console.log("Estado " + stateFuelle);
    let notes;

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
        case "Bajo quinto":
            notes = [
                ["F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D"],
                ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A"],
                ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E"],
                ["D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
                ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#"]];
            freetColumns = 22;
            freetRows = 5;
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
            freetColumns = 11;
            freetRows = 3;

            //Mostrar fuelle
            let divFuelle = document.getElementById("divFuelle");
            divFuelle.style.display = "block";
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

    console.log(`Device: ${device}`)

    // Freet parametros para dibujar canvas
    let freetLabel = availableHeight / 14;
    let freetStroke = 1;

    // Parametros de posicion
    let freetLeft = 0;
    let freetTop = freetLabel - freetStroke;

    // Parametros de dimension
    let freetWidth = (innerWidth - freetStroke) / freetColumns;
    let freetHeight = ((availableHeight - freetLabel) - (availableHeight / 3)) / freetRows;

    if (device == 'mobile') {
        freetWidth = innerWidth / 8;
        freetHeight = 40;

        canvasFabric.setWidth((innerWidth / 8) * freetColumns + freetStroke);
        canvasFabric.setHeight(freetHeight * freetRows + freetLabel)

        document.getElementsByClassName('canvas-container')[0].style.width = availableWidth + "px";

        console.log((innerWidth / 8) * freetRows)
    }

    // Setting for desktop
    // Set size of canvas to fit content
    let canvasFitWidth = innerWidth
    let canvasFitHeight = freetHeight * freetRows + freetLabel

    if (device == 'desktop') {
        canvasFabric.setWidth(canvasFitWidth);
        canvasFabric.setHeight(canvasFitHeight)
    }


    for (i = 0; i < freetColumns; i++) {
        let circle = new fabric.Circle({
            left: freetLeft,
            top: 0,
            radius: 12,
            fill: '#0069ff',
            width: freetWidth,
            height: freetLabel,
            // centeredScaling: true,
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
            fill: '#fff',
            // centeredScaling: true,
            evented: false,
            selectable: false,
            width: freetWidth,
            height: freetLabel,
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
                strokeWidth: freetStroke,

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

        let freetLine = new fabric.Line([0, 0, 0, canvasFitHeight], {
            left: freetLeft,
            top: freetLabel,
            stroke: "#66aaff",
            strokeWidth: 3,
            selectable: false,
            selection: false,
            objectCaching: false,
        });

        canvasFabric.add(freetLine);

        freetLeft += freetWidth;
        freetTop = freetLabel - freetStroke;
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

    //Limpiar acordes
    let chordContainer = document.getElementById("chordContainer");
    while (chordContainer.firstChild) {
        chordContainer.removeChild(chordContainer.firstChild);
    }

    //Generar acordes de la tonalidad
    for (let i in ScaleNotes) {
        //let chordContainer = document.getElementById("chordContainer");
        let liElement = document.createElement("li");
        let buttonElement = document.createElement("button");
        switch (ddlScale) {
            case "Mayor":
                buttonElement.innerHTML = ScaleNotes[i] + " " + majorChords[i];
                break;
            case "Menor":
                buttonElement.innerHTML = ScaleNotes[i] + " " + minorChords[i];
                break;
        }
        liElement.appendChild(buttonElement);
        chordContainer.appendChild(liElement);
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
    /*let ddlScale = document.getElementById('ddlScale');
    ddlScale.options[0].selected = true;
    let ddlKey = document.getElementById('ddlKey');
    ddlKey.options[0].selected = true;*/
}
function onChangeDdlTuning(ddl) {
    canvasFabric.clear();
    setFretboard();
    canvasFabric.requestRenderAll();

    //Limpiar todo
    clearAll();
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

function onChangeRadChordType(rad){
    let radSelected = rad.innerHTML;
    console.log(radSelected);
    /*if(radSelected == "Triada"){
        console.log("Triada");
    }
    else{
        console.log("Cuatriada");
    }*/
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