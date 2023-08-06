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
		const sprites = this.config.map(config =>
		{
			const sprite = Chubrik.createSprite(this, config).setInteractive({ cursor: "hand" });
			enableClickEvent(sprite).on("click", () =>
			{
				this.scene.launch("PurchaseScene", config);
			});

			return sprite;
		});
		
		const closeBtn = this.add.image(0, 0, Main.Key, Main.cross).setInteractive({ cursor: "hand" });
        enableClickEvent(closeBtn).on("click", () =>
        {
            this.scene.stop();
        });
        closeBtn.setPosition(this.gameWidth * .5 - 64, -this.gameHeight * .5 + 64);

		Distribute.AsRow(sprites, 10);

		this.show();
		this.initResize();
	}

	onResize(): void
	{
		this.camera.centerOn(0, 0);
	}
}