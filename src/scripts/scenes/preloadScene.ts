import { Animations, Atlases, Characters, Effects, Enemies, Environment, resources } from "../Assets";

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

		this.load.bitmapFont('nokia16', 'assets/fonts/bitmapFonts/nokia16.png', 'assets/fonts/bitmapFonts/nokia16.xml');
	}

	create()
	{
		this.scene.start('MenuScene');
	}
}