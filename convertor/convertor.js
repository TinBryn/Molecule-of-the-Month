//Convertors
const parsePdb = require('parse-pdb');

function parsePdbFile(fileString) {

    console.log('Hello from convertor');
    const parsed = parsePdb(fileString);
    console.log(parsed.atoms);
}

exports.parsePdbFile = parsePdbFile;

//Get string of molecule data
//Do we know the format already??


