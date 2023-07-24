import { CustomScene } from "../CustomScene";

export default class GameScene extends CustomScene {
	static instance: GameScene;

	constructor() {
		super('GameScene');
		GameScene.instance = this;
		(window as any).GameScene = this;
	}

	create() {
		const gridSize = 10; // 10x10
		const cellSize = 32;
		const worldSize = gridSize * cellSize;
		for (let i = 0; i < gridSize * gridSize; i++) {
			const col = i % gridSize;
			const row = Math.floor(i / gridSize);
			console.log(col, row);
			const x = col * cellSize - worldSize * .5 + cellSize * .5; //относительно 0
			const y = row * cellSize - worldSize * .5 + cellSize * .5; //относительно 0
			const rect = this.add.rectangle(x, y, cellSize, cellSize, 0x00ff00, 0.25);
			rect.setStrokeStyle(2, 0x000000, 1);
			rect.isStroked = true;
		}

		this.add.rectangle(0, 0, cellSize, cellSize, 0xff0000, 0.25);
		this.show();
		this.initResize();
	}

	onResize(): void {
		this.camera.centerOn(0, 0);
	}
}