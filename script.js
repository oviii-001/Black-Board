const canvas = document.getElementById('blackboard');
const context = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const eraser = document.getElementById('eraser');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let currentColor = '#ffffff';
let erasing = false;
let eraserMoving = false;
let eraserSize = 20;

const chalkCursor = new Image();
chalkCursor.src = 'chalk.png';

chalkCursor.onload = function() {
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    colorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
        erasing = false;
        updateCursor();
    });

    eraser.addEventListener('mousedown', startEraser);
    eraser.addEventListener('mouseup', stopEraser);
    document.addEventListener('mousemove', moveEraser);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'e' || e.key === 'E') {
            toggleEraser();
        } else if (e.key === 'p' || e.key === 'P') {
            togglePen();
        }
    });
};

function startDrawing(e) {
    if (erasing) return;
    drawing = true;
    draw(e);
}

function stopDrawing() {
    drawing = false;
    context.beginPath();
    updateCursor();
}

function draw(e) {
    if (!drawing) return;
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.strokeStyle = currentColor;

    context.lineTo(e.clientX, e.clientY);
    context.stroke();
    context.beginPath();
    context.moveTo(e.clientX, e.clientY);

    canvas.style.cursor = `url('${chalkCursor.src}'), auto`;
}

function clearBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function startEraser(e) {
    eraserMoving = true;
    moveEraser(e);
}

function stopEraser() {
    eraserMoving = false;
}

function moveEraser(e) {
    if (!eraserMoving) return;
    eraser.style.left = `${e.clientX - eraserSize / 2}px`;
    eraser.style.top = `${e.clientY - eraserSize / 2}px`;

    if (erasing) {
        context.clearRect(e.clientX - eraserSize / 2, e.clientY - eraserSize / 2, eraserSize, eraserSize);
    }
}

function toggleEraser() {
    if (eraser.style.display === 'none') {
        eraser.style.display = 'block';
        erasing = true;
        updateCursor();
    } else {
        eraser.style.display = 'none';
        erasing = false;
        updateCursor();
    }
}

function togglePen() {
    erasing = false;
    eraser.style.display = 'none';
    updateCursor();
}

function updateCursor() {
    if (erasing) {
        canvas.style.cursor = 'crosshair';
    } else {
        canvas.style.cursor = `url('${chalkCursor.src}'), auto`;
    }
}
