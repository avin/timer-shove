const audioCtx = new window.AudioContext();

export const playSound = (frequency: number, type: OscillatorType, x: number, volume = 1): void => {
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g);
  o.type = type;
  g.connect(audioCtx.destination);
  o.frequency.value = frequency;
  o.start();
  g.gain.value = volume;
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + x);

  setTimeout(() => {
    o.stop();
    o.disconnect();
  }, (x + 0.5) * 1000);
}
