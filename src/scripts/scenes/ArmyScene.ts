import { Main } from "../Assets";
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

		this.initSlots();
		this.initChubriks();
		this.initCloseBtn();

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

	initCloseBtn()
	{
		const closeBtn = this.add.image(0, 0, Main.Key, Main.cross).setScale(0.5).setInteractive({ cursor: "hand" });
		enableClickEvent(closeBtn).on("click", () =>
		{
			this.scene.stop();
		});
		closeBtn.setPosition(this.gameWidth * .5 - 32, -this.gameHeight * .5 + 32);
	}

	onPurchased(data: { type: ChubrikType, amount: number })
	{
		const { type, amount } = data;
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
			slot.text = this.add.bitmapText(slot.rect.x, slot.rect.y + 20, "nokia16").setOrigin(0.5).setCenterAlign().setDepth(2);
		} else
		{
			slot.chubrik.amount += amount;
		}

		slot.text.setText(slot.chubrik.amount.toString());
	}

	onResize(): void
	{
		this.camera.centerOn(0, 0);
	}
}