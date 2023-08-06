import { SceneList } from "./SceneList";
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice'

type scaleMode = 'FIT' | 'SMOOTH'

document.body.style.overflow = 'hidden'

export const GAME_CONFIG = {
    DEFAULT_WIDTH: 720,
    DEFAULT_HEIGHT: 360,
    MAX_WIDTH: 1000,
    MAX_HEIGHT: 361,
    SCALE_MODE:'SMOOTh' // FIT OR SMOOTH
}

export const PhaserConfig: Phaser.Types.Core.GameConfig = {
    scene: SceneList,

    type: Phaser.AUTO,
    backgroundColor: '#353535',
    canvas: document.getElementsByTagName('canvas')[0],

    scale: {
        // parent: 'phaser-game',
        // mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH,
        // // width: window.innerWidth > window.innerHeight ? 1280 : 720,
        // width: 1280,
        // height: 720,
        parent: 'phaser-game',
        mode: Phaser.Scale.NONE,
        width: GAME_CONFIG.DEFAULT_WIDTH,
        height: GAME_CONFIG.DEFAULT_HEIGHT,
        // autoCenter: Phaser.Scale.NO_CENTER,
    },

    physics: {
        default: 'matter',
        matter: {
            // debug: {
            //     lineOpacity: 0.25,
            //     renderLine: true,
            //     // fill
            // },
            debug: false,
            gravity: { x: 0, y: 0 }
        }
    },

    plugins: {
        global: [
            NineSlicePlugin.DefaultCfg,
        ],
    },

    render: {
        // transparent: false,
        clearBeforeRender: true,
        roundPixels: true,
        antialiasGL: false,
        pixelArt: false,
        powerPreference: 'high-performance',
    },
}
