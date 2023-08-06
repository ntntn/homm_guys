import { Images, resources } from "../Assets";
import { addAsyncTween } from "../asyncTween";
import { CustomScene } from "../CustomScene";
import { enableClickEvent } from "../Utils/common";
import { Distribute } from "../Utils/Distribute";

export default class MenuScene extends CustomScene
{
	static instance: MenuScene;
	emitters: any;

	constructor()
	{
		super('MenuScene');
		MenuScene.instance = this;
		(window as any).MenuScene = this;
	}

	create()
	{
		this.camera.setBackgroundColor("#353535")
		this.add.text(0, -100, "ГЕРОИ МЕЧА И МАГИИ 10").setOrigin(0.5).setAlign("center").setFontSize(30);


		this.add.image(0, 0, Images.lightmap).setAlpha(0.25);
		this.add.image(0, 0, Images.lightBg).setAlpha(0.25);

		this.emitters = [];
		this.emitters.push(this.add.particles(0, 0, Images.particle, {
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
		}).setPosition(this.camera.width * 0.5 - 100, this.camera.height * 0.5 - 50));

		this.emitters.push(this.add.particles(0, 0, Images.particle, {
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
		}).setPosition(-this.camera.width * 0.5 + 100, this.camera.height * 0.5 - 50));

		const playButton = this.add.text(0, 0, "Играть").setOrigin(0.5).setAlign("center").setFontSize(26);
		playButton.setInteractive({ cursor: "hand" });
		enableClickEvent(playButton).on("click", async () =>
		{
			console.log("START GAME");
			this.input.enabled = false;
			await this.btnTween(playButton);
			this.scene.start("GameScene");
			this.scene.stop();
		})

		const armyButton = this.add.text(0, 0, "Собрать армию").setOrigin(0.5).setAlign("center").setFontSize(26);
		armyButton.setInteractive({ cursor: "hand" });
		enableClickEvent(armyButton).on("click", async () =>
		{
			console.log("START ARMY");
			this.input.enabled = false;
			await this.btnTween(armyButton);
			this.scene.start("ArmyScene");
			this.scene.stop();
		});

		Distribute.AsColumn([playButton, armyButton], 20);

		this.show();
		this.initResize();
	}

	async btnTween(target: any)
	{
		await addAsyncTween(this, {
			targets: target,
			scale: { from: 1.0, to: 1.1 },
			yoyo: true,
			duration: 125,
		})
	}

	onResize(): void
	{
		this.camera.centerOn(0, 0);
	}
}