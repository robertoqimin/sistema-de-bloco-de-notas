const fs = require('fs');
const path = require('path');

let loaded = false;

function parseEnvLine(line) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith('#')) {
    return null;
  }

  const separatorIndex = trimmed.indexOf('=');

  if (separatorIndex === -1) {
    return null;
  }

  const key = trimmed.slice(0, separatorIndex).trim();
  let value = trimmed.slice(separatorIndex + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

function loadEnv() {
  if (loaded) {
    return;
  }

  const envPath = path.join(__dirname, '.env');

  if (!fs.existsSync(envPath)) {
    loaded = true;
    return;
  }

  const fileContent = fs.readFileSync(envPath, 'utf8');

  for (const line of fileContent.split(/\r?\n/)) {
    const parsed = parseEnvLine(line);

    if (!parsed || process.env[parsed.key] !== undefined) {
      continue;
    }

    process.env[parsed.key] = parsed.value;
  }

  loaded = true;
}

loadEnv();

module.exports = loadEnv;
