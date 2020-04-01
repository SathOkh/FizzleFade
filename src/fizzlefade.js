const DEBUG = false;

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

function convertToPoint(number) {
    return {
        x: number & 0xFF, 
        y: ((number & 0xFF00) >> 8)
    };
}

function drawPoint(context, x, y) {
    context.fillRect(x, y, 1, 1);
}


const canvas = document.getElementById("drawing-area-naive");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#52ff56";

function *drawFizzleNaive() {
    for (let i = 0; i < 10000; ++i) {
        yield {
            x: Math.floor((Math.random() * canvas.width)), 
            y: Math.floor((Math.random() * canvas.height))
        };
    }
}
const fizzleNaiveIterator = drawFizzleNaive();
const fizzleNaiveUpdater = setInterval(
    () => {
        const {value, done} = fizzleNaiveIterator.next();

        if (done) {
            clearTimeout(fizzleNaiveUpdater);
            return;
        }

        drawPoint(ctx, value.x, value.y);
    },
    1
);

const canvasLfsr = document.getElementById("drawing-area-lfsr");
const ctxLfsr = canvasLfsr.getContext("2d");
ctxLfsr.fillStyle = "#afafaf";

function *drawFizzleLsfr() {
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

        yield convertToPoint(generator);
    } while (generator != 1)

}

const fizzleLsfrIterator = drawFizzleLsfr();
const fizzleLsfrUpdater = setInterval(
    () => {
        const {value, done} = fizzleLsfrIterator.next();

        if (done) {
            clearTimeout(fizzleLsfrUpdater);
            return;
        }

        drawPoint(ctxLfsr, value.x, value.y);
    },
    1
);

// numbers.push(generator);
// console.log(numbers.sort((a, b) => a - b));
// debugLog(numbers);

const canvasGalois = document.getElementById("drawing-area-galois");
const ctxGalois = canvasGalois.getContext("2d");
ctxGalois.fillStyle = "#ff00ff";

function *drawFizzleGalois() {
    let generator = 1;
    do {
        // 16 bits
        // x^16 + x^15 + x^13 + x^4 + 1
        // period 65,535 (65,535 unique numbers)
        const bit = (generator & 1) && 0xFFFF;
        generator = generator >> 1;
        if (bit) {
            // bits on "taps" "flips" if last bit was 1
            generator = (generator ^ 0xB400) & 0xFFFF;
        }

        yield convertToPoint(generator);
    } while (generator != 1)

}

const fizzleGaloisIterator = drawFizzleGalois();
const fizzleGaloisUpdater = setInterval(
    () => {
        const {value, done} = fizzleGaloisIterator.next();

        if (done) {
            clearTimeout(fizzleGaloisUpdater);
            return;
        }

        drawPoint(ctxGalois, value.x, value.y);
    },
    1
);

