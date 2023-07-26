import { Main } from "../Assets";
import { addAsyncTween } from "../asyncTween";
import { CustomScene } from "../CustomScene";

const wrap = (num: number, min: number, max: number): number => ((((num - min) % (max - min)) + (max - min)) % (max - min)) + min;
(window as any).wrap = wrap;

type Position = { x: number, y: number }

type Chubrik = Phaser.GameObjects.Sprite;

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
	water_dragon: Phaser.GameObjects.Sprite;
	bloodParticle: Phaser.GameObjects.Particles.ParticleEmitter;

	constructor()
	{
		super('GameScene');
		GameScene.instance = this;
		(window as any).GameScene = this;
	}

	create()
	{
		(window as any).game = this;
		this.camera.setBackgroundColor("#212C36"); //цвет фона

		this.createGrid(); //создать поле
		this.createFireChubrik();
		this.createWaterChubrik();
		this.createEarthChubrik();
		this.createAirChubrik();
		this.createDragon();
		this.createWaterDragon();
		this.createBloodEmitter();

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

	createWaterDragon(col = 0, row = 9)
	{
		const wp = this.getWorldPosition(col, row);
		this.water_dragon = this.add.sprite(wp.x, wp.y, Main.Key, Main["water_dragon (1)"]).setScale(0.2).setDepth(1);

		this.anims.create({
			key: 'water_dragon',
			frames: this.anims.generateFrameNames(Main.Key, {
				start: 1,
				end: 4,
				prefix: "water_dragon (",
				suffix: ")"
			}),
			skipMissedFrames: true,
			repeat: -1,
			frameRate: 6
		});

		this.water_dragon.play("water_dragon");
	}

	createBloodEmitter()
	{
		this.bloodParticle = this.add.particles(0, 0, Main.Key, {
			frame: Main.blood,
			speedX: {
				random: [16, 48]
			},
			speedY: {
				random: [8, 48]
			},
			lifespan: {
				random: [500, 1000]
			},
			scale: 0.2,
			alpha: {
				start: 1.0,
				end: 0.0
			},
			tint: 0xFDD3F1,
			quantity: 2,
			frequency: 100,
			// blendMode: "ADD"
		}).stop().setDepth(12);
	}

	async onClick(ptr: Phaser.Input.Pointer)
	{
		const x = ptr.worldX;
		const y = ptr.worldY;
		const curLogicPos = this.getLogicPosition(this.currentChubrik.x, this.currentChubrik.y);
		const logicPos = this.getLogicPosition(x, y);
		const pos = this.getWorldPosition(logicPos.col, logicPos.row);

		if (!this.isValid(logicPos.col, logicPos.row)) return;
		console.log("onclick: ", x, y, logicPos)

		const existingChubrik = this.getChubrik(logicPos.col, logicPos.row);
		if (existingChubrik === this.currentChubrik) return;

		if (existingChubrik)
		{
			const leftCellExists = this.isValid(logicPos.col - 1, logicPos.row);
			if (leftCellExists)
			{
				const pos = this.getWorldPosition(logicPos.col - 1, logicPos.row);
				if (!this.isRangeValid(curLogicPos.col, curLogicPos.row, logicPos.col - 1, logicPos.row)) return;
				await this.move(pos);
				await this.attack(this.currentChubrik, existingChubrik);
				this.onMoveEnd();
			}
			return;
		}

		if (!this.isRangeValid(curLogicPos.col, curLogicPos.row, logicPos.col, logicPos.row)) return;

		this.move(pos);
		this.onMoveEnd();
	}

	isRangeValid(fromCol: number, fromRow: number, col: number, row: number, range = 4)
	{
		const colDist = fromCol - col;
		const rowDist = fromRow - row;
		return colDist * colDist + rowDist * rowDist < range * range
	}

	async move(pos: Position)
	{
		this.clearRange();
		await addAsyncTween(this, {
			targets: this.currentChubrik,
			x: pos.x,
			y: pos.y,
			duration: 500,
		});
	}

	onMoveEnd()
	{
		const chubriks = this.chubriks; //все чубрики
		const index = chubriks.indexOf(this.currentChubrik); //индекс текущего чубрика
		const nextIndex = wrap(index + 1, 0, chubriks.length); //инндекс следующего чубрика
		console.log(index, nextIndex);

		this.currentChubrik = chubriks[nextIndex]; //изменяем текущего чубрика на следующего
		const logicPos = this.getLogicPosition(this.currentChubrik.x, this.currentChubrik.y);
		this.drawRange(logicPos.col, logicPos.row); //отрисовываем дальность хода
	}

	async attack(chubrik1: Chubrik, chubrik2: Chubrik)
	{
		await addAsyncTween(this, {
			targets: chubrik1,
			x: chubrik2.x - chubrik2.displayWidth * .4,
			y: chubrik2.y,
			delay: 150,
			duration: 150,
			ease: "Ease.Sine.InOut",
			yoyo: true,
			onYoyo: () =>
			{
				chubrik2.setTintFill(0xffffff);
				this.time.delayedCall(100, () => chubrik2.clearTint());

				const text = this.add.text(chubrik2.x, chubrik2.y, "-15").setOrigin(0.5).setAlign("center").setDepth(10);
				this.add.tween({
					targets: text,
					y: `-=${this.cellSize}`,
					alpha: 0,
				});

				this.bloodParticle.explode(10, chubrik2.x, chubrik2.y);
			}
		});
	}

	get chubriks()
	{
		return [this.fireChubrik, this.waterChubrik, this.earthChubrik, this.airChubrik, this.dragon, this.water_dragon].filter(e => e);
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

				const dist = (c - col) * (c - col) + (r - row) * (r - row);
				if (dist < range * range)
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

	isInRange(col: number, row: number, range = 4)
	{
		return col * col + row * row < range * range
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