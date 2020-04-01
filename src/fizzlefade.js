const DEBUG = false;

const canvas = document.getElementById("drawing-area-naive");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#52ff56";

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators 
function createBinaryString(nMask) {
    // nMask must be between -2147483648 and 2147483647
    if (nMask > 2 ** 31 - 1)
        throw "number too large. number shouldn't be > 2**31-1"; //added
    if (nMask < -1 * (2 ** 31))
        throw "number too far negative, number shouldn't be < 2**31" //added
    for (var nFlag = 0, nShifted = nMask, sMask = ''; nFlag < 32;
        nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
    sMask = sMask.replace(/\B(?=(.{8})+(?!.))/g, " ") // added
    return sMask;
}

function debugLog(numbers) {
    if (!DEBUG) {
        return;
    }
    numbers.forEach(number => {
        console.log(number, createBinaryString(number));
    });
}

function sleep(ms) {
    return new Promise(resolve => {setTimeout(resolve, ms)});
}

function convertToPoint(number) {
    return {
        x: number & 0xFF, 
        y: ((number & 0xFF00) >> 8)
    };
}

function drawPoint(context, x, y) {
    context.fillRect(x, y, 1, 1);
}

async function drawFizzleNaive() {
    for (let i = 0; i < 10000; ++i) {
        await sleep(1);
        drawPoint(ctx, Math.floor((Math.random() * canvas.width)), Math.floor((Math.random() * canvas.height)));
    }
}

drawFizzleNaive();

const canvasLfsr = document.getElementById("drawing-area-lfsr");
const ctxLfsr = canvasLfsr.getContext("2d");
ctxLfsr.fillStyle = "#52ff56";

async function drawFizzleLsfr() {
    const numbers = [];
    let generator = 1;
    do {
        // 4 bits
        // x^4 + x^3 + 1
        // period 15 (15 unique numbers)
        // const bit = ((generator >> 0) ^ (generator >> 1));
        // generator = (((bit << 3) | (generator >> 1)) & 0xF);

        // 16 bits
        // x^16 + x^15 + x^13 + x^4 + 1
        // period 65,535 (65,535 unique numbers)
        const bit = ((generator >> 0) ^ (generator >> 1) ^ (generator >> 3) ^ (generator >> 12));
        generator = (((bit << 15) | (generator >> 1)) & 0xFFFF);

        const {x, y} = convertToPoint(generator);
        await sleep(1);
        drawPoint(ctxLfsr, x, y);

        numbers.push(generator);
    } while (generator != 1)

    console.log(numbers.sort((a, b) => a - b));
    debugLog(numbers);
}

drawFizzleLsfr();
