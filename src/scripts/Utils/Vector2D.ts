import { PerpendicularClockwise } from "./common";

export type Point2D = { x: number, y: number }

export class Vector2D
{
    x: number;
    y: number;
    constructor(x: number, y: number)
    {
        [this.x, this.y] = [x, y];
    }

    length()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lengthSqr()
    {
        return this.x * this.x + this.y * this.y;
    }

    normalized()
    {
        const length = this.length();
        if (length === 0) return new Vector2D(0, 0);
        return new Vector2D(this.x / length, this.y / length);
    }

    static dotProduct(v1: Vector2D, v2: Vector2D)
    {
        return v1.x * v2.x + v1.y * v2.y;
    }

    subtract(v: { x: number, y: number })
    {
        return new Vector2D(this.x - v.x, this.y - v.y);
    }

    static getParallelShotLines(origin: Vector2D, distance: Vector2D, parallelShots: number, parallelLineLengthMultiplier: number)
    {
        const directionLines: Phaser.Geom.Line[] = [];
        const direction = new Vector2D(distance.x, distance.y).normalized();

        const normal = PerpendicularClockwise(direction);
        const multiplier = parallelLineLengthMultiplier * parallelShots;

        normal.x *= multiplier;
        normal.y *= multiplier;

        const point1 = { x: origin.x + normal.x, y: origin.y + normal.y }
        const point2 = { x: origin.x - normal.x, y: origin.y - normal.y }

        const parallelShotsLine = new Phaser.Geom.Line(point1.x, point1.y, point2.x, point2.y);

        // this.graphics?.lineStyle(4, 0xcf0013).setDepth(9999999).strokeLineShape(parallelShotsLine);

        let progress = 0;
        const delta = 1 / (parallelShots);

        for (let i = 0; i <= parallelShots; i++)
        {
            const point = parallelShotsLine.getPoint(progress);
            progress += delta;
            const shootDirectionLine = new Phaser.Geom.Line(point.x, point.y, point.x + distance.x, point.y + distance.y);
            directionLines.push(shootDirectionLine);

            // this.graphics?.lineStyle(4, 0x00ffc0).setDepth(9999999).strokeLineShape(shootDirectionLine);
        };

        return directionLines;
    }

    static DirTowards(from: Point2D, to: Point2D)
    {
        return new Vector2D(to.x - from.x, to.y - from.y).normalized();
    }

    static magnitude(point1: { x: number, y: number }, point2 = { x: 0, y: 0 })
    {
        return new Vector2D(point2.x - point1.x, point2.y - point1.y).length();
    }
}