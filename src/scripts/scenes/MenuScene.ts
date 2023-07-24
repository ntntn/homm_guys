import { CustomScene } from "../CustomScene";

export default class MenuScene extends CustomScene
{
	static instance: MenuScene;

	constructor()
	{
		super('MenuScene');
		MenuScene.instance = this;
		(window as any).MenuScene = this;
	}

	create()
	{
		this.add.text(0, -100, "ГЕРОИ МЕЧА И МАГИИ 10").setOrigin(0.5).setAlign("center");

		const playButton = this.add.text(0, 0, "Играть").setOrigin(0.5).setAlign("center");
		playButton.setInteractive().on("pointerup", () => {
			console.log("START GAME");
			playButton.setActive(false);
			this.tweens.add({
				targets: playButton,
				scale: { from: 1.0, to: 1.1 },
				yoyo: true,
				duration: 125,
				onComplete: () => {
					this.scene.start("GameScene");
				}
			});
		})

		this.show();
		this.initResize();
	}

	onResize(): void {
		this.camera.centerOn(0, 0);
	}
}