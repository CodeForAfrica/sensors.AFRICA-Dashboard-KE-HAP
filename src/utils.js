export default function getRandomColor() {
  // generates a random hex color  '0xFFFFFF<<0' padds the generated number with zeros
  return `#${((Math.random() * 0xffffff) << 0).toString(16)}`; // eslint-disable-line no-bitwise
}
