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

  const colourMap =  new Map();
  colourMap.set('H', 'white');
  colourMap.set('C', 'black');
  colourMap.set('O', 'blue');
  colourMap.set('N', 'red');
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

  return colourMap;
}

function getBallAndStick(moleculeObj, outputPath) {

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

      let colour = 'pink';
      if(colourMap.has(atom['element'])) colour = colourMap.get(atom['element']);
      
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
      atomRender.position.x = atom['x'] * 100;
      atomRender.position.y = atom['y'] * 100;
      atomRender.position.z = atom['z'] * 100;
      scene.add(atomRender);
  }
  
  loader.parse(scene, (content) => {
    fs = require('fs');
    fs.writeFile(outputPath, JSON.stringify(content), function (err) {
      if (err) return console.log(err);
    }); 
  },);
}


exports.getBallAndStick = getBallAndStick;
