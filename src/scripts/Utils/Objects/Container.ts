import { CustomScene } from "../../CustomScene";

export class Container extends Phaser.GameObjects.Container {
    constructor(scene: CustomScene) {
        super(scene);
        scene.add.existing(this);
    }
}