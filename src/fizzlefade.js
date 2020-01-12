const canvas = document.getElementById("drawing-area");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#52ff56";

function drawPoint(x, y) {
    ctx.fillRect(x, y, 1, 1);
}

for (let i = 0; i < 10000; ++i) {
    drawPoint(Math.floor((Math.random() * canvas.width)), Math.floor((Math.random() * canvas.height)));
}

