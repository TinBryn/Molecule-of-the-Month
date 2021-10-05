const THREE = require('three');
const Canvas = require('canvas');
const exporter = require('three-gltf-exporter');
const { Blob, FileReader } = require('vblob');

// Patch global scope to imitate browser environment.
// From https://gist.github.com/donmccurdy/9f094575c1f1a48a2ddda513898f6496
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

function getColourMap(atoms) {

  //Load from config
  let colourIndex = 0;
  //X11 colour names
  const availableColours = ['skyblue', 'crimson', 'gray'];

  const colourMap =  new Map();
  //Load molecule data
  for(atom of atoms) {
    const atomName = atom['element'];
    const colour = availableColours[colourIndex];

    if(atomName in colourMap) continue;
    const material = new THREE.MeshLambertMaterial();
    colourMap.set(atomName, new THREE.MeshLambertMaterial(
      {
        color: 'crimson'
      }));
    colourIndex += 1;
  }
  return colourMap;
}

function getBallAndStick(moleculeObj) {

  const colourMap = getColourMap(moleculeObj.atoms);
  console.log(colourMap);

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

  const scene = new THREE.Scene();
  scene.add(camera);


  const RADIUS = 50;
  const SEGMENTS = 16;
  const RINGS = 16;

  const sphereMaterial =
  new THREE.MeshLambertMaterial(
    {
      color: 0xCC0000
    });

    for(atom of moleculeObj.atoms) {

      const material = colourMap.get(atom['element']);
      const atomRender = new THREE.Mesh(
        new THREE.SphereGeometry(
            RADIUS,
            SEGMENTS,
            RINGS),
        
        material);
      
      //*100 just to scale further apart
      atomRender.position.x = atom['x'] * 100;
      atomRender.position.y = atom['y'] * 100;
      atomRender.position.z = atom['z'] * 100;
      scene.add(atomRender);
  }
  
  loader.parse(scene, (content) => {
    fs = require('fs');
    fs.writeFile('test.gltf', JSON.stringify(content), function (err) {
      if (err) return console.log(err);
    }); 
  },);
}


exports.getBallAndStick = getBallAndStick;
