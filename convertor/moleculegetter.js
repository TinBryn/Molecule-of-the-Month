const enviroment = require('dotenv');
enviroment.config();

const fileSystem = require('fs');

//Get molecule from API
function getMoleculeData() {

}

//Debug get molecule
function getMoleculeDataDebug() {

    const moleculeFileName = '2bpz.pdb';
    fileSystem.readFile(`convertor/debug/${moleculeFileName}`, function(err, data){
        if(err) {
            console.log(err);
        }
        else {
            return data.toString();
        }
    });
}

if(process.env.DEVELOPMENT_ENVIRONMENT == 'develop') exports.getMoleculeOfTheMonth = getMoleculeDataDebug;
else exports.getMoleculeOfTheMonth = getMoleculeData;
