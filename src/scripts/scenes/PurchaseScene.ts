import { Images, Main } from "../Assets";
import { CustomScene } from "../CustomScene";
import { enableClickEvent } from "../Utils/common";
import { Distributable, Distribute } from "../Utils/Distribute";
import { Placement } from "../Utils/Placement";
import ArmyScene from "./ArmyScene";
import { Chubrik } from "./Chubrik";

export default class PurchaseScene extends CustomScene
{
    static instance: PurchaseScene;

    pbBar: Phaser.GameObjects.Image;
    pbHandle: Phaser.GameObjects.Image;
    pbText: Phaser.GameObjects.BitmapText;

    pbMin: number;
    pbMax: number;
    buyBtn: Phaser.GameObjects.BitmapText;

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
        const sprite = Chubrik.createSprite(this, config.type);
        const statsContainer = this.add.container(0, 0, [
            this.add.bitmapText(0, 0, "nokia16", `life: ${config.life}`).setLeftAlign(),
            this.add.bitmapText(0, 0, "nokia16", `attack: ${config.attack}`).setLeftAlign(),
            this.add.bitmapText(0, 0, "nokia16", `defense: ${config.defense}`).setLeftAlign(),
            this.add.bitmapText(0, 0, "nokia16", `range: ${config.range}`).setLeftAlign(),
            this.add.bitmapText(0, 0, "nokia16", `speed: ${config.speed}`).setLeftAlign(),
            this.add.bitmapText(0, 0, "nokia16", `price: ${config.price}`).setLeftAlign(),
        ]);

        const closeBtn = this.add.image(0, 0, Main.Key, Main.cross).setScale(0.5).setInteractive();
        enableClickEvent(closeBtn).on("click", () =>
        {
            this.close();
        });
        closeBtn.setPosition(this.gameWidth * .5 - 64, -this.gameHeight * .5 + 64);

        this.pbBar = this.add.image(0, 0, Main.Key, Main.pb_back);
        this.pbHandle = this.add.image(0, 0, Main.Key, Main.pb_handle).setOrigin(0, 0.5);
        this.pbText = this.add.bitmapText(0, 0, "nokia16", "0").setOrigin(0.5).setCenterAlign(); 1
        this.pbMin = this.pbBar.getLeftCenter().x!;
        this.pbMax = this.pbBar.getRightCenter().x! - this.pbHandle.width * .5;
        this.buyBtn = this.add.bitmapText(0, 0, "nokia16", "buy").setOrigin(0.5).setCenterAlign().setFontSize(24);

        Distribute.AsColumn(statsContainer.list as Distributable[], 10);
        Distribute.AsRow([sprite, statsContainer], 64);
        statsContainer.y -= 30;
        sprite.y -= 30;
        sprite.x += 15;
        this.pbBar.y = rect.getBottomCenter().y! - 60;
        this.pbHandle.y = rect.getBottomCenter().y! - 60;
        this.pbHandle.x = this.pbMin;
        this.pbText.setPosition(0, this.pbBar.getBottomCenter().y);
        this.buyBtn.y = rect.getBottomCenter().y! - 20;

        this.pbBar.setInteractive().on("pointerdown", () =>
        {
            this.pbHandle.setData("pointerdown", true);
        });
        this.pbHandle.setInteractive().on("pointerdown", () =>
        {
            this.pbHandle.setData("pointerdown", true);
        });
        this.input.on("pointerup", () => this.pbHandle.setData("pointerdown", false));

        enableClickEvent(this.buyBtn)
        this.buyBtn.setInteractive().on("click", () => this.tweens.add({
            targets: this.buyBtn,
            scale: `*=0.8`,
            ease: "Sine.easeIn",
            duration: 125,
            yoyo: true,
            onStart: () =>
            {
                this.close();
                ArmyScene.instance.onPurchased({ type: config.type, amount: this.amount });
            }
        }))

        this.show();
        this.initResize();
    }

    close()
    {
        // this.hide(() => 
        this.scene.stop()
        // );
    }

    update(time: number, delta: number)
    {
        const ptr = this.input.activePointer;
        if (!ptr.isDown) return;
        if (!this.pbHandle.getData("pointerdown")) return;
        ptr.updateWorldPoint(this.camera);
        this.pbBar.getRightCenter().x! - this.pbHandle.width * .5;
        this.pbHandle.x = Phaser.Math.Clamp(ptr.worldX, this.pbMin, this.pbMax);
        this.pbText.setText(this.amount.toFixed(0))
    }

    get progress()
    {
        return (this.pbHandle.x - this.pbMin) / (this.pbMax - this.pbMin)
    }

    get amount()
    {
        return Math.floor(100 * this.progress);
    }

    onResize(): void
    {
        this.camera.centerOn(0, 0);
    }
}