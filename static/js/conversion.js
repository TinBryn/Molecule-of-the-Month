// takes pdb files and creates a 3D model of them

// const ParsePdb = require("parse-pdb");
const FileSystem = require("fs");

const file = "2bpz.pdb";
const data = FileSystem.ReadFile(`static/examples/${file}`, function(data, err) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
        return data;
    }
});

console.log("hello");