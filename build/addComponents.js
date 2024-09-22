import fs from 'fs';
import findMarkdown from './findMarkdown.js';

const rootDir = './docs';

findMarkdown(rootDir, writeComponents);

function writeComponents(dir) {
    fs.appendFile(dir, '\n<global-config />\n', (err) => {
        if (err) throw err;
        console.log(`add components to ${dir}`);
    });
}
