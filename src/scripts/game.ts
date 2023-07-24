import 'phaser'
import { GAME_CONFIG, PhaserConfig } from '../config/PhaserConfig';

window.addEventListener('load', () =>
{
	const game = new Phaser.Game(PhaserConfig);

	const resize = () =>
	{
		const w = window.innerWidth
		const h = window.innerHeight

		let width = GAME_CONFIG.DEFAULT_WIDTH
		let height = GAME_CONFIG.DEFAULT_HEIGHT
		let maxWidth = GAME_CONFIG.MAX_WIDTH
		let maxHeight = GAME_CONFIG.MAX_HEIGHT

		if (w < h) {
			width = GAME_CONFIG.DEFAULT_HEIGHT;
			height = GAME_CONFIG.DEFAULT_WIDTH;
			
			maxWidth = GAME_CONFIG.MAX_HEIGHT;
			maxHeight = GAME_CONFIG.MAX_WIDTH;
		}
		else {
			width = GAME_CONFIG.DEFAULT_WIDTH;
			height = GAME_CONFIG.DEFAULT_HEIGHT;
			
			maxWidth = GAME_CONFIG.MAX_WIDTH;
			maxHeight = GAME_CONFIG.MAX_HEIGHT;
		}
		
		let scaleMode = GAME_CONFIG.SCALE_MODE

		let scale = Math.min(w / width, h / height)
		let newWidth = Math.min(w / scale, maxWidth)
		let newHeight = Math.min(h / scale, maxHeight)

		let defaultRatio = width / height
		let maxRatioWidth = maxWidth / height
		let maxRatioHeight = width / maxHeight

		// smooth scaling
		let smooth = 1
		if (scaleMode === 'SMOOTH')
		{
			const maxSmoothScale = 1.15
			const normalize = (value: number, min: number, max: number) =>
			{
				return (value - min) / (max - min)
			}
			if (width / height < w / h)
			{
				smooth =
					-normalize(newWidth / newHeight, defaultRatio, maxRatioWidth) / (1 / (maxSmoothScale - 1)) + maxSmoothScale
			} else
			{
				smooth =
					-normalize(newWidth / newHeight, defaultRatio, maxRatioHeight) / (1 / (maxSmoothScale - 1)) + maxSmoothScale
			}
		}

		// game.scale.emit('resize');
		// resize the game
		game.scale.resize(newWidth * smooth, newHeight * smooth)

		// scale the width and height of the css
		game.canvas.style.width = newWidth * scale + 'px'
		game.canvas.style.height = newHeight * scale + 'px'

		// center the game with css margin
		game.canvas.style.marginTop = `${(h - newHeight * scale) / 2}px`
		game.canvas.style.marginLeft = `${(w - newWidth * scale) / 2}px`
	}
	window.addEventListener('resize', event =>
	{
		resize()
	})
	resize()
});

(window as any).Phaser = Phaser;

