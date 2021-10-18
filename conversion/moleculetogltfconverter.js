const THREE = require('three');
const Canvas = require('canvas');
const exporter = require('three-gltf-exporter');
const {
  Blob,
  FileReader
} = require('vblob');

/** Patch global scope to imitate browser environment.
 * This is just a hack to get threejs working on the server 
 * From https://gist.github.com/donmccurdy/9f094575c1f1a48a2ddda513898f6496
 */
global.window = global;
global.Blob = Blob;
global.FileReader = FileReader;
global.THREE = THREE;
global.document = {
  createElement: (nodeName) => {
    if (nodeName !== 'canvas') throw new Error(`Cannot create node ${nodeName}`);
    const canvas = new Canvas(256, 256);
    // This isn't working — currently need to avoid toBlob(), so export to embedded .gltf not .glb.
    // canvas.toBlob = function () {
    //   return new Blob([this.toBuffer()]);
    // };
    return canvas;
  }
};

/**
 * 
 * @param {object} atoms 
 *  List of atoms from pdbtomoleculeconverter output
 * @returns {Map} colourMap
 *  Maps an element symbol to a x11 colour
 */
function getColourMap(atoms) {

  const colourMap = new Map();
  colourMap.set('H', 'white');
  colourMap.set('C', 'black');
  colourMap.set('O', 'red');
  colourMap.set('N', 'blue');
  colourMap.set('F', 'green');
  colourMap.set('Cl', 'green');
  colourMap.set('Br', 'darkred');
  colourMap.set('I', 'darkviolet');
  colourMap.set('He', 'cyan');
  colourMap.set('Ne', 'cyan');
  colourMap.set('Ar', 'cyan');
  colourMap.set('Kr', 'cyan');
  colourMap.set('Xe', 'cyan');
  colourMap.set('P', 'orange');
  colourMap.set('S', 'yellow');
  colourMap.set('B', 'beige');
  colourMap.set('Li', 'violet');
  colourMap.set('Na', 'violet');
  colourMap.set('K', 'violet');
  colourMap.set('Rb', 'violet');
  colourMap.set('Cs', 'violet');
  colourMap.set('Fr', 'violet');
  colourMap.set('Be', 'darkgreen');
  colourMap.set('Mg', 'darkgreen');
  colourMap.set('Ca', 'darkgreen');
  colourMap.set('Sr', 'darkgreen');
  colourMap.set('Ba', 'darkgreen');
  colourMap.set('Ra', 'darkgreen');
  colourMap.set('Ti', 'grey');
  colourMap.set('Fe', 'darkorange');
  colourMap.set('Cd', 'peru');
  colourMap.set('Te', 'chocolate');
  colourMap.set('Sc', 'darkgray');

  return colourMap;
}

/**
 * 
 * @param {number} x1 
 * @param {number} x2 
 * @param {number} y1 
 * @param {number} y2 
 * @param {number} z1 
 * @param {number} z2 
 *  For each dimension pass a starting coordinate (e.g. x1) and an ending coordinate (e.g. x2)
 * @returns {THREE.Line}
 */
function getBallAndStickBond(x1, x2, y1, y2, z1, z2) {

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 'black'
  });
  const points = [];
  points.push(new THREE.Vector3(x1, y1, z1));
  points.push(new THREE.Vector3(x2, y2, z2));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, lineMaterial);
  return line;
}

/**
 * 
 * Takes the output of pdbmoleculeconverter.js parsing and uses the three.js api to create as scene to be output as a GLTF file
 * 
 * @param {object} moleculeObj 
 *  Output from pdbtomoleculeconverter.js
 * @param {number} scale 
 *  Scale the coordinate system - Some molecules need different scaling values to be more legible
 *  
 * @returns {Promise}
 *  A promise to returna gltf file string
 */
async function getBallAndStick(moleculeObj, scale=10) {

  const colourMap = getColourMap(moleculeObj.atoms);
  const loader = new exporter();

  const VIEW_ANGLE = 45;
  const NEAR = 0.1;
  const FAR = 10000;

  const camera =
    new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      2,
      NEAR,
      FAR
    );

  let scene = new THREE.Scene();
  scene.add(camera);

  const sphereQuality = getSphereQuality(moleculeObj.atoms.length);
  const RADIUS = sphereQuality[0];
  const SEGMENTS = sphereQuality[1];
  const RINGS = sphereQuality[1];

  for (let i = 0; i < moleculeObj.atoms.length; i++) {

    const atom = moleculeObj.atoms[i];

    let colour = 'pink';
    if (colourMap.has(atom['element'])) colour = colourMap.get(atom['element']);

    const material = new THREE.MeshLambertMaterial({
      color: colour,
    });
    const atomRender = new THREE.Mesh(
      new THREE.SphereGeometry(
        RADIUS,
        SEGMENTS,
        RINGS),
      material);

    //*100 just to scale further apart
    const xPos = atom['x'] * scale;
    const yPos = atom['y'] * scale;
    const zPos = atom['z'] * scale;
    atomRender.position.x = xPos;
    atomRender.position.y = yPos;
    atomRender.position.z = zPos;

    scene.add(atomRender);
  }

  moleculeObj.bonds.forEach((value, key) => {
    const sourceAtom = moleculeObj.atoms[key - 1];
    for (let target of value) {
      const targetAtom = moleculeObj.atoms[target - 1];

      const xPos = sourceAtom['x'] * scale;
      const yPos = sourceAtom['y'] * scale;
      const zPos = sourceAtom['z'] * scale;

      const targetX = targetAtom['x'] * scale;
      const targetY = targetAtom['y'] * scale;
      const targetZ = targetAtom['z'] * scale;
      const line = getBallAndStickBond(xPos, targetX, yPos, targetY, zPos, targetZ);
      scene.add(line);
    }
  });

  return new Promise((resolve, reject) => {
    loader.parse(scene, data => resolve(data), reject);
  });

}

/**
 * 
 * @param {int} numElements 
 * @returns {Array}
 *  Returns array of options for rendering spheres [radius, segments, rings]
 *  Increasing the number of segments increases quality at the cost of performance
 */
function getSphereQuality(numElements) {
  let radius = 5;
  let segments = 15;
  let rings = 1;

  if (numElements > 1000) {
    segments = 10;
  }

  if (numElements > 5000) {
    segments = 1;
  }
  return [radius, segments, rings];
}

exports.getBallAndStick = getBallAndStick;
