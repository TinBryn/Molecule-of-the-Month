//Convertors
const parsePdb = require('parse-pdb');

function parsePdbFile(fileString) {

    const parsed = parsePdb(fileString);
    console.log(parsed);
}

exports.parsePdbFile = parsePdbFile;


