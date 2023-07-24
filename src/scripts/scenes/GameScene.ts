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
	airChubrik: Phaser.GameObjects.Sprite;
	dragon: Phaser.GameObjects.Sprite;

	constructor()
	{
		super('GameScene');
		GameScene.instance = this;
		(window as any).GameScene = this;
	}

	create()
	{
		this.camera.setBackgroundColor("#212C36"); //цвет фона

		this.createGrid(); //создать поле
		this.createFireChubrik(); //создать огненного чубрика
		this.createWaterChubrik(); //создать водяного чубрика
		this.createEarthChubrik(); //создать земляного чубрика
		this.createAirChubrik(); //создать воздушного чубрика
		this.createDragon(); //создать дракона

		this.input.on("pointerdown", this.onClick, this); //отлавливание клика мышки

		this.initResize(); //неважно
	}

	createGrid()
	{
		this.cols = 16; //столбцы
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
				rect.setStrokeStyle(2, 0x838C88, .25); //неважно
				rect.isStroked = true; //неважно
				const frame = Phaser.Math.RND.pick([Main.grass1, Main.grass2, Main.grass3, Main.grass4]); //выбираем случайную картинку
				const grass = this.add.image(pos.x, pos.y, Main.Key, frame); //создаем травяную клеточку
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
			.play("fire_chubrik")
			.setDepth(1);

		this.currentChubrik = this.fireChubrik; //задаем чубрика чей ход
		this.drawRange(col, row); //отрисовываем дальность хода
	}

	createWaterChubrik(col = 0, row = 2)
	{
		const wp = this.getWorldPosition(col, row);
		this.waterChubrik = this.add.sprite(wp.x, wp.y, Main.Key, Main["water_chubrik (1)"]).setScale(0.2).setDepth(1);

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

	createEarthChubrik(col = 0, row = 4)
	{
		const wp = this.getWorldPosition(col, row);
		this.earthChubrik = this.add.sprite(wp.x, wp.y, Main.Key, Main["earth_chubrik (1)"]).setScale(0.2).setDepth(1);

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

	createAirChubrik(col = 0, row = 6)
	{
		const wp = this.getWorldPosition(col, row);
		this.airChubrik = this.add.sprite(wp.x, wp.y, Main.Key, Main["air_chubrik (1)"]).setScale(0.2).setDepth(1);

		this.anims.create({
			key: 'air_chubrik',
			frames: this.anims.generateFrameNames(Main.Key, {
				start: 1,
				end: 4,
				prefix: "air_chubrik (",
				suffix: ")"
			}),
			skipMissedFrames: true,
			repeat: -1,
			frameRate: 6
		});

		this.airChubrik.play("air_chubrik");
	}

	createDragon(col = 0, row = 8)
	{
		const wp = this.getWorldPosition(col, row);
		this.dragon = this.add.sprite(wp.x, wp.y, Main.Key, Main["dragon (1)"]).setScale(0.2).setDepth(1);

		this.anims.create({
			key: 'dragon',
			frames: this.anims.generateFrameNames(Main.Key, {
				start: 1,
				end: 4,
				prefix: "dragon (",
				suffix: ")"
			}),
			skipMissedFrames: true,
			repeat: -1,
			frameRate: 6
		});

		this.dragon.play("dragon");
	}

	onClick(ptr: Phaser.Input.Pointer)
	{
		const x = ptr.worldX;
		const y = ptr.worldY;
		const logicPos = this.getLogicPosition(x, y);
		const pos = this.getWorldPosition(logicPos.col, logicPos.row);

		if (!this.isValid(logicPos.col, logicPos.row)) return;
		console.log("onclick: ", x, y, logicPos)

		this.clearRange();
		this.tweens.add({
			targets: this.currentChubrik,
			x: pos.x,
			y: pos.y,
			duration: 500,
			onComplete: () =>
			{
				const chubriks = this.chubriks; //все чубрики
				const index = chubriks.indexOf(this.currentChubrik); //индекс текущего чубрика
				const nextIndex = wrap(index + 1, 0, chubriks.length); //инндекс следующего чубрика
				console.log(index, nextIndex);

				this.currentChubrik = chubriks[nextIndex]; //изменяем текущего чубрика на следующего
				const logicPos = this.getLogicPosition(this.currentChubrik.x, this.currentChubrik.y);
				this.drawRange(logicPos.col, logicPos.row); //отрисовываем дальность хода
			}
		});
	}

	get chubriks()
	{
		return [this.fireChubrik, this.waterChubrik, this.earthChubrik, this.airChubrik, this.dragon].filter(e => e);
	}

	range: Phaser.GameObjects.Rectangle[] = [];
	clearRange()
	{
		this.range.forEach(r => r.destroy());
	}
	drawRange(col: number, row: number, range = 4)
	{
		const pos = this.getWorldPosition(col, row);
		this.range.push(this.add.rectangle(pos.x, pos.y, this.cellSize, this.cellSize, 0xAEDAAA, 0.75));

		for (let r = row - range; r <= row + range; r++)
		{
			for (let c = col - range; c <= col + range; c++)
			{
				if (!this.isValid(c, r)) continue;

				if ((c - col) * (c - col) + (r - row) * (r - row) < range * range)
				{
					if (this.getChubrik(c, r)) continue;
					// point is in circle
					const pos = this.getWorldPosition(c, r);
					const rect = this.add.rectangle(pos.x, pos.y, this.cellSize, this.cellSize, 0xACC5DA, 0.25);
					this.range.push(rect);
				}

			}
		}
	}

	getChubrik(col: number, row: number)
	{
		const chubriks = this.chubriks; //все чубрики
		const wp = this.getWorldPosition(col, row);
		return chubriks.find(e => e.x == wp.x && e.y == wp.y /* && e != this.currentChubrik */);
	}

	isValid(col: number, row: number)
	{
		if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return false; //проверка что клетка внутри поля
		return true;
	}

	getWorldPosition(col: number, row: number)
	{
		return {
			x: Math.floor(col * this.cellSize - this.width * .5 + this.cellSize * .5),
			y: Math.floor(row * this.cellSize - this.height * .5 + this.cellSize * .5)
		}
	}

	getLogicPosition(x: number, y: number)
	{
		return {
			col: Math.floor((x + this.width * .5) / this.cellSize),
			row: Math.floor((y + this.height * .5) / this.cellSize)
		}
	}

	onResize(): void
	{
		this.camera.centerOn(0, 0);
	}
}