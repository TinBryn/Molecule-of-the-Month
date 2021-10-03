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

function getBallAndStick(moleculeObj) {

    const loader = new exporter();
    const scene = new THREE.Scene();
    const fov = 75;

    const camera = new THREE.PerspectiveCamera( 50, 0.5 * 2, 1, 10000 );
    camera.position.z = 2500;

    const baseSphere = new THREE.Sphere();
    const baseMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

    for(atom of moleculeObj.atoms) {
      const geometry = new THREE.SphereGeometry( 15, 32, 16 );
      const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
      const atomRender = new THREE.Mesh( geometry, material );
      atomRender.x = atom['x'];
      atomRender.y = atom['y'];
      atomRender.z = atom['z'];
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
