import { Main } from "../Assets";
import { CustomScene } from "../CustomScene";

export default class GameScene extends CustomScene
{
	static instance: GameScene;
	cols: number;
	rows: number;
	cellSize: number;
	worldWidth: number;
	worldHeight: number;

	constructor()
	{
		super('GameScene');
		GameScene.instance = this;
		(window as any).GameScene = this;
	}

	create()
	{
		this.createGrid();
		this.createChubrik();
		this.add.rectangle(0, 0, this.worldWidth, this.worldHeight, 0xff0000, 0.25);

		this.show();
		this.initResize();
	}

	createGrid()
	{
		this.cols = 10;
		this.rows = 10;
		this.cellSize = 32;
		this.worldWidth = this.cols * this.cellSize;
		this.worldHeight = this.rows * this.cellSize;

		for (let row = 0; row < this.rows; row++)
		{
			for (let col = 0; col < this.cols; col++)
			{
				const wp = this.getWorldPosition(col, row);
				const rect = this.add.rectangle(wp.x, wp.y, this.cellSize, this.cellSize, 0x00ff00, 0.25);
				rect.setStrokeStyle(2, 0x000000, 1);
				rect.isStroked = true;
			}
		}
	}

	createChubrik(col = 0, row = 0)
	{
		const wp = this.getWorldPosition(col, row);
		const chubrik = this.add.sprite(wp.x, wp.y, Main.Key, Main.chubrik1).setScale(0.15);

		this.anims.create({
			key: 'chubrik',
			frames: this.anims.generateFrameNames(Main.Key, {
				start: 1,
				end: 4,
				prefix: "chubrik1_"
			}),
			skipMissedFrames: true,
			repeat: -1,
			frameRate: 6
		});

		chubrik.play("chubrik");
	}

	getWorldPosition(col: number, row: number)
	{
		return {
			x: col * this.cellSize - this.worldWidth * .5 + this.cellSize * .5,
			y: row * this.cellSize - this.worldWidth * .5 + this.cellSize * .5
		}
	}

	onResize(): void
	{
		this.camera.centerOn(0, 0);
	}
}