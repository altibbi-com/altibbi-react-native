#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const bobPath = path.join(projectRoot, 'node_modules', '.bin', 'react-native-builder-bob');
const bobExists = fs.existsSync(bobPath);

if (bobExists) {
  try {
    execSync(`${bobPath} build`, {
      stdio: 'inherit',
      cwd: projectRoot
    });
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('Skipping prepare: react-native-builder-bob not installed yet');
  process.exit(0);
}



