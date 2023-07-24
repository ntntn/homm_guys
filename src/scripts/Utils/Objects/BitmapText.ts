export class BitmapText extends Phaser.GameObjects.BitmapText {
    constructor(scene: Phaser.Scene, x: number, y: number, font: string, text?: string | string[] | undefined, size?: number | undefined, align?: number | undefined) {
        super(scene, x, y, font, text, size, align);
        scene.add.existing(this);
    }

    getBounds() {
        const wt = this.getWorldTransformMatrix();
        const rectData = this.getTextBounds().local;
        return new Phaser.Geom.Rectangle(wt.tx - rectData.width * 0.5, wt.ty - rectData.height * 0.5, rectData.width, rectData.height) as any;
    }

    private static list: BitmapText[] = [];
    private static scene: Phaser.Scene;
    static init(scene: Phaser.Scene)
    {
        BitmapText.list = [];
        BitmapText.scene = scene;
    }

    static get(x: number, y: number, font: string, text?: string | string[] | undefined, size?: number | undefined, align?: number | undefined)
    {
        let bitmapText = BitmapText.list.find(e => !e.active);
        if (!bitmapText)
        {
            // console.log('new bitmap', BitmapText.scene, x, y, font, text, size, align);
            bitmapText = new BitmapText(BitmapText.scene, x, y, font, text, size, align)
        }
        else
        {
            bitmapText.setPosition(x, y);
        }
		return bitmapText.setActive(true).setVisible(true).setAlpha(1).setScale(1).setText(text ?? '');
    }
}