export const resources = {
    images: {
        // SelectCharacter: 'assets/img/SelectCharacter.png',
        // 'phaser-logo': 'assets/img/phaser-logo.png',

        // player: 'assets/img/player.png',
        // enemy: 'assets/img/enemy.png',
        // GhostBat: 'assets/img/bat1.png',
        // bat: 'assets/img/bat2.png',

        // bg: 'assets/img/Background/bg.png',
        // bg1: 'assets/img/Background/bg1.png',
        // bg2: 'assets/img/Background/bg2.png',
        // bg3: 'assets/img/Background/bg3.png',
        // SelectCharacterBg: 'assets/img/SelectCharacterBg.png',

        // desertTileset: 'assets/tilemaps/tiles/tmw_desert_spacing.png',
        // ground_1x1: 'assets/tilemaps/tiles/ground_1x1.png',
        // TX_Tileset_Grass: 'assets/tilemaps/tiles/TX Tileset Grass.png',
        // bootBg: 'assets/img/bootBg.png',
        // tiles: 'assets/tilemaps/tiles/muddy-ground.png',
        // gem: 'assets/img/gem1.png',
        // ninesliceBg: 'assets/img/ui/popup.png',
        // greyNineslice: 'assets/img/ui/greyNineslice.png',

        // skill: 'assets/img/ui/skill.png',
        // saintWaterSkill: 'assets/img/ui/saintWater.png',
        // knifeSkill: 'assets/img/ui/knife.png',
        // bibleSkill: 'assets/img/ui/bible.png',

        // bible: 'assets/img/bible.png',
        // knife: 'assets/img/knife.png',
        // circ: 'assets/img/circ.png',
        // potion: 'assets/img/@AtlasGen/potion.png',
        // potion1: 'assets/img/@AtlasGen/potion1.png',

        // charBg: 'assets/img/ui/CharacterSelection/charBg.png',
        // charSelectBg: 'assets/img/ui/CharacterSelection/selectBg.png',
        // charSelectMainBg: 'assets/img/ui/CharacterSelection/characterSelectionBg.png',

        // health_base: 'assets/img/@AtlasGen/health_bg.png',
        // health_fill: 'assets/img/@AtlasGen/health_fill.png',

        // lightmap: 'assets/img/lightmap.png',
        // TorchLight: 'assets/img/torchlight.png',
        // TorchShadow: 'assets/img/torchShadow.png',
        // lightBg: 'assets/img/lightBg.png',

        // //#region chest
        // c1: 'assets/img/icons/c1.png',
        // palm_top: 'assets/img/icons/palm_top.png',
        // palm_bottom: 'assets/img/icons/palm_bottom.png',
        // big_chest: 'assets/img/icons/big_chest.png',
        // big_chest_open: 'assets/img/icons/big_chest_open.png',
        // light: 'assets/img/icons/light.png',
        // boom: 'assets/img/icons/boom.png',
        // boom_1: 'assets/img/icons/boom_1.png',
        // coin: 'assets/img/icons/coin.png',
        // chest_ray_1: 'assets/img/icons/chest_ray_1.png',
        // //#endregion

        // pointerFrame: 'assets/img/joystick/back.png',
        // pointerArrow: 'assets/img/joystick/white_thing.png',
        // pointerBtn: 'assets/img/joystick/btn.png',
        lightmap: 'assets/img/lightmap.png',
        lightBg: 'assets/img/lightBg.png',
        circ: 'assets/img/circ.png',
        particle: 'assets/img/particle.png',
    },
    atlases: {
        Main: { image: 'Main/texture.png', json: 'Main/texture.json' },
        // axe: { image: 'slash/texture.png', json: 'slash/texture.json' },
        // sword: { image: 'sword/texture.png', json: 'sword/texture.json' },
        // garlic: { image: 'aura/texture.png', json: 'aura/texture.json' },
        // explosion: { image: 'explosion/texture.png', json: 'explosion/texture.json' },
        // orb: { image: 'projectile/texture.png', json: 'projectile/texture.json' },
        // projectile1: { image: 'projectile1/texture.png', json: 'projectile1/texture.json' },

        // Chests: { image: 'Chests/texture.png', json: 'Chests/texture.json' },
        // Torch: { image: 'Torch/texture.png', json: 'Torch/texture.json' },

        // Mob1: { image: 'Mob1/texture.png', json: 'Mob1/texture.json' },

        // Environment: { image: 'Environment/texture.png', json: 'Environment/texture.json' },
        // Characters: { image: 'Characters/texture.png', json: 'Characters/texture.json' },
        // UI: { image: 'UI/texture.png', json: 'UI/texture.json' },

        // Ghost: { image: 'Ghost/texture.png', json: 'Ghost/texture.json' },
        // Skills: { image: 'Skills/texture.png', json: 'Skills/texture.json' },
        // Animations: { image: 'Animations/texture.png', json: 'Animations/texture.json' },

        // Food: { image: 'Food/texture.png', json: 'Food/texture.json' },

        // Enemies: { image: 'Enemies/texture.png', json: 'Enemies/texture.json' },
        // Effects: { image: 'Effects/texture.png', json: 'Effects/texture.json' },
    },

    audios: {
        S1: 'assets/audio/s1.mp3'
    },

    jsons: {
        Chubriks: 'assets/jsons/Chubriks.json'
    }
}

export const Images = valToKey(resources.images);
export const Atlases = valToKey(resources.atlases) as any;
export const Audios = valToKey(resources.audios) as any;
export const Jsons = valToKey(resources.jsons) as any;

function valToKey<T>(obj: T): { [K in keyof T]: string }
{
    const data = {} as any;
    Object.entries(obj as any).forEach(e =>
    {
        data[e[0]] = e[0];
    });
    return data;
}
// function valToKey<T>(obj: any): { [K in keyof T]: string }
// {
//     const data = {} as any;
//     Object.entries(obj).forEach(e =>
//     {
//         data[e[0]] = e[0];
//     });
//     return data;
// }

import EnvironmentKeys from '../assets/atlases/Environment/keys.json';
export const Environment = { Key: Atlases.Environment, ...EnvironmentKeys };

import CharactersKeys from '../assets/atlases/Characters/keys.json';
export const Characters = { Key: Atlases.Characters, ...CharactersKeys };

import UIKeys from '../assets/atlases/UI/keys.json';
export const UI = { Key: Atlases.UI, ...UIKeys };

import SkillKeys from '../assets/atlases/Skills/keys.json';
export const Skills = { Key: Atlases.Skills, ...SkillKeys };

import AnimationsKeys from '../assets/atlases/Animations/keys.json';
export const Animations = { Key: Atlases.Animations, ...AnimationsKeys };

import EnemiesKeys from '../assets/atlases/Enemies/keys.json';
export const Enemies = { Key: Atlases.Enemies, ...EnemiesKeys };

import FoodKeys from '../assets/atlases/Food/keys.json';
export const Food = { Key: Atlases.Food, ...FoodKeys };

import EffectsKeys from '../assets/atlases/Effects/keys.json';
export const Effects = { Key: Atlases.Effects, ...EffectsKeys };

import MainKeys from '../assets/atlases/Main/keys.json';
export const Main = { Key: Atlases.Main, ...MainKeys }; 