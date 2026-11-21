import './style.css';

const canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const clearButton = document.getElementById("clearButton")!;
const prediction = document.getElementById("prediction")!;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.strokeStyle = "white";
ctx.lineWidth = 18;
ctx.lineCap = "round";
ctx.lineJoin = "round";

let drawing = false;

canvas.addEventListener("pointerdown", (e) => {
    drawing = true;
    canvas.setPointerCapture(e.pointerId);

    ctx.beginPath();
    ctx.moveTo(e.offsetX * canvas.width / canvas.clientWidth,
               e.offsetY * canvas.height / canvas.clientHeight);
});

canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;

    ctx.lineTo(e.offsetX * canvas.width / canvas.clientWidth,
               e.offsetY * canvas.height / canvas.clientHeight);

    ctx.stroke();
});

canvas.addEventListener("pointerup", () => {
    drawing = false;
});

canvas.addEventListener("pointercancel", () => {
    drawing = false;
});

clearButton.addEventListener("click", () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    prediction.textContent = "Draw something!";
});