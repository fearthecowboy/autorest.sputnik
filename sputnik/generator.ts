/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Host, startSession, Session } from '@azure-tools/autorest-extension-base';
import { codeModelSchema, CodeModel, Language, ObjectSchema } from '@azure-tools/codemodel';
import { values } from '@azure-tools/linq';


export async function generator(host: Host) {
  const debug = await host.GetValue('debug') || false;

  try {
    // get the code model from the core
    const session = await startSession<CodeModel>(host, undefined, codeModelSchema, 'code-model-v4');

    // if you need to use configuration values (ie, --foo)
    const foo = await session.getValue('foo', null);

    // example: do something here.
    let text = 'A source file\n';


    for (const group of values(session.model.operationGroups)) {
      for (const operation of values(group.operations)) {
        for (const request of values(operation.requests)) {
          if (request.protocol.http?.method === 'put') {

            console.error(request.protocol.http);
            const schema = <ObjectSchema>request?.parameters?.[0].schema;
            for (const parent of values(schema.parents?.all)) {
              // parent is one of the parent schemas
              // parent.language.default.name
            }
            console.error(schema.properties);
          }

        }
      }
    }

    for (const each of values(session.model.schemas.objects)) {
      text = text + `schema: ${each.language.sputnik?.name}\n`;
    }

    // example: output a generated text file
    host.WriteFile('sputnik-sample.txt', text, undefined, 'source-file-sputnik');

  } catch (E) {
    if (debug) {
      console.error(`${__filename} - FAILURE  ${JSON.stringify(E)} ${E.stack}`);
    }
    throw E;
  }
}
