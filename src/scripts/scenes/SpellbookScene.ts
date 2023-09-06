import { Images, Main } from "../Assets";
import { CustomScene } from "../CustomScene";
import { enableClickEvent } from "../Utils/common";
import { Distributable, Distribute } from "../Utils/Distribute";
import { Placement } from "../Utils/Placement";
import ArmyScene from "./ArmyScene";
import { Chubrik } from "./Chubrik";

export default class SpellbookScene extends CustomScene
{
    static instance: SpellbookScene;

    pbBar: Phaser.GameObjects.Image;
    pbHandle: Phaser.GameObjects.Image;
    pbText: Phaser.GameObjects.BitmapText;

    pbMin: number;
    pbMax: number;
    buyBtn: Phaser.GameObjects.BitmapText;
    goldText: Phaser.GameObjects.BitmapText;
    goldIcon: Phaser.GameObjects.Image;
    background: Phaser.GameObjects.Rectangle;
    config: ChubrikConfig;

    constructor()
    {
        super('SpellbookScene');
        SpellbookScene.instance = this;
        (window as any).SpellbookScene = this;
    }

    create(config: ChubrikConfig)
    {
        // this.camera.setBackgroundColor("#212C36")
        this.config = config;
        // const back = this.add.rectangle(0, 0, this.gameWidth, this.gameHeight, 0x000000, 0.6).setInteractive();
        this.background = this.add.rectangle(0, 0, 300, 300, 0x3A3A3A, 0.95);

        const slots: any[] = [];
        for (let i = 0; i < 16; i++) {
            slots.push({
                rect: this.add.rectangle(0, 0, 48, 48, 0x000000, 1)
            });
        }

        Distribute.AsGrid(slots.map(e => e.rect), 4, 4, 20, 20);

        this.show();
        this.initResize();
    }

    close()
    {
        this.scene.stop()
    }

    update(time: number, delta: number)
    {
    }

    onResize(): void
    {
        this.camera.centerOn(0, 0);
    }
}