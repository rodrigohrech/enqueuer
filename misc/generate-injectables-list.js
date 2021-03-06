#!/usr/bin/env node

var fs = require('fs');

files = [];
function findEveryTsFile(path) {
    const dirContent = fs.readdirSync(path);
    for (var i = 0; i < dirContent.length; i++) {
        const filename = path + dirContent[i];
        const stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            files.concat(findEveryTsFile(filename + '/'));
        } else if (filename.endsWith('.ts')) {
            files.push(filename);
        }
    }
    return files;
}
//    0               1                                2                                 3
// node     scripts/generate-injectables-list.js       src/injectable-files-list.ts      src

//Stores current directory
injectableFileName = process.argv[2];
srcFolder = process.argv[3] + '/';

console.log('injectableFileName: ' + injectableFileName);
console.log('srcFolder: ' + srcFolder);

//Finds every .ts file
typescriptFiles = findEveryTsFile(srcFolder);

//Checks if file has "@Injectable" decorator
injectableCode = typescriptFiles.filter(function (filename) {
                                    return filename.indexOf('test') === -1;
                                }).filter(function (filename) {
                                    return fs.readFileSync(filename).indexOf('@Injectable') >= 0;
                                }).map(function (filename) {
                                    var code = 'try {\n  ';
                                    code += 'require(\'' + filename;
                                    code += '\n} catch (err) {\n  /* do nothing*/\n}';
                                    return code.replace('src', '.').replace('.ts', '\');');
                                }).join('\n');


autogeneratedCode = '//Auto-Generated Code\n' + injectableCode;
fs.writeFileSync(injectableFileName, autogeneratedCode);
