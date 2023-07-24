import { CustomScene } from "../../CustomScene";

export class Sprite extends Phaser.GameObjects.Sprite {
    constructor(scene: CustomScene, x: number, y: number, texture: string, frame?: string) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
    }
}