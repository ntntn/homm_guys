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
    amount: number;

    sprite: Phaser.GameObjects.Sprite;
    config: ChubrikConfig;
    amountText: Phaser.GameObjects.BitmapText;
    get x() { return this.sprite.x }
    get y() { return this.sprite.y }

    constructor(scene: GameScene, col: number, row: number, config: ChubrikConfig)
    {
        this.scene = scene;
        this.config = config;

        this.life = config.life;
        this.attack = config.attack;
        this.speed = config.speed;
        this.range = config.range;
        this.defense = config.defense;
        this.price = config.price;
        this.amount = Phaser.Math.Between(1, 50);

        const wp = scene.getWorldPosition(col, row);
        const frame = this.getFrame(config.type);
        this.sprite = scene.add.sprite(wp.x, wp.y, Main.Key, frame)
            .setScale(this.getScale(config.type))
            .setDepth(1)
            .play(this.getAnim(config.type));

        this.amountText = scene.add.bitmapText(0, 0, "nokia16").setOrigin(0.5).setCenterAlign().setDepth(15).setFontSize(12);
        this.updateAmountText();
    }

    updateAmountText()
    {
        this.amountText.setPosition(this.x, this.y + this.sprite.displayHeight * .5).setText(this.amount.toString());
    }

    async moveAction(pos: Position)
    {
        this.clearRange();
        this.sprite.setFlipX(pos.x - this.x < 0);
        await addAsyncTween(this.scene, {
            targets: [this.sprite],
            x: pos.x,
            y: pos.y,
            duration: 500,
            onUpdate: () => this.updateAmountText(),
        });
    }

    async attackAction(chubrik2: Chubrik)
    {

        if (this.range > 1)
        {
            this.clearRange();
            this.sprite.setFlipX(chubrik2.x - this.x < 0);
            await this.rangeAttackAction(this, chubrik2);
            this.scene.onMoveEnd();
        }
        else
        {
            const curLogicPos = this.scene.getLogicPosition(this.x, this.y);
            const logicPos = this.scene.getLogicPosition(chubrik2.x, chubrik2.y);
            const cellPositions = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]].map(e => { return { col: logicPos.col + e[0], row: logicPos.row + e[1] } }).filter(e =>
            {
                const isRangeValid = this.scene.isRangeValid(curLogicPos.col, curLogicPos.row, e.col, e.row);
                const existing = this.scene.getChubrik(e.col, e.row);
                console.log(e, isRangeValid, existing);
                return this.scene.isValid(e.col, e.row) && (!existing || existing == this) && isRangeValid;
            });

            console.log(cellPositions);

            const lengthArray = cellPositions.map(pos =>
            {
                const wp = this.scene.getWorldPosition(pos.col, pos.row);
                return new Phaser.Math.Vector2(wp.x - this.x, wp.y - this.y).length()
            });

            console.log(lengthArray);
            const closest = Math.min(...lengthArray);
            const index = lengthArray.indexOf(closest);

            console.log(index);

            const validCell = cellPositions[index];
            if (validCell)
            {
                const pos = this.scene.getWorldPosition(validCell.col, validCell.row);
                this.clearRange();
                this.sprite.setFlipX(chubrik2.x - this.x < 0);
                if (pos.x != this.x || pos.y != this.y)
                {
                    await this.scene.currentChubrik.moveAction(pos);
                    await this.scene.waitFor(100);
                }
                await this.meleeAttackAction(this, chubrik2);
                this.scene.onMoveEnd();
            }
        }
    }

    async meleeAttackAction(chubrik1: Chubrik, chubrik2: Chubrik)
    {
        const dist = new Phaser.Math.Vector2(chubrik2.x - chubrik1.x, chubrik2.y - chubrik1.y).normalize();
        await Promise.all([
            addAsyncTween(this.scene, {
                targets: [this.sprite],
                x: `+=${dist.x * this.scene.cellSize * .5}`,
                y: `+=${dist.y * this.scene.cellSize * .5}`,
                delay: 150,
                duration: 150,
                ease: "Ease.Sine.InOut",
                yoyo: true,
                onUpdate: () => this.updateAmountText(),
            }),
            (async () =>
            {
                await this.scene.waitFor(150 + 150);
                const damage = Phaser.Math.Clamp(this.attack - chubrik2.defense, 0, Number.MAX_VALUE);
                await chubrik2.takeDamage(damage);
            })()
        ]);
    }

    async rangeAttackAction(chubrik1: Chubrik, chubrik2: Chubrik)
    {
        const dist = new Phaser.Math.Vector2(chubrik2.x - chubrik1.x, chubrik2.y - chubrik1.y).normalize();
        await Promise.all([
            addAsyncTween(this.scene, {
                targets: [this.sprite],
                x: `+=${dist.x * this.scene.cellSize * .5}`,
                y: `+=${dist.y * this.scene.cellSize * .5}`,
                delay: 150,
                duration: 150,
                ease: "Ease.Sine.InOut",
                yoyo: true,
                onUpdate: () => this.updateAmountText(),
            }),
            (async () =>
            {
                await this.scene.waitFor(150 + 150);
                await this.projectile(chubrik2.x, chubrik2.y);
                const damage = Phaser.Math.Clamp(this.attack - chubrik2.defense, 0, Number.MAX_VALUE);
                await chubrik2.takeDamage(damage);
            })()
        ]);
    }

    async projectile(x: number, y: number)
    {
        const projectile = this.scene.add.sprite(this.x, this.y, Main.Key, Main["air_chubrik_patron (1)"]).play("air_chubrik_patron").setScale(0.25).setDepth(2);
        await addAsyncTween(this.scene, {
            targets: projectile,
            x: x,
            y: y,
            duration: 500,
        });
        projectile.destroy();
    }

    async takeDamage(damage: number)
    {
        this.sprite.setTintFill(0xffffff);
        this.scene.time.delayedCall(100, () => this.sprite.clearTint());
        this.scene.bloodParticle.explode(10, this.x, this.y);

        const text = this.scene.add.bitmapText(this.x, this.y, "nokia16", `-${damage}`).setOrigin(0.5).setCenterAlign().setDepth(20);
        this.scene.add.tween({
            targets: text,
            y: `-=${this.scene.cellSize}`,
            alpha: 0,
        });

        this.life -= damage;
        if (this.life <= 0)
        {
            this.amount--;
            this.updateAmountText();
            this.life = this.config.life;
            if (this.amount <= 0) await this.die();
            else await addAsyncTween(this.scene, {
                targets: [this.sprite, this.amountText],
                scale: `*=1.25`,
                ease: "Sine.Ease.In",
                yoyo: true,
                duration: 150,
            });
        };

    }

    async die()
    {

        await addAsyncTween(this.scene, {
            targets: [this.sprite, this.amountText],
            scale: `*=1.5`,
            alpha: 0,
            ease: "Sine.Ease.In",
            duration: 150,
        });

        const index = this.scene.chubriks.indexOf(this);
        this.scene.chubriks.splice(index, 1);
        this.sprite.destroy();
        this.amountText.destroy();
    }

    rangeArray: Phaser.GameObjects.Rectangle[] = [];

    drawRange(range = 4)
    {
        const pos = this;
        const { col, row } = this.scene.getLogicPosition(this.x, this.y);
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