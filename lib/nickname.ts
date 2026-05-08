const ADJECTIVES = [
  "Tired",
  "Burnt",
  "Sad",
  "Quiet",
  "Broken",
  "Midnight",
  "Cold",
  "Slack",
  "Soft",
  "Unsent",
];

const NOUNS = [
  "Pigeon",
  "Toast",
  "Spreadsheet",
  "Goblin",
  "Printer",
  "Raccoon",
  "Pizza",
  "Ghost",
  "Receipt",
  "Signal",
];

export function createNickname() {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adjective} ${noun}`;
}
