const enviroment = require('dotenv');
enviroment.config();

const fs = require('fs').promises;

//Get molecule from API
async function getMoleculeData() {

}

//Debug get molecule
async function getMoleculeDataDebug() {

    const moleculeFileName = 'ZIF8[22].pdb';
    const data = await fs.readFile(`convertor/debug/${moleculeFileName}`, 'utf-8');
    return data.toString();
}

if(process.env.DEVELOPMENT_ENVIRONMENT == 'develop') exports.getMoleculeOfTheMonth = getMoleculeDataDebug;
else exports.getMoleculeOfTheMonth = getMoleculeDataDebug;
