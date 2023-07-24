import { CustomScene } from "../CustomScene";
import { BitmapText } from "./Objects/BitmapText";
import { Image } from "./Objects/Image";

export class ProgressBar extends Phaser.GameObjects.Container
{
    fill: Image;
    base: Image;
    text: BitmapText | undefined;

    constructor(scene: Phaser.Scene, config: { base: Image, fill: Image, text?: BitmapText, val: number, max: number })
    {
        super(scene);
        scene.add.existing(this);

        this.fill = config.fill;
        this.base = config.base;
        this.text = config.text;

        this.fill.setOrigin(0, 0.5).setPosition(this.base.getLeftCenter().x, 0);

        this.add([config.base, config.fill]);

        if (this.text) this.add(this.text);

        this.updateText(config.val, config.max);
    }

    setValue(val: number, max: number)
    {
        this.fill.setScale(val / max, 1);
        this.updateText(val, max);
        return this;
    }

    updateText(val: number, max: number) {
        if (!this.text) return;

        this.text.setText(`${val.toFixed(0)}/${max.toFixed(0)}`);
    }
}