import fs from 'fs';
import findMarkdown from './findMarkdown.js';

const rootDir = './docs';

findMarkdown(rootDir,delComponents);

function delComponents(dir){
    fs.readFile(dir,'utf-8', (err, content) => {
        if (err) throw err;

        fs.writeFile(dir, content.replace(/\n<global-config \/>\n/g,''), (err) => {
            if (err) throw err;
            console.log(`del components from ${dir}`);
        });
    });
}
