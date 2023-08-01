import { Main } from "../Assets";
import { addAsyncTween } from "../asyncTween";
import { CustomScene } from "../CustomScene";
import { Chubrik } from "./Chubrik";

const wrap = (num: number, min: number, max: number): number => ((((num - min) % (max - min)) + (max - min)) % (max - min)) + min;
(window as any).wrap = wrap;

export default class GameScene extends CustomScene
{
	static instance: GameScene;

	bloodParticle: Phaser.GameObjects.Particles.ParticleEmitter;

	cols: number;
	rows: number;
	cellSize: number;
	width: number;
	height: number;

	config: ChubrikConfig[];
	chubriks: Chubrik[];
	currentChubrik: Chubrik; // ТЕКУЩИЙ ЧУБРИК (ТОТ, ЧЕЙ ХОД)
	hero1: Phaser.GameObjects.Image;
	spellActive: boolean;
	spellBook: Phaser.GameObjects.Image;

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
		this.config = this.cache.json.get("Chubriks") as ChubrikConfig[];

		this.createAnims(); //анимации
		this.createBloodEmitter(); //излучатель частиц крови
		this.createGrid(); //создать поле

		this.chubriks = [
			new Chubrik(this, 0, 0, this.config.find(e => e.type === "fire_chubrik")!),
			new Chubrik(this, 0, 2, this.config.find(e => e.type === "water_chubrik")!),
			new Chubrik(this, 0, 4, this.config.find(e => e.type === "earth_chubrik")!),
			new Chubrik(this, 0, 6, this.config.find(e => e.type === "air_chubrik")!),
			new Chubrik(this, 0, 8, this.config.find(e => e.type === "dragon")!),
			new Chubrik(this, 15, 0, this.config.find(e => e.type === "water_dragon")!),
			new Chubrik(this, 15, 2, this.config.find(e => e.type === "earth_bender")!),
			new Chubrik(this, 15, 4, this.config.find(e => e.type === "air_bird")!),
			new Chubrik(this, 15, 6, this.config.find(e => e.type === "chertik")!),
			new Chubrik(this, 15, 8, this.config.find(e => e.type === "skeleton")!),
			new Chubrik(this, 15, 9, this.config.find(e => e.type === "air_mage")!),
		];

		this.currentChubrik = this.chubriks[0]; //задаем чубрика чей ход
		this.currentChubrik.drawRange(); //отрисовываем дальность хода

		const hero = this.add.image(-this.gameWidth * .5 + 50, -100, Main.Key, Main.air_hero).setScale(0.35)
		this.hero1 = this.add.image(this.gameWidth * .5 - 50, -100, Main.Key, Main.air_hero).setScale(0.35).setFlipX(true).setTint(0xEB4732);
		this.spellBook = this.add.image(-this.gameWidth * .5 + 25, 150, Main.Key, Main.spellbook).setAlpha(0.5).setInteractive().on("pointerdown", () =>
		{
			let active = this.spellBook.alpha === 1;
			this.spellBook.alpha = active ? 0.5 : 1;
			this.spellActive = !active;
		});

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
				if (Phaser.Math.Between(0, 100) < 3) this.add.image(pos.x, pos.y, Main.Key, Phaser.Math.RND.pick([Main.luzha, Main.stone])).setDepth(1);
			}
		}
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
			// cast spell
			if (this.spellActive)
			{
				const blackRect = this.add.rectangle(0, 0, this.gameWidth, this.gameHeight, 0x000000, 1).setAlpha(0).setDepth(30);
				await addAsyncTween(this, {
					targets: blackRect,
					alpha: 0.3,
					duration: 200
				});

				const lightning = this.add.sprite(existingChubrik.x, existingChubrik.y, Main.Key, Main["lightning (1)"]).play("lightning").setScale(0.5).setDepth(30);
				await this.waitFor(500);
				existingChubrik.takeDamage(10);

				await addAsyncTween(this, {
					targets: blackRect,
					alpha: 0,
					duration: 200
				});

				lightning.destroy();
				blackRect.destroy();
				this.spellActive = false;
				this.spellBook.alpha = 0.5;
				return;
			}


			this.input.enabled = false;
			await this.currentChubrik.attackAction(existingChubrik);
			this.input.enabled = true;
			return;
		}

		if (!this.isRangeValid(curLogicPos.col, curLogicPos.row, logicPos.col, logicPos.row)) return;

		this.input.enabled = false;
		await this.currentChubrik.moveAction(pos);
		this.onMoveEnd();
		this.input.enabled = true;
	}

	isRangeValid(fromCol: number, fromRow: number, col: number, row: number, range = 4)
	{
		const colDist = fromCol - col;
		const rowDist = fromRow - row;
		return colDist * colDist + rowDist * rowDist < range * range
	}

	onMoveEnd()
	{
		//Смена текущего чубрика
		const chubriks = this.chubriks; //все чубрики
		const index = chubriks.indexOf(this.currentChubrik); //индекс текущего чубрика
		const nextIndex = wrap(index + 1, 0, chubriks.length); //инндекс следующего чубрика

		this.currentChubrik = chubriks[nextIndex]; //изменяем текущего чубрика на следующего
		this.currentChubrik.drawRange(); //отрисовываем дальность хода
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


	createAnims()
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
			frameRate: 12
		});

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
			frameRate: 12
		});

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
			frameRate: 12
		});

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
			frameRate: 12
		});

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
			frameRate: 12
		});

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
			frameRate: 12
		});

		this.anims.create({
			key: 'earth_bender',
			frames: this.anims.generateFrameNames(Main.Key, {
				start: 1,
				end: 4,
				prefix: "earth_bender (",
				suffix: ")"
			}),
			skipMissedFrames: true,
			repeat: -1,
			frameRate: 12
		});

		this.anims.create({
			key: 'bird',
			frames: this.anims.generateFrameNames(Main.Key, {
				start: 1,
				end: 4,
				prefix: "bird (",
				suffix: ")"
			}),
			skipMissedFrames: true,
			repeat: -1,
			frameRate: 12
		});

		this.anims.create({
			key: 'skeleton',
			frames: this.anims.generateFrameNames(Main.Key, {
				start: 1,
				end: 4,
				prefix: "skeleton (",
				suffix: ")"
			}),
			skipMissedFrames: true,
			repeat: -1,
			frameRate: 12
		});

		this.anims.create({
			key: 'chertik',
			frames: this.anims.generateFrameNames(Main.Key, {
				start: 1,
				end: 4,
				prefix: "chertik (",
				suffix: ")"
			}),
			skipMissedFrames: true,
			repeat: -1,
			frameRate: 12
		});

		this.anims.create({
			key: 'air_mage',
			frames: this.anims.generateFrameNames(Main.Key, {
				start: 1,
				end: 4,
				prefix: "air_mage (",
				suffix: ")"
			}),
			skipMissedFrames: true,
			repeat: -1,
			frameRate: 12
		});

		this.anims.create({
			key: 'air_chubrik_patron',
			frames: this.anims.generateFrameNames(Main.Key, {
				start: 1,
				end: 5,
				prefix: "air_chubrik_patron (",
				suffix: ")"
			}),
			skipMissedFrames: true,
			repeat: -1,
			frameRate: 12
		});

		this.anims.create({
			key: 'fire_chubrik_patron',
			frames: this.anims.generateFrameNames(Main.Key, {
				start: 1,
				end: 5,
				prefix: "fire_chubrik_patron (",
				suffix: ")"
			}),
			skipMissedFrames: true,
			repeat: -1,
			frameRate: 12
		});

		this.anims.create({
			key: 'lightning',
			frames: this.anims.generateFrameNames(Main.Key, {
				start: 1,
				end: 10,
				prefix: "lightning (",
				suffix: ")"
			}),
			skipMissedFrames: true,
			frameRate: 12
		});
	}
}