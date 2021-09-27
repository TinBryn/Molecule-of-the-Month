
function getBallAndStick(moleculeObj) {
    let nodeArray = new Array();
    for(atom of moleculeObj.atoms) {
        const atomElement = atom['element'];
        const atomObj = {
            name: atom['name'],
            translation: [atom['x'], atom['y'], atom['z']]
        };
        nodeArray.push(atomObj);
    }

    console.log(nodeArray.length);
    let gltfObj = {
        asset: {version: "2.0"},
        nodes: nodeArray,
        scenes: [{name: "molecule", nodes: [0]}],
        scene: 0,
    };
    console.log(JSON.stringify(gltfObj));
}


exports.getBallAndStick = getBallAndStick;
