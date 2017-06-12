// SceneApp.js

import alfrid, { Scene } from './lib/alfrid';

//import ViewEnv from './ViewEnv';
import Light from './rad/Light';
//import ViewTerrain from './TerrainView';
import ViewEnv from './terrain/ViewEnv';
import ViewCube from './model/ViewBox';
import TerrainManager from './terrain2/TerrainManager';
import glm from 'gl-matrix';

const GL = alfrid.GL;

const RENDER_SKY = false
const RADIUS = 400

class SceneApp extends alfrid.Scene {
    constructor() {
        super();
        GL.enableAlphaBlending();
        // gui.add(params, 'fov', 45, 120).onChange(()=>this._onFovChange());
        this.offset = new alfrid.EaseNumber(0, 0.03);
        //this.orbitalControl.radius.value = 6
        //this.orbitalControl.radius.rx.value = 0.1
        //this.orbitalControl.radius.limit(0, 10000)
    }

    _initTextures() {

        function getAsset(id) {
            for (var i = 0; i < assets.length; i++) {
                if (id === assets[i].id) {
                    return assets[i].file;
                }
            }
        }
        this._textureDiffuse = new alfrid.GLTexture(getAsset('diffuse'));
        this._textureHeight = new alfrid.GLTexture(getAsset('height'));
        this._textureAo = new alfrid.GLTexture(getAsset('ao'));
        this._textureAlbedo = new alfrid.GLTexture(getAsset('albedo'));

        this._tAo = new alfrid.GLTexture(getAsset('river_ao'));
    }


    _initViews() {
        this.meshes = []
        console.log('init views');
        //this._sky = new ViewEnv()
        //this._terrain = new ViewTerrain()
        //this._tManager = new TerrainManager()
        TerrainManager.z = -512
        this._env = new ViewEnv({
            sky: {
                radius: RADIUS
            },
            ground: {
                position: [0, -40, 0],
                scale: 1,
                amp:40,
                width:256,
                height:1024,
                widthSegments:128,
                heightSegments:512,
            },
            mountains: [{
                //top
                position: [0, -4, -1600],
                amp:90,

                scale: 5
            },{
                //left
                position: [-1800, -8, 0],
                amp:90,
                width:256,
                height:768,
                scale: 5
            },{
                //right
                position: [1800, -8, 0],
                amp:90,
                width:256,
                height:768,
                scale: 5
            }]
        })

        this._light = new Light({
            ambient: [240 / 255, 235 / 255, 239 / 255],
            position: [-100, 50, 100],
        })

        this._cube  = new ViewCube({
            position:[100, 1, -20]
        })
    }

    render() {
        params.offset = this.offset.value;
        //this.orbitalControl.radius.value = RADIUS + params.offset * 7.0;
        TerrainManager.update()
        GL.clear(0, 0, 0, 0);
        GL.disable(GL.CULL_FACE);
        this._light.bind()
        if (RENDER_SKY) {
            this._sky.render(this._textureDiffuse,
                this._textureHeight,
                this._textureAo,
                this._textureAlbedo);
        } else {
            this._env.render()
            this._cube.render()
                //this._terrain.render(this._tAo, this._tHeight)
        }
        GL.enable(GL.CULL_FACE);
    }


    resize() {
        GL.setSize(window.innerWidth, window.innerHeight);
        this.camera.setAspectRatio(GL.aspectRatio);
    }
}


export default SceneApp;