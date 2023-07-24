import { Container, Sprite } from "./Utils/Alias";
import { Distribute } from "./Utils/Distribute";
import { BitmapText } from "./Utils/Objects/BitmapText";

export class CustomScene extends Phaser.Scene
{
	get camera() { return this.cameras.main; }

	get gameWidth()
    {
        if (this && this.game && this.game.scale) return this.game.scale.width;
        return 0;
    }

    get gameHeight()
    {
        if (this && this.game && this.game.scale) return this.game.scale.height;
        return 0;
    }

	constructor(key: string)
	{
		super(key);
	}

	initResize()
	{
		this.camera.centerOn(0, 0);

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () =>
		{
			this.scale.off('resize');
		});

		this.scale.on('resize', this.onResize, this);
		this.onResize();
	}
	onResize() { }

	evCache = [];
	initCameraMovement()
	{
		let ptrdown = false; //camera movement

		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) =>
		{
			if (!pointer.middleButtonDown()) return;
			if (this.evCache.length >= 2) return;
			ptrdown = true;
		});

		this.input.on('pointermove', () =>
		{
			if (this.evCache.length >= 2) return;
			if (!ptrdown) return;

			let dx = this.input.activePointer.position.x - this.input.activePointer.prevPosition.x;
			let dy = this.input.activePointer.position.y - this.input.activePointer.prevPosition.y;

			dx *= this.game.loop.delta * 0.01 * 5;
			dy *= this.game.loop.delta * 0.01 * 5;

			let scrollX = this.camera.scrollX - dx;
			let scrollY = this.camera.scrollY - dy;

			this.camera.setScroll(scrollX, scrollY);
		});

		this.input.on('pointerup', (pointer: Phaser.Input.Pointer) =>
		{
			if (!pointer.middleButtonReleased()) return;
			if (this.evCache.length >= 2) return;
			ptrdown = false;
		});

		this.input.on(Phaser.Input.Events.GAME_OUT, () =>
		{
			// console.log('GAME_OUT');
			ptrdown = false;
		});
	}

	initCameraZoom(delta = 0.001)
	{
		this.input.on('wheel', (pointer: Phaser.Input.Pointer) =>
		{
			this.cameras.main.zoom -= pointer.deltaY * delta;
		});
	}

	enableDragDebug()
	{
		this.input.on('drag', function (pointer, gameObject, dragX, dragY)
		{
			gameObject.x = dragX;
			gameObject.y = dragY;
		});
		this.events.on(Phaser.Scenes.Events.ADDED_TO_SCENE, (obj) =>
		{
			if (!(obj instanceof Phaser.GameObjects.Sprite)) return;
			try
			{
				obj.setInteractive({ useHandCursor: false }).on('pointerup', () =>
				{
					(window as any).obj = obj;
				});
				this.input.setDraggable(obj, true);
			}
			catch (e)
			{
				console.error(e);
			}
		});
	}

	enableContextDebug() {
		document.onclick = hideMenu;
        document.oncontextmenu = rightClick;

        function hideMenu() {
            document.getElementById("contextMenu")!
                .style.display = "none"
        }

		let clickedObj: Sprite | undefined = undefined;

        function rightClick(e) {
            e.preventDefault();
			if (!clickedObj) return;

            if (document.getElementById("contextMenu")!.style.display == "block") {
                hideMenu();
            } else {
				
                var menu = document.getElementById("contextMenu")!;
                menu.style.display = 'block';
                menu.style.left = e.pageX + "px";
                menu.style.top = e.pageY + "px";
            }
        }
	
		document.getElementsByClassName('Scale')[0].addEventListener('click', () => {
			const scale = parseFloat(prompt('Enter value') ?? '1');
			clickedObj?.setScale(scale);
		})
	
		document.getElementsByClassName('Flip')[0].addEventListener('click', () => {
			console.log('clickedobj flip: ', clickedObj?.flipX)
			clickedObj?.setFlipX(!clickedObj.flipX);
		})
	
		document.getElementsByClassName('Destroy')[0].addEventListener('click', () => {
			clickedObj?.destroy();
		})

		this.events.on(Phaser.Scenes.Events.ADDED_TO_SCENE, (obj) =>
		{
			if (!(obj instanceof Phaser.GameObjects.Sprite)) return;
			try
			{
				let menu: Container | undefined = undefined;
				
				obj.setInteractive({ useHandCursor: false }).on('pointerup', (poitner: Phaser.Input.Pointer) =>
				{	
					if (poitner.rightButtonReleased()) {
						
						console.log('rmb');
						menu?.destroy();
						// this.add.container(obj.x, obj.y, Distribute.AsColumn([
						// 	new BitmapText(this, 0, 0, 'nokia16', 'scale').setInteractive().on('pointerdown', () => {

						// 	}),
						// 	new BitmapText(this, 0, 0, 'nokia16', 'flip').setInteractive().on('pointerdown', () => {
		
						// 	}),
						// ], 4))
						clickedObj?.setTintFill(0xffffff);
						this.time.delayedCall(175, () => clickedObj?.clearTint());
						clickedObj = obj;
						console.log('clickedobj: ', clickedObj)
					}
					(window as any).obj = obj;
				}).on('pointerout', () => { console.log('out'); clickedObj = undefined; });
				this.input.setDraggable(obj, true);
			}
			catch (e)
			{
				console.error(e);
			}
		});
	}

	show(duration = 250)
	{
		return new Promise<void>(res =>
		{
			this.camera.setAlpha(0);
			this.tweens.add({
				targets: this.camera,
				alpha: 1,
				duration: duration,
				ease: 'Linear',
				onComplete: () =>
				{
					res();
				}
			})
		});
	}

	async hide(cb?: Function, duration = 500)
	{
		if (!this) return;
		if (this.scene.isPaused()) this.scene.resume();
		return new Promise<void>(res =>
		{
			this.tweens.add({
				targets: this.camera,
				alpha: 0,
				duration: duration,
				ease: 'Quint',
				onComplete: () =>
				{
					cb?.();
					res();
				},
			});
		});
	}

	get view()
	{
		if (this && this.cameras && this.cameras.main)
		{
			const camera = this.cameras.main;
			const sy_cy = camera.scrollY + camera.centerY;
			const sx_cx = camera.scrollX + camera.centerX;
			const cy_zy = camera.centerY / camera.zoomY;
			const cx_zx = camera.centerX / camera.zoomX;

			const top = sy_cy - cy_zy;
			const bottom = sy_cy + cy_zy;
			const left = sx_cx - cx_zx;
			const right = sx_cx + cx_zx;

			return new Phaser.Geom.Rectangle(left, top, right - left, bottom - top);
		}

		return new Phaser.Geom.Rectangle(0, 0, 0, 0);
	}

	async waitFor(delay: number)
	{
		return new Promise<void>(resolve =>
		{
			this.time.delayedCall(delay, () =>
			{
				resolve();
			});
		});
	}

	getBounds()
    {
        if (this && this.cameras && this.cameras.main)
        {
            const camera = this.cameras.main;
            const sy_cy = camera.scrollY + camera.centerY;
            const sx_cx = camera.scrollX + camera.centerX;
            const cy_zy = camera.centerY / camera.zoomY;
            const cx_zx = camera.centerX / camera.zoomX;

            const top = sy_cy - cy_zy;
            const bottom = sy_cy + cy_zy;
            const left = sx_cx - cx_zx;
            const right = sx_cx + cx_zx;

            return new Phaser.Geom.Rectangle(left, top, right - left, bottom - top);
        }

        return new Phaser.Geom.Rectangle(0, 0, 0, 0);
    }
}