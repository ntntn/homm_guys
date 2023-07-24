import { Main } from "../Assets";
import { CustomScene } from "../CustomScene";

const wrap = (num: number, min: number, max: number): number => ((((num - min) % (max - min)) + (max - min)) % (max - min)) + min;
(window as any).wrap = wrap;

export default class GameScene extends CustomScene
{
	static instance: GameScene;
	cols: number;
	rows: number;
	cellSize: number;
	width: number;
	height: number;

	currentChubrik: Phaser.GameObjects.Sprite; // ТЕКУЩИЙ ЧУБРИК (ТОТ, ЧЕЙ ХОД)
	waterChubrik: Phaser.GameObjects.Sprite;
	fireChubrik: Phaser.GameObjects.Sprite;
	earthChubrik: any;

	constructor()
	{
		super('GameScene');
		GameScene.instance = this;
		(window as any).GameScene = this;
	}

	create()
	{
		this.createGrid(); //создать поле
		this.createFireChubrik(); //создать огненного чубрика
		this.createWaterChubrik(); //создать водяного чубрика
		this.createEarthChubrik(); //создать земляного чубрика
		this.input.on("pointerdown", this.onClick, this); //отлавливание клика мышки

		this.initResize(); //неважно
	}

	createGrid()
	{
		this.cols = 10; //столбцы
		this.rows = 10; //строчки
		this.cellSize = 32; //размер одной клетки в пикселях
		this.width = this.cols * this.cellSize; //ширина доски в пикселях
		this.height = this.rows * this.cellSize; //высота доски в пикселях

		for (let row = 0; row < this.rows; row++) //по каждой строчке
		{
			for (let col = 0; col < this.cols; col++) //по каждому столбцу
			{
				const pos = this.getWorldPosition(col, row); //получаем позицию в пикселях по столбцу и строке
				const rect = this.add.rectangle(pos.x, pos.y, this.cellSize, this.cellSize, 0x00ff00, 0.25); //создаем прямоугольник в полученных координатах
				rect.setStrokeStyle(2, 0x000000, 1); //неважно
				rect.isStroked = true; //неважно
			}
		}
	}

	createFireChubrik(col = 0, row = 0)
	{
		this.anims.create({
			key: 'fire_chubrik',
			frames: this.anims.generateFrameNames(Main.Key, {
				start: 1,
				end: 4,
				prefix: "fire_chubrik (",
				suffix: ")"
			}),
			skipMissedFrames: true,
			repeat: -1,
			frameRate: 6
		});

		const pos = this.getWorldPosition(col, row);
		this.fireChubrik = this.add.sprite(pos.x, pos.y, Main.Key, Main.chubrik1)
			.setScale(0.15)
			.play("fire_chubrik");

		this.currentChubrik = this.fireChubrik; //задаем чубрика чей ход
	}

	createWaterChubrik(col = 9, row = 9)
	{
		const wp = this.getWorldPosition(col, row);
		this.waterChubrik = this.add.sprite(wp.x, wp.y, Main.Key, Main["water_chubrik (1)"]).setScale(0.2);

		this.anims.create({
			key: 'water_chubrik',
			frames: this.anims.generateFrameNames(Main.Key, {
				start: 1,
				end: 4,
				prefix: "water_chubrik (",
				suffix: ")"
			}),
			skipMissedFrames: true,
			repeat: -1,
			frameRate: 6
		});

		this.waterChubrik.play("water_chubrik");
	}

	createEarthChubrik(col = 5, row = 5)
	{
		const wp = this.getWorldPosition(col, row);
		this.earthChubrik = this.add.sprite(wp.x, wp.y, Main.Key, Main["earth_chubrik (1)"]).setScale(0.2);

		this.anims.create({
			key: 'earth_chubrik',
			frames: this.anims.generateFrameNames(Main.Key, {
				start: 1,
				end: 4,
				prefix: "earth_chubrik (",
				suffix: ")"
			}),
			skipMissedFrames: true,
			repeat: -1,
			frameRate: 6
		});

		this.earthChubrik.play("earth_chubrik");
	}

	onClick(ptr: Phaser.Input.Pointer)
	{
		const x = ptr.worldX;
		const y = ptr.worldY;
		const logicPos = this.getLogicPosition(x, y);
		const pos = this.getWorldPosition(logicPos.col, logicPos.row);

		this.tweens.add({
			targets: this.currentChubrik,
			x: pos.x,
			y: pos.y,
			duration: 500,
			onComplete: () =>
			{
				const chubriks = [this.fireChubrik, this.waterChubrik, this.earthChubrik]; //все чубрики
				const index = chubriks.indexOf(this.currentChubrik); //индекс текущего чубрика
				const nextIndex = wrap(index + 1, 0, chubriks.length); //инндекс следующего чубрика
				console.log(index, nextIndex);
				this.currentChubrik = chubriks[nextIndex]; //изменяем текущего чубрика на следующего
			}
		});
	}



	getWorldPosition(col: number, row: number)
	{
		return {
			x: col * this.cellSize - this.width * .5 + this.cellSize * .5,
			y: row * this.cellSize - this.width * .5 + this.cellSize * .5
		}
	}

	getLogicPosition(x: number, y: number)
	{
		return {
			col: Math.floor((x + this.width * .5) / this.cellSize),
			row: Math.floor((y + this.width * .5) / this.cellSize)
		}
	}

	onResize(): void
	{
		this.camera.centerOn(0, 0);
	}
}