const path = require("path");
const { readFileSync } = require('fs');

module.exports = (app) => {

    /**
     * todo @Cosmo801
     */
    app.get('/api/todo', async(req, res) => {

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

    /**
     * An endpoint for downloading the current molecule model.
     * 
     * @todo This currently sends a static file and is to prevent that behaviour
     *       from being hard coded throughout the rest of the application.
     */
    app.get("/api/molecule", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "molfile", "dna1.gltf"));
    });
}