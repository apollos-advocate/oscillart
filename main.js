// Get input and canvas elements
const input = document.getElementById('input');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
const width = canvas.width = 900;
const height = canvas.height = 500;

// AudioContext setup
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioCtx.createGain();
const oscillator = audioCtx.createOscillator();

oscillator.type = "sine";
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
gainNode.gain.value = 0; // Start silent
oscillator.start();

// Map of note names to frequencies
const notenames = new Map([
    ["C", 261.6],
    ["D", 293.7],
    ["E", 329.6],
    ["F", 349.2],
    ["G", 392.0],
    ["A", 440.0],
    ["B", 493.9]
]);

// Variables for drawing
var amplitude = 40;
var freq = 0;
var x = 0;
var y = height / 2;
var counter = 0;
var interval = null;

// Play sound at a given pitch
function frequency(pitch) {
    freq = pitch / 10000; // Scale frequency for canvas drawing
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1); // Silence after 1s
}

// Start drawing wave
function drawWave() {
    ctx.clearRect(0, 0, width, height); // Clear canvas
    x = 0;
    y = height / 2;
    counter = 0;
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Start interval to draw
    interval = setInterval(line, 20);
}

// Draw a single line segment of the wave
function line() {
    // Calculate next y position
    y = height / 2 + amplitude * Math.sin(x * freq * 2 * Math.PI);
    ctx.lineTo(x, y);
    ctx.stroke();

    x += 1; // Move to next x position
    counter++;

    // Stop after 50 steps
    if (counter > 50) {
        clearInterval(interval);
    }
}

// Handle button press
function handle() {
    audioCtx.resume(); // Unlock AudioContext
    gainNode.gain.value = 0; // Reset gain

    let userInput = String(input.value).toUpperCase();
    let pitch = notenames.get(userInput); // Try note name
    if (!pitch) {
        pitch = parseFloat(userInput); // Try numeric frequency
    }

    if (pitch && !isNaN(pitch)) {
        frequency(pitch); // Play sound
        drawWave();       // Start drawing
    } else {
        alert("Enter a valid note (A-G) or frequency in Hz!");
    }
}
