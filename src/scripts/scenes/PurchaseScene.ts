import { Images, Main } from "../Assets";
import { CustomScene } from "../CustomScene";
import { enableClickEvent } from "../Utils/common";
import { Distributable, Distribute } from "../Utils/Distribute";
import { Placement } from "../Utils/Placement";
import { Chubrik } from "./Chubrik";

export default class PurchaseScene extends CustomScene
{
    static instance: PurchaseScene;
    pbBack: Phaser.GameObjects.Image;
    pbHandle: Phaser.GameObjects.Image;
    pbText: Phaser.GameObjects.BitmapText;
    pbMin: number;
    pbMax: number;

    constructor()
    {
        super('PurchaseScene');
        PurchaseScene.instance = this;
        (window as any).PurchaseScene = this;
    }

    create(config: ChubrikConfig)
    {
        this.camera.setBackgroundColor("#212C36")


        const rect = this.add.rectangle(0, 0, 256, 256, 0x000000, 0.25);
        const sprite = Chubrik.createSprite(this, config);
        const statsContainer = this.add.container(0, 0, [
            this.add.bitmapText(0, 0, "nokia16", `life: ${config.life}`).setLeftAlign(),
            this.add.bitmapText(0, 0, "nokia16", `attack: ${config.attack}`).setLeftAlign(),
            this.add.bitmapText(0, 0, "nokia16", `defense: ${config.defense}`).setLeftAlign(),
            this.add.bitmapText(0, 0, "nokia16", `range: ${config.range}`).setLeftAlign(),
            this.add.bitmapText(0, 0, "nokia16", `speed: ${config.speed}`).setLeftAlign(),
            this.add.bitmapText(0, 0, "nokia16", `price: ${config.price}`).setLeftAlign(),
        ]);

        const closeBtn = this.add.image(0, 0, Main.Key, Main.cross).setInteractive({ cursor: "hand" });
        enableClickEvent(closeBtn).on("click", () =>
        {
            this.scene.stop();
        });
        closeBtn.setPosition(this.gameWidth * .5 - 64, -this.gameHeight * .5 + 64);

        this.pbBack = this.add.image(0, 0, Main.Key, Main.pb_back);
        this.pbHandle = this.add.image(0, 0, Main.Key, Main.pb_handle);
        this.pbText = this.add.bitmapText(0, 0, "nokia16", "0").setOrigin(0.5).setCenterAlign();
        this.pbHandle.setOrigin(0, 0.5);
        this.pbMin = this.pbBack.getLeftCenter().x!;
        this.pbMax = this.pbBack.getRightCenter().x! - this.pbHandle.width * .5;

        Distribute.AsColumn(statsContainer.list as Distributable[], 10);
        Distribute.AsRow([sprite, statsContainer], 64);
        this.pbBack.y = rect.getBottomCenter().y! - 20;
        this.pbHandle.y = rect.getBottomCenter().y! - 20;
        this.pbHandle.x = this.pbMin;
        this.pbText.setPosition(0, this.pbBack.getBottomCenter().y);

        this.show();
        this.initResize();
    }

    update(time: number, delta: number)
    {
        const ptr = this.input.activePointer;
        if (!ptr.isDown) return;
        ptr.updateWorldPoint(this.camera);
        this.pbBack.getRightCenter().x! - this.pbHandle.width * .5;
        this.pbHandle.x = Phaser.Math.Clamp(ptr.worldX, this.pbMin, this.pbMax);
    }

    onResize(): void
    {
        this.camera.centerOn(0, 0);
    }
}