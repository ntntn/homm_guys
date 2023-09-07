import { Images, Main } from "../Assets";
import { CustomScene } from "../CustomScene";
import { enableClickEvent } from "../Utils/common";
import { Distributable, Distribute } from "../Utils/Distribute";
import { Chubrik } from "./Chubrik";
import GameScene from "./GameScene";
import PurchaseScene from "./PurchaseScene";
import { VersusManager } from "./VersusManager";

type Slot = {
	rect: Phaser.GameObjects.Rectangle,
	image: Phaser.GameObjects.Image,
	text: Phaser.GameObjects.BitmapText,
	chubrik: ChubrikSlot
};

export default class ArmyScene extends CustomScene
{
	static instance: ArmyScene;

	config: ChubrikConfig[];
	slots: Slot[];
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
		this.gold = 5000;

		this.initSlots();
		this.initChubriks();
		this.initGold();
		this.initDoneBtn();
		this.initRngBtn();
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

	initDoneBtn()
	{
		const doneBtn = this.add.bitmapText(this.slots[this.slots.length - 1].rect.x + 100, this.view.height * .5 - 40, "nokia16", "Done").setOrigin(0.5).setCenterAlign().setFontSize(24);
		enableClickEvent(doneBtn);
		doneBtn.setInteractive().on("click", () =>
		{
			if (this.tweens.getTweensOf(doneBtn).length > 0) return;

			this.tweens.add({
				targets: doneBtn,
				scale: `*=0.8`,
				ease: "Sine.easeIn",
				duration: 125,
				yoyo: true,
				onStart: () =>
				{
					if (this.slots.filter(e => e.chubrik == null).length === this.slots.length) return;

					if (VersusManager.Instance.playerA != null)
					{
						VersusManager.Instance.playerB = {
							slots: this.slots.map(e => e.chubrik)
						}
						this.scene.start("GameScene")
					}
					else
					{
						VersusManager.Instance.playerA = {
							slots: this.slots.map(e => e.chubrik)
						}
						this.scene.restart();
					}
				}
			})
		});
	}

	initRngBtn()
	{
		const rngBtn = this.add.bitmapText(this.slots[0].rect.x - 100, this.view.height * .5 - 40, "nokia16", "rng").setOrigin(0.5).setCenterAlign().setFontSize(24);
		enableClickEvent(rngBtn);
		rngBtn.setInteractive().on("click", () =>
		{
			if (this.tweens.getTweensOf(rngBtn).length > 0) return;

			const randomizeSlots = () =>
			{
				const types = this.config.map(e => e.type);
				this.slots.forEach(s =>
				{
					const type = Phaser.Math.RND.weightedPick(types);
					types.splice(types.indexOf(type), 1);
					this.setChubrik(s, type);
					s.text.setText(s.chubrik.amount.toString());
				});

				this.slots.forEach(s =>
				{
					const { type } = s.chubrik;
					this.onPurchased({ type: type, amount: 1, price: this.config.find(e => e.type == type)!.price });
				});

				this.slots.forEach(s =>
				{
					const { type } = s.chubrik;
					const gold = Phaser.Math.Between(0, this.gold);
					const cfg = this.config.find(e => e.type == type)!;
					const amount = Math.floor(gold / cfg.price);
					const price = amount * cfg.price;
					this.onPurchased({ amount, price, type });
				});
			}

			randomizeSlots();

			this.tweens.add({
				targets: rngBtn,
				scale: `*=0.8`,
				ease: "Sine.easeIn",
				duration: 125,
				yoyo: true,
				onStart: () =>
				{
					// if (this.slots.filter(e => e.chubrik == null).length === this.slots.length) return;



					// VersusManager.Instance.playerB = {
					// 	slots: this.slots.map(e => e.chubrik)
					// }

					// this.scene.start("GameScene")

					// VersusManager.Instance.playerA = {
					// 	slots: this.slots.map(e => e.chubrik)
					// }
				}
			})
		});
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
			this.setChubrik(slot, type)
		} else
		{
			slot.chubrik.amount += amount;
		}

		slot.text.setText(slot.chubrik.amount.toString());

		this.gold -= price;
		this.goldText.setText(this.gold.toString());
	}

	setChubrik(slot: Slot, type: ChubrikType)
	{
		slot.chubrik = { type: type, amount: 0 };
		slot.image = Chubrik.createSprite(this, type).setPosition(slot.rect.x, slot.rect.y);
		slot.text = this.add.bitmapText(slot.rect.x, slot.rect.y + 30, "nokia16").setOrigin(0.5).setCenterAlign().setDepth(2);
	}

	onResize(): void
	{
		this.camera.centerOn(0, 0);
	}
}