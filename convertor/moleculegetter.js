const enviroment = require('dotenv');
enviroment.config();

const fs = require('fs').promises;

//Get molecule from API
async function getMoleculeData() {

}

//Debug get molecule
async function getMoleculeDataDebug() {

    const moleculeFileName = 'benzene_unit_cell.pdb';
    const data = await fs.readFile(`convertor/debug/${moleculeFileName}`);
    return data.toString();
}

if(process.env.DEVELOPMENT_ENVIRONMENT == 'develop') exports.getMoleculeOfTheMonth = getMoleculeDataDebug;
else exports.getMoleculeOfTheMonth = getMoleculeDataDebug;
