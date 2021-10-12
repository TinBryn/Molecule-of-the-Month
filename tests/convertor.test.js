const { readFileSync } = require('fs');
const pdbConverter = require('../conversion/pdbtomoleculeconverter.js');
const gltfConverter = require('../conversion/moleculetogltfconverter.js');

test('Test pdbtogltfconverter for CdTe.pdb', () => {
    const pdbString = readFileSync('./static/examples/CdTe.pdb', 'utf8');
    const atomData = pdbConverter.parsePdbString(pdbString);
    expect(atomData.length).not.toBe(0);
});

test('Test pdbtogltfconverter for 2bpz.pdb', () => {
    const pdbString = readFileSync('./static/examples/2bpz.pdb', 'utf8');
    const atomData = pdbConverter.parsePdbString(pdbString);
    expect(atomData.length).not.toBe(0);
});

test('Test pdbtogltfconverter for benzene_unit_cell.pdb', () => {
    const pdbString = readFileSync('./static/examples/benzene_unit_cell.pdb', 'utf8');
    const atomData = pdbConverter.parsePdbString(pdbString);
    expect(atomData.length).not.toBe(0);
});

test('Test pdbtogltfconverter for 3aid.pdb', () => {
    const pdbString = readFileSync('./static/examples/3aid.pdb', 'utf8');
    const atomData = pdbConverter.parsePdbString(pdbString);
    expect(atomData.length).not.toBe(0);
});

test('Test pdbtogltfconverter for HAZGOF10[9].pdb', () => {
    const pdbString = readFileSync('./static/examples/benzene_unit_cell.pdb', 'utf8');
    const atomData = pdbConverter.parsePdbString(pdbString);
    expect(atomData.length).not.toBe(0);
});