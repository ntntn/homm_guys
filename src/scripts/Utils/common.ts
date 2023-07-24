import { CustomScene } from "../CustomScene";
import { Point2D, Vector2D } from "./Vector2D";

export function loadCSS(src: string)
{
    return new Promise((res, rej) =>
    {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', src);
        xhr.send();
        xhr.onprogress = (arg) =>
        {
            const data = document.createElement('style');
            data.innerHTML = xhr.responseText;
            document.head.appendChild(data);
            res(xhr.responseText);
        };
    })
}

export function PerpendicularClockwise(vector: Vector2D)
{
    return new Vector2D(vector.y, -vector.x);
}

export function PerpendicularCounterClockwise(vector: { x: number, y: number })
{
    return new Vector2D(-vector.y, vector.x);
}

export function PointAtDistanceByAngle(center: { x: number, y: number }, distance: number, angle: number)
{
    return {
        x: center.x + Math.cos(angle) * distance,
        y: center.y + Math.sin(angle) * distance
    };
}

export function randomDirection()
{

    // var angle = Math.random() * Math.PI * 2;
    // return new Vector2D(Math.cos(angle), Math.sin(angle)).normalized(); //!??

    let vx = Math.random()
    let vy = Math.random()

    const norm = Math.sqrt(vx * vx + vy * vy)
    vx = vx / norm
    vy = vy / norm

    if (Phaser.Math.Between(0, 1) == 0)
    {
        vx = -vx
    }

    if (Phaser.Math.Between(0, 1) == 0)
    {
        vy = -vy
    }

    return new Vector2D(vx, vy);
}

export function pointInRadius(point: Vector2D, distance: number)
{
    var angle = Math.random() * Math.PI * 2;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return new Vector2D(x, y);
}

export function getQueryParam(item: string)
{
    var svalue = window.location.search.match(new RegExp('[\?\&]' + item + '=([^\&]*)(\&?)', 'i'));
    return svalue ? svalue[1] : svalue;
}

export function enableClickEvent<T>(t: T)
{
    const target = t as any;

    target.on('pointerdown', () => target.setData('pointerdown', true));
    target.on('pointerout', () => target.setData('pointerdown', false));
    target.on('pointerup', () =>
    {
        if (target.getData('pointerdown') === true)
        {
            target.setData('pointerdown', false);
            target.emit('click');
        }
    });

    return target as T;
}

export function KillTweenByProperty(target: Object & { scene: (Phaser.Scene | CustomScene) }, property: string, completeOnStop?: boolean)
{
    target.scene.tweens.getTweensOf(target).filter(tween =>
    {
        return tween.data.some(data => data.key === property);
    }).forEach((tween) =>
    {
        if (completeOnStop === true) tween.complete();
        tween.stop();
    });
}

export const msToHHMMSS = (ms: number) =>
{
    ms /= 1000;
    ms = Math.floor(ms);
    const seconds = (ms % 60);
    const minutes = Math.floor(ms / 60) % 60;
    const hours = Math.floor(ms / 3600);
    return [
        hours.toFixed().padStart(2, '0'),
        minutes.toFixed().padStart(2, '0'),
        seconds.toFixed().padStart(2, '0'),
    ].join(':');
}


export function calcObjectsBoundingBox(objects: ({ getBounds: () => Phaser.Geom.Rectangle, x: number, y: number })[])
{
    if (objects.length === 0) return new Phaser.Geom.Rectangle(0, 0, 0, 0);

    const xSorted = objects.sort((a, b) => a.x - b.x);
    const ySorted = objects.sort((a, b) => a.y - b.y);

    let min_x = xSorted[0].x;
    let max_x = xSorted[xSorted.length - 1].x;
    let min_y = ySorted[0].y;
    let max_y = ySorted[ySorted.length - 1].y;

    if (objects)
        objects.forEach(e =>
        {
            const b = e instanceof Phaser.Geom.Rectangle ? e : e.getBounds();
            const childMinX = b.left;
            const childMinY = b.top;
            const childMaxX = b.right;
            const childMaxY = b.bottom;
            if (childMinX < min_x) min_x = childMinX;
            if (childMinY < min_y) min_y = childMinY;
            if (childMaxX > max_x) max_x = childMaxX;
            if (childMaxY > max_y) max_y = childMaxY;
        })

    const bounds = new Phaser.Geom.Rectangle(min_x, min_y, max_x - min_x, max_y - min_y);
    return bounds;
}

function repeat(t: number, m: number)
{
    return Phaser.Math.Clamp(t - Math.floor(t / m) * m, 0, m);
}

function lerp(start: number, end: number, t: number)
{
    return start * (1 - t) + end * t;
}


export function angleLerp(a: number, b: number, t: number)
{
    const dt = repeat(b - a, 360);
    return lerp(a, a + (dt > 180 ? dt - 360 : dt), t);
}

export function getDistance(point1: Point2D, point2: Point2D)
{
    return new Phaser.Math.Vector2(point2.x - point1.x, point2.y - point1.y);
}

export function getDisplayRect(obj: any)
{
    return new Phaser.Geom.Rectangle(obj.x - obj.displayWidth * 0.5, obj.y - obj.displayHeight * 0.5, obj.displayWidth, obj.displayHeight);
}

export function getCameraRect(camera: Phaser.Cameras.Scene2D.Camera, scale = 1)
{
    const w = camera.width * scale;
    const h = camera.height * scale;
    return new Phaser.Geom.Rectangle(camera.midPoint.x - w * 0.5, camera.midPoint.y - h * 0.5, w, h);
}

export function ArrToMap(arr: string[])
{
    const map = {} as Record<string, string>;
    arr.forEach(e => map[e] = e);
    return map;
}

export var rotateVector = function (vec, ang)
{
    ang = -ang * (Math.PI / 180);
    var cos = Math.cos(ang);
    var sin = Math.sin(ang);
    return { x: Math.round(10000 * (vec.x * cos - vec.y * sin)) / 10000, y: Math.round(10000 * (vec.x * sin + vec.y * cos)) / 10000 };
};

export function getClosest<T extends { x: number, y: number }>(point: { x: number, y: number }, entities: T[])
{
    if (entities.length === 0) return undefined;

    let minMagnitude = Number.MAX_VALUE;
    let minEntity = entities[0];
    let minIndex = 0;

    for (let i = 0, j = entities.length; i < j; i++)
    {
        const e = entities[i];
        
        if (e == undefined) continue;
        if (e.x === point.x && e.y === point.y) return { obj: e, index: i, magnitude: 0 };

        const magnitude = Vector2D.magnitude(point, e);

        if (magnitude < minMagnitude)
        {
            minMagnitude = magnitude;
            minEntity = e;
            minIndex = i;
        }
    }

    return { obj: minEntity, index: minIndex, magnitude: minMagnitude };
}