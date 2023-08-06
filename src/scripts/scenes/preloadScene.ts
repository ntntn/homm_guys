import { Animations, Atlases, Characters, Effects, Enemies, Environment, Main, resources } from "../Assets";

export default class PreloadScene extends Phaser.Scene
{
	constructor()
	{
		super({ key: 'PreloadScene' })
	}

	preload()
	{
		Object.entries(resources.images).forEach(e =>
		{
			const key = e[0];
			const url = e[1];
			this.load.image(key, url);
		});

		Object.entries(resources.atlases).forEach(e =>
		{
			const key = e[0];
			const data = e[1];
			this.load.atlas(key, `assets/atlases/${data.image}`, `assets/atlases/${data.json}`);
		});

		Object.entries(resources.audios).forEach(e =>
		{
			const key = e[0];
			const url = e[1];
			this.load.audio(key, url);
		});

		Object.entries(resources.jsons).forEach(e =>
		{
			const key = e[0];
			const url = e[1];
			this.load.json(key, url);
		});

		this.load.bitmapFont('nokia16', 'assets/fonts/bitmapFonts/nokia16.png', 'assets/fonts/bitmapFonts/nokia16.xml');
	}

	create()
	{
		this.createAnims();
		this.scene.start('MenuScene');
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