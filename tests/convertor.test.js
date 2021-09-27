const { readFileSync } = require('fs');
const convertor = require('../convertor/convertor.js');
const gltfConvertor = require('../convertor/moleculegltfconvertor.js');

test('Test Convertor reads CdTe.pdb atoms', () => {

    const pdbString = readFileSync('./convertor/debug/CdTe.pdb', 'utf8');
    const atomData = convertor.parsePdbString(pdbString);
    expect(atomData.length).not.toBe(0);
});

// test('Test Convertor reads 2bpz.pdb atoms', () => {

//     const pdbString = readFileSync('./convertor/debug/2bpz.pdb', 'utf8');
//     const atomData = convertor.parsePdbString(pdbString);
//     expect(atomData.length).not.toBe(0);
// });

test("Test renderer", () => {
    const pdbString = readFileSync('./convertor/debug/CdTe.pdb', 'utf8');
    const atomData = convertor.parsePdbString(pdbString);
    gltfConvertor.getBallAndStick(atomData);
});
