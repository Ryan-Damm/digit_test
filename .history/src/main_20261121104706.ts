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

function getDigitInput(): number[][] {
    const smallCanvas = document.createElement("canvas");
    smallCanvas.width = 28;
    smallCanvas.height = 28;

    const smallCtx = smallCanvas.getContext("2d")!;

    // Resize the drawing to 28x28.
    smallCtx.drawImage(canvas, 0, 0, 28, 28);

    const imageData = smallCtx.getImageData(0, 0, 28, 28);

    const pixels: number[] = [];

    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        const grayscale = (0.2989 * r + 0.587 * g + 0.114 * b) / 255;

        pixels.push(grayscale);
    }

    // Convert 784 values into a 784x1 matrix.
    return pixels.map(value => [value]);
}