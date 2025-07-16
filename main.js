// Get input element
const input = document.getElementById('input');

// Create AudioContext and audio nodes
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioCtx.createGain();
const oscillator = audioCtx.createOscillator();

oscillator.type = "sine";
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
gainNode.gain.value = 0; // Start silent
oscillator.start();

// Map of note names to frequencies
const notenames = new Map();
notenames.set("C", 261.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2);
notenames.set("G", 392.0);
notenames.set("A", 440.0);
notenames.set("B", 493.9);

// Play sound at a given pitch
function frequency(pitch) {
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1); // Silence after 1s
}

// Handle button click
function handle() {
    audioCtx.resume(); // Unlock AudioContext
    let userInput = String(input.value).toUpperCase();

    let pitch = notenames.get(userInput); // Try note name
    if (!pitch) {
        pitch = parseFloat(userInput); // Try numeric frequency
    }

    if (pitch && !isNaN(pitch)) {
        frequency(pitch);
    } else {
        alert("Please enter a valid note (A-G) or frequency in Hz!");
    }
}
