const path = require("path");
const { readFileSync } = require('fs');
const enviroment = require("dotenv");

/**
 * An endpoint for downloading the current molecule model.
 * 
 * @todo This currently sends a static file and is to prevent that behaviour
 *       from being hard coded throughout the rest of the application.
 * 
 * @param {Request} request
 * @param {Response} response
 */
const molecule = async (request, response) => {
    const gltfFile = await getMoleculeOfTheMonth();
    response.send(gltfFile);
};

module.exports = {
    molecule: molecule,
}

async function debugGetMoleculeOfTheMonth() {
    const pdbConverter = require('../../conversion/pdbtomoleculeconverter.js');
    const gltfConverter = require('../../conversion/moleculetogltfconverter.js');
    //Fetch PDB from database string in the future
    let pdbPath = path.join(__dirname, "..", `/examples/${process.env.MOLECULEPDB}`);
    const moleculeScale = process.env.MOLECULESCALE;
    let outputPath = path.join(__dirname, "..", `/molfile/molecule.gltf`);
    let pdbString = readFileSync(pdbPath, 'utf8');
    let atomData = pdbConverter.parsePdbString(pdbString);
    //GLTF file is generated per request so pretty costly
    //Need to wait for the getBallAndStick function to return before sending
    let gltfFile = await gltfConverter.getBallAndStick(atomData, moleculeScale);
    return gltfFile;
}

//Fetch from database
async function getMoleculeOfTheMonth() {

    const environment = process.env.DEVELOPMENT_ENVIRONMENT;
    if (environment == 'develop') {
        return await debugGetMoleculeOfTheMonth();
    }
}

module.exports = {
    molecule: molecule,
}
