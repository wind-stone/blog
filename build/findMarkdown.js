import fs from 'fs';

export default function findMarkdown(dir, callback) {
    fs.readdir(dir, function (err, files) {
        if (err) throw err;

        files.forEach((fileName) => {
            let innerDir = `${dir}/${fileName}`;

            if (fileName.indexOf('.') !== 0) {
                fs.stat(innerDir, function (err, stat) {

                    if (stat.isDirectory()) {
                        findMarkdown(innerDir, callback);
                    } else if (innerDir.indexOf('.md') > 0) {
                        callback(innerDir);
                    }
                });
            }

        });
    });
}
