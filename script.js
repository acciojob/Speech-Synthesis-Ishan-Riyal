// Your script here.
// DOM elements
const textInput = document.getElementById("text");
const voiceSelect = document.getElementById("voiceSelect");
const rate = document.getElementById("rate");
const pitch = document.getElementById("pitch");
const rateValue = document.getElementById("rateValue");
const pitchValue = document.getElementById("pitchValue");
const speakButton = document.getElementById("speak");
const stopButton = document.getElementById("stop");

let voices = [];
const synth = window.speechSynthesis;
let utterance = new SpeechSynthesisUtterance();

// Populate voice options
function populateVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = "";

  if (voices.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No voices available";
    option.disabled = true;
    voiceSelect.appendChild(option);
    return;
  }

  voices.forEach((voice, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${voice.name} (${voice.lang})${
      voice.default ? " — DEFAULT" : ""
    }`;
    voiceSelect.appendChild(option);
  });
}

// Initial population and re-population on voice list change (for some browsers)
populateVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoices;
}

// Set voice, rate, pitch when speaking
function speak() {
  if (synth.speaking) {
    synth.cancel(); // stop current speech before starting new
  }

  const text = textInput.value.trim();
  if (!text) return alert("Please enter some text.");

  utterance = new SpeechSynthesisUtterance(text);
  const selectedVoiceIndex = voiceSelect.value;
  if (voices[selectedVoiceIndex]) {
    utterance.voice = voices[selectedVoiceIndex];
  }

  utterance.rate = parseFloat(rate.value);
  utterance.pitch = parseFloat(pitch.value);

  synth.speak(utterance);
}

// Stop speech immediately
function stop() {
  synth.cancel();
}

// Update rate and pitch display
rate.addEventListener("input", () => {
  rateValue.textContent = rate.value;
});
pitch.addEventListener("input", () => {
  pitchValue.textContent = pitch.value;
});

// Restart speech on voice change
voiceSelect.addEventListener("change", () => {
  if (synth.speaking) {
    speak(); // restart speech with new voice
  }
});

// Button event listeners
speakButton.addEventListener("click", speak);
stopButton.addEventListener("click", stop);
