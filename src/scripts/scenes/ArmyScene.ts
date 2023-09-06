import { Images, Main } from "../Assets";
import { CustomScene } from "../CustomScene";
import { enableClickEvent } from "../Utils/common";
import { Distributable, Distribute } from "../Utils/Distribute";
import { Chubrik } from "./Chubrik";
import GameScene from "./GameScene";
import PurchaseScene from "./PurchaseScene";

export default class ArmyScene extends CustomScene
{
	static instance: ArmyScene;

	config: ChubrikConfig[];
	slots: { rect: Phaser.GameObjects.Rectangle, image: Phaser.GameObjects.Image, text: Phaser.GameObjects.BitmapText, chubrik: { type: ChubrikType, amount: number } }[];
	gold: number;
	goldText: Phaser.GameObjects.BitmapText;
	goldIcon: Phaser.GameObjects.Image;
	emitters: any;

	constructor()
	{
		super('ArmyScene');
		ArmyScene.instance = this;
		(window as any).ArmyScene = this;
	}

	create()
	{
		this.camera.setBackgroundColor("#212C36")
		this.config = this.cache.json.get("Chubriks") as ChubrikConfig[];
		this.gold = 1000;

		this.initSlots();
		this.initChubriks();
		this.initGold();
		this.initCloseBtn();

		this.add.image(0, 0, Images.lightmap).setAlpha(0.25);
		this.add.image(0, 0, Images.lightBg).setAlpha(0.25);
		
		this.emitters = [];
		this.emitters.push(this.add.particles(0, 0, Images.particle1, {
			alpha: { start: 1, end: 0 },
			scale: { start: 0.5, end: 2.5 },
			tint: { start: 0xff945e, end: 0xff945e },
			speed: 20,
			accelerationY: -300,
			angle: { min: -85, max: -95 },
			rotate: { min: -180, max: 180 },
			lifespan: { min: 1000, max: 1100 },
			blendMode: 'ADD',
			frequency: 110,
		}).setPosition(this.camera.width * 0.5 - 30, this.camera.height * 0.5 - 50));

		this.emitters.push(this.add.particles(0, 0, Images.particle1, {
			alpha: { start: 1, end: 0 },
			scale: { start: 0.5, end: 2.5 },
			tint: { start: 0xff945e, end: 0xff945e },
			speed: 20,
			accelerationY: -300,
			angle: { min: -85, max: -95 },
			rotate: { min: -180, max: 180 },
			lifespan: { min: 1000, max: 1100 },
			blendMode: 'ADD',
			frequency: 110,
		}).setPosition(-this.camera.width * 0.5 + 30, this.camera.height * 0.5 - 50));

		this.show();
		this.initResize();
	}

	initChubriks()
	{
		const sprites = this.config.map(config =>
		{
			const sprite = Chubrik.createSprite(this, config.type).setInteractive({ cursor: "hand" });
			enableClickEvent(sprite).on("click", () =>
			{
				this.scene.launch("PurchaseScene", config);
			});

			return sprite;
		});
		Distribute.AsGrid(sprites, 2, 8, 10);
	}

	initSlots()
	{
		this.slots = [];

		for (let i = 0; i < 7; i++)
		{
			const rect = this.add.rectangle(0, 0, 48, 48, 0x000000, 1).setAlpha(0.6).setStrokeStyle(2, 0xffffff);
			this.slots.push({
				rect: rect,
				chubrik: null as any,
				image: null as any,
				text: null as any,
			});
		}

		Distribute.AsRow(this.slots.map(e => e.rect), 0, 0, this.view.height * 0.5 - 40);
	}

	initGold()
	{
		this.goldText = this.add.bitmapText(0, -this.view.height * .5 + 30, "nokia16", this.gold.toString()).setOrigin(0.5).setCenterAlign();
		this.goldIcon = this.add.image(this.goldText.getRightCenter().x!, this.goldText.y, Main.Key, Main.coin).setOrigin(0, 0.5);
	}

	initCloseBtn()
	{
		const closeBtn = this.add.image(0, 0, Main.Key, Main.cross).setScale(0.5).setInteractive({ cursor: "hand" });
		enableClickEvent(closeBtn).on("click", () =>
		{
			this.scene.stop();
			this.scene.start("MenuScene");
		});
		closeBtn.setPosition(this.gameWidth * .5 - 32, -this.gameHeight * .5 + 32);
	}

	onPurchased(data: { type: ChubrikType, amount: number, price: number })
	{
		const { type, amount, price } = data;
		if (amount <= 0) return;

		const existingSlot = this.slots.find(e => e.chubrik && e.chubrik.type == type);
		const emptySlot = this.slots.find(e => e.chubrik == null);
		const slot = existingSlot ?? emptySlot;

		if (!slot) console.error("no empty slot");
		if (!slot) return;

		if (!slot.chubrik)
		{
			slot.chubrik = data;
			slot.image = Chubrik.createSprite(this, type).setPosition(slot.rect.x, slot.rect.y);
			slot.text = this.add.bitmapText(slot.rect.x, slot.rect.y + 30, "nokia16").setOrigin(0.5).setCenterAlign().setDepth(2);
		} else
		{
			slot.chubrik.amount += amount;
		}

		slot.text.setText(slot.chubrik.amount.toString());

		this.gold -= price;
		this.goldText.setText(this.gold.toString());
	}

	onResize(): void
	{
		this.camera.centerOn(0, 0);
	}
}