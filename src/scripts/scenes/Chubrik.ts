import { Main } from "../Assets";
import { addAsyncTween } from "../asyncTween";
import GameScene from "./GameScene";

export class Chubrik
{
    scene: GameScene;

    life: number;
    attack: number;
    speed: number;
    range: number;
    defense: number;
    price: number;

    sprite: Phaser.GameObjects.Sprite;
    get x() { return this.sprite.x }
    get y() { return this.sprite.y }

    constructor(scene: GameScene, col: number, row: number, config: ChubrikConfig)
    {
        this.scene = scene;

        this.life = config.life;
        this.attack = config.attack;
        this.speed = config.speed;
        this.range = config.range;
        this.defense = config.defense;
        this.price = config.price;

        const wp = scene.getWorldPosition(col, row);
        const frame = this.getFrame(config.type);
        this.sprite = scene.add.sprite(wp.x, wp.y, Main.Key, this.getFrame(config.type))
            .setScale(this.getScale(config.type))
            .setDepth(1)
            .play(this.getAnim(config.type));
    }

    async moveAction(pos: Position)
    {
        this.clearRange();
        await addAsyncTween(this.scene, {
            targets: this.sprite,
            x: pos.x,
            y: pos.y,
            duration: 500,
        });
    }

	async attackAction(chubrik1: Chubrik, chubrik2: Chubrik)
	{
		await addAsyncTween(this.scene, {
			targets: chubrik1.sprite,
			x: chubrik2.x - chubrik2.sprite.displayWidth * .4,
			y: chubrik2.y,
			delay: 150,
			duration: 150,
			ease: "Ease.Sine.InOut",
			yoyo: true,
			onYoyo: () =>
			{
				chubrik2.sprite.setTintFill(0xffffff);
				this.scene.time.delayedCall(100, () => chubrik2.sprite.clearTint());
                this.scene.bloodParticle.explode(10, chubrik2.x, chubrik2.y);

				const text = this.scene.add.bitmapText(chubrik2.x, chubrik2.y, "nokia16", "-15").setOrigin(0.5).setCenterAlign().setDepth(10);
				this.scene.add.tween({
					targets: text,
					y: `-=${this.scene.cellSize}`,
					alpha: 0,
				});
			}
		});
	}

    rangeArray: Phaser.GameObjects.Rectangle[] = [];

    drawRange(col: number, row: number, range = 4)
    {
        const pos = this.scene.getWorldPosition(col, row);
        this.rangeArray.push(this.scene.add.rectangle(pos.x, pos.y, this.scene.cellSize, this.scene.cellSize, 0xAEDAAA, 0.75));

        for (let r = row - range; r <= row + range; r++)
        {
            for (let c = col - range; c <= col + range; c++)
            {
                if (!this.scene.isValid(c, r)) continue;

                const dist = (c - col) * (c - col) + (r - row) * (r - row);
                if (dist < range * range)
                {
                    if (this.scene.getChubrik(c, r)) continue;
                    // point is in circle
                    const pos = this.scene.getWorldPosition(c, r);
                    const rect = this.scene.add.rectangle(pos.x, pos.y, this.scene.cellSize, this.scene.cellSize, 0xACC5DA, 0.25);
                    this.rangeArray.push(rect);
                }

            }
        }
    }

    clearRange()
    {
        this.rangeArray.forEach(r => r.destroy());
    }

    getFrame(type: ChubrikType)
    {
        if (type === "fire_chubrik") return Main.chubrik1;
        if (type === "water_chubrik") return Main["water_chubrik (1)"];
        if (type === "earth_chubrik") return Main["earth_chubrik (1)"];
        if (type === "air_chubrik") return Main["air_chubrik (1)"];
        if (type === "dragon") return Main["dragon (1)"];
        if (type === "water_dragon") return Main["water_dragon (1)"];
        return Main.blood
    }

    getScale(type: ChubrikType)
    {
        if (type === "fire_chubrik") return 0.15;
        if (type === "water_chubrik") return 0.2;
        if (type === "earth_chubrik") return 0.2;
        if (type === "air_chubrik") return 0.2;
        if (type === "dragon") return 0.2;
        if (type === "water_dragon") return 0.2;
        return 1
    }

    getAnim(type: ChubrikType)
    {
        if (type === "fire_chubrik") return "fire_chubrik";
        if (type === "water_chubrik") return "water_chubrik";
        if (type === "earth_chubrik") return "earth_chubrik";
        if (type === "air_chubrik") return "air_chubrik";
        if (type === "dragon") return "dragon";
        if (type === "water_dragon") return "water_dragon";
        return Main.blood
    }
}