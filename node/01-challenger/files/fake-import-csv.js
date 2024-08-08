import fs from 'node:fs/promises';
import { parse } from 'csv-parse';
const filePath = new URL('../tasks.csv', import.meta.url).pathname;

(async () => {
    const fileData = await fs.readFile(filePath);
    let header = null;

    for await (const line of parse(fileData)) {
        if (!header) {
            header = line;
        } else {
            const body = header.reduce((body, key, index) => {
                body[key] = line[index];

                return body;
            }, {});

            await fetch('http://localhost:3333/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            })
        }
    }
})();