//import '../scss/global.scss';
import alfrid, { Camera } from './lib/alfrid';
import SceneApp from './SceneApp';
import AssetsLoader from 'assets-loader';
import dat from 'dat-gui';


window.params = {
    gamma: 1,
    displace: 2,
    exposure: 2.8,
    baseColor: [1, 0.765557, 0.336057],
    baseColorAmount: 1,
    diffuseColorAmount: 0,
    saturation: 1.0,
    ao: 0.2,
    metallic: 0,
    roughness: 1,
    specular: 0,
    offset: 0,
    fov: 45,
    visible: true
};

const GL = alfrid.GL;
const loc = 'loc3/';
const assets = [
    { id: 'diffuse', url: 'assets/final.png' },
    { id: 'albedo', url: 'assets/albedo.png' },
    { id: 'height', url: 'assets/height.jpg' },
    { id: 'ao', url: 'assets/ao.jpg' }, {
        id: 'horizon',
        url: 'assets/mars/mountains/horizon.jpg'
    }, {
        id: 'river_ao',
        url: 'assets/mars/river_ao.jpg'
    }, {
        id: 'heightmap1',
        url: 'assets/terrain/heightmap1.jpg'
    }, {
        id: 'ao1',
        url: 'assets/terrain/ao1.jpg'
    }, {
        id: 'heightmap2',
        url: 'assets/terrain/heightmap2.jpg'
    }, {
        id: 'ao2',
        url: 'assets/terrain/ao2.jpg'
    }, {
        id: 'mountain_top',
        url: 'assets/mars/mountains/mountain_top.jpg'
    }, {
        id: 'mountain_top_ao',
        url: 'assets/mars/mountains/mountain_top_ao.jpg'
    }, {
        id: 'mountain_left',
        url: 'assets/mars/mountains/mountain_left.jpg'
    }, {
        id: 'mountain_left_ao',
        url: 'assets/mars/mountains/mountain_left_ao.jpg'
    }, {
        id: 'mountain_right',
        url: 'assets/mars/mountains/mountain_right.jpg'
    }, {
        id: 'mountain_right_ao',
        url: 'assets/mars/mountains/mountain_right_ao.jpg'
    }, {
        id: 'whole_map_height',
        url: 'assets/mars/mountains/whole_map_height.jpg'
    }, {
        id: 'whole_map_ao',
        url: 'assets/mars/mountains/whole_map_ao.jpg'
    }
];

if (document.body) {
    _init();
} else {
    window.addEventListener('DOMContentLoaded', _init);
}

window.initMap = function() {
    console.log("INIT");
    _init()
}

function _init() {
    //  LOADING ASSETS
    if (assets.length > 0) {
        document.body.classList.add('isLoading');

        let loader = new AssetsLoader({
                assets: assets
            }).on('error', function(error) {
                console.error(error);
            }).on('progress', function(p) {
                // console.log('Progress : ', p);
                let loader = document.body.querySelector('.Loading-Bar');
                if (loader) loader.style.width = (p * 100).toFixed(2) + '%';
            }).on('complete', _onImageLoaded)
            .start();
    } else {
        _init3D();
    }

}


function _onImageLoaded(o) {
    //  ASSETS
    console.log('Image Loaded : ', o);
    // document.body.classList.remove('isLoading');
    window.assets = o;

    _init3D();
}


function _init3D() {


    //  CREATE CANVAS
    let canvas = document.createElement("canvas");
    canvas.className = 'Main-Canvas';
    document.body.appendChild(canvas);

    //  INIT 3D TOOL
    GL.init(canvas);


    window.gui = new dat.GUI({ width: 300 });

    //  CREATE SCENE
    let scene = new SceneApp();

    //  INIT DAT-GUI
    let f = gui.addFolder('render settings');
    f.addColor(params, 'baseColor');
    f.add(params, 'roughness', 0, 1);
    f.add(params, 'baseColorAmount', 0, 1);
    f.add(params, 'diffuseColorAmount', 0, 1);
    f.add(params, 'displace', 0, 40);
    f.add(params, 'specular', 0, 1);
    f.add(params, 'metallic', 0, 1);
    f.add(params, 'saturation', 0, 1.);
    f.add(params, 'ao', 0, .5);
    f.add(params, 'gamma', 1, 10);
    f.add(params, 'exposure', 1, 40);
    f.add(params, 'offset', 0, 1);

}