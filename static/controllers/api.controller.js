const path = require("path");
const { readFileSync } = require('fs');
const environment = require("dotenv");

/**
 * An endpoint for downloading the current molecule model.
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

/**
 * Generate a GLTF file specified in the .env file
 * MOLECULEPDB - THe name of the pdb file
 *  The pdb file must be located in /static/examples folder
 * MOLECULESCALE
 *  The scale of the molecule
 * 
 * @returns {string}
 *  A gltf file as a string
 */
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

/**
 * Generate a GLTF file for the molecule of the month
 * 
 * @todo Get pdb string from database when its setup
 * @returns {string}
 *  A GLTF file as a string
 */
async function getMoleculeOfTheMonth() {

    const devEnvironment = process.env.DEVELOPMENT_ENVIRONMENT;
    if (devEnvironment == 'develop') {
        return await debugGetMoleculeOfTheMonth();
    }
}

module.exports = {
    molecule: molecule,
}
