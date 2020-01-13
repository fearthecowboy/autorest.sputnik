const { readdirSync: readdir } = require('fs')
const { resolve, basename } = require('path')
const { promisify } = require('util');
const { execute, get, sleep } = require('./process');
const request = promisify(require('http').request);

$root = resolve(`${__dirname}/..`);
$modules = resolve(`${$root}/sputnik/node_modules`);
$generated = resolve(`${$root}/generated/`)
$bin = resolve(`${$modules}/.bin`);

async function main() {
  try {

    const files = (await get('http://localhost:3000/__files/files.txt')).trim().replace(/\r\n/g, '\n').split('\n');
    for (const each of files) {

      if ([
        'azure-composite-swagger.json',
        'body-formdata.json',
        'composite-swagger.json',
        'composite-swagger.quirks.json',
        'lro.json',
      ].indexOf(each) > -1) {
        continue;
      }

      const name = basename(each, '.json');

      console.log(`Processing: ${name}`)
      const r = await execute(`autorest-beta`, [
        `--use:${$root}`,
        `--license-header:MICROSOFT_MIT`,
        `--input-file:http://localhost:3000/__files/${each}`,
        '--debug',
        '--verbose',
        '--use:c:/work/2019/autorest.megarepo/modelerfour/modelerfour',
        `--title:${name}Client`,
        `--output-folder:${$generated}/${name}`,
        `--output-artifact:code-model-v4`,
      ]);
      console.log(r.stdout);
      if (r.error) {
        console.log(r.stdout);
        console.log(r.stderr);
        //  await execute(`${$bin}/stop-autorest-testserver`);
        process.exit(1);
      }
    }
  } finally {
    // await execute(`${$bin}/stop-autorest-testserver`);
  }
}
main();

