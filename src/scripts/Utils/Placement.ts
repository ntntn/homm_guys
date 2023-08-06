export class Placement
{
    static Grid(items: any[], config: { width: number, height: number, cellWidth: number, cellHeight: number, position: number })
    {
        Phaser.Actions.GridAlign(items, config);
        items.forEach(e => e.y -= e.getBounds().height * 3 * 0.5)
    }
}