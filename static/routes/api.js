const path = require("path");
const {
    readFileSync
} = require('fs');

function configureApiRoutes(app) {
    app.get('/api/todo', async (req, res) => {

        const pdbConverter = require('./conversion/pdbtomoleculeconverter.js');
        const gltfConverter = require('./conversion/moleculetogltfconverter.js');
        //Fetch PDB from database string in the future
        let pdbPath = path.join(__dirname, "..", `/examples/${process.env.MOLECULEPDB}`);
        let outputPath = path.join(__dirname, "..", `/molfile/molecule.gltf`);
        let pdbString = readFileSync(pdbPath, 'utf8');
        let atomData = pdbConverter.parsePdbString(pdbString);
        //GLTF file is generated per request so pretty costly
        //Need to wait for the getBallAndStick function to return before sending
        let gltfFile = await gltfConverter.getBallAndStick(atomData);
        res.send(gltfFile);
    });

    app.get("/api/molecule", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "molfile", "molecule.gltf"));
    });

    app.get("/api/molecule_ar", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "molfile", "dna1.usdz"));
    });
}

module.exports = (app) => {
    configureApiRoutes(app);
}
