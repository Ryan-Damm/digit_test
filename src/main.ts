import './style.css';
import { forwardPass, type Model } from "./model.ts"

loadModel();

const canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const clearButton = document.getElementById("clearButton")!;
const prediction = document.getElementById("prediction")!;
const predictionButton = document.getElementById("predictionButton")!;

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

predictionButton.addEventListener("click", () => {
	predict();

	prediction.textContent = "Predictions";
})

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

function drawNetwork(cache: Record<string, number[][]>) {
    const networkCanvas = document.getElementById("networkCanvas") as HTMLCanvasElement;
    const ctx = networkCanvas.getContext("2d")!;

    ctx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);

    const layers = [
        { name: "Input", key: "A0", x: 100 },
        { name: "Hidden 1", key: "A1", x: 330 },
        { name: "Hidden 2", key: "A2", x: 550 },
        { name: "Output", key: "A3", x: 780 }
    ];

    layers.forEach(layer => {
        const activations = cache[layer.key].map(row => row[0]);

        const maxActivation = Math.max(...activations, 0.000001);

        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(layer.name, layer.x, 25);

        activations.forEach((activation, index) => {
            let x: number;
            let y: number;

            if (layer.key === "A0") {
                // Arrange input neurons as a 28x28 grid.
                x = layer.x - 56 + (index % 28) * 4;
                y = 55 + Math.floor(index / 28) * 4;
            } else {
                x = layer.x;
                y = 55 + (index / Math.max(activations.length - 1, 1)) * 220;
            }

            const intensity = Math.min(activation / maxActivation, 1);

            ctx.beginPath();
            ctx.arc(x, y, layer.key === "A0" ? 1.8 : 3, 0, Math.PI * 2);

            ctx.fillStyle = `rgba(70, 170, 255, ${0.1 + intensity * 0.9})`;
            ctx.fill();
        });
    });
}

function displayPredictions(output: number[][]) {
    const container = document.getElementById("probabilities")!;

    container.innerHTML = "";

    output.forEach((row, digit) => {
        const probability = row[0];

        const percentage = probability * 100;

        const element = document.createElement("div");
        element.className = "probability-row";

        element.innerHTML = `
            <span>${digit}</span>
            <div class="probability-track">
                <div class="probability-bar"
                     style="width: ${percentage}%">
                </div>
            </div>
            <span>${percentage.toFixed(1)}%</span>
        `;

        container.appendChild(element);
    });
}

let model: Model;

async function loadModel() {
    const response = await fetch("/models/model.json");
    model = await response.json();
}

function predict() {
    if (!model) return;

    const input = getDigitInput();

    const { cache, a } = forwardPass(input, model);

    drawNetwork(cache);
    displayPredictions(a);
}