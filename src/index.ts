#!/usr/bin/env node

import { Command } from 'commander';
import fetch from 'node-fetch';

const program = new Command('namer');

const msg = {
  exists: (name: string) => `Package "${name}" already exists`,
  none: (name: string) => `Package "${name}" does not exist`,
};

function decide(exists: boolean) {
  if (exists) return msg.exists;
  return msg.none;
}

async function check(name: string) {
  const res = await fetch(`https://npmjs.com/package/${name}`);
  const exists: boolean = res.status !== 404;
  return decide(exists)(name);
}

program.arguments('<name>').action(async (name: string) => {
  const names = JSON.parse('["' + name.split(',').join('","') + '"]');

  for (const n of names) {
    if (!n) continue;
    const message = await check(n);
    console.log(message);
  }
});

program.parse(process.argv);
