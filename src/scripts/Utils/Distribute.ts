import { CustomScene } from "../CustomScene";
import { Container } from "./Objects/Container";

export type Distributable = { x: number, y: number, getBounds: () => Phaser.Geom.Rectangle, setPosition: (x: number, y: number) => any, parentContainer?: Container } & Phaser.GameObjects.GameObject & { scene: CustomScene | Phaser.Scene }

function GetRealBounds(object: Distributable)
{
    const parent = object.parentContainer;

    if (!parent) return object?.getBounds?.() ?? (object as any)?.getTextBounds().local;

    const index = parent.getIndex(object);
    parent.removeAt(index);
    const bounds = object?.getBounds?.() ?? (object as any)?.getTextBounds().local;
    parent.addAt(object, index);

    return bounds;
}

const _Distribute = {
    AsColumn: (objects: (Distributable[]), gap: number | number[], x: number = 0, y: number = 0) => {
        if (objects.length === 0) return[];
        objects = objects.filter(o => o !== undefined);

        if (objects.length === 1)
        {
            objects[0].setPosition(x, y);
            return [];
        }

        let containerHeight = 0;
        const heightArray: number[] = [];
        const boundsArray: Phaser.Geom.Rectangle[] = [];
        const centerOffsets: number[] = [];

        if (!(gap instanceof Array)) gap = [gap];

        for (let i = 0; i < objects.length; i++)
        {
            const object = objects[i];
            const objectBounds = GetRealBounds(object);
            const objectHeight = objectBounds.height;
            const centerOffset = object.y - objectBounds.centerY;

            heightArray.push(objectHeight);
            boundsArray.push(objectBounds);
            centerOffsets.push(centerOffset);

            containerHeight += objectHeight;

            if (i !== 0) containerHeight += gap[(i - 1) % gap.length];

            object.setPosition(0, 0);
        }

        let nextY = y - containerHeight * 0.5;

        for (let i = 0; i < objects.length; i++)
        {
            const object = objects[i];
            const halfObjectHeight = heightArray[i] * 0.5;
            const _gap = i !== 0 ? gap[(i - 1) % gap.length] : 0;
            const centerOffset = centerOffsets[i];

            object.y = nextY + halfObjectHeight + _gap + centerOffset;
            object.x = x;

            nextY = object.y + halfObjectHeight - centerOffset;
        }

        return objects;
    },

    AsRow: (objects: Distributable[], gap: number | number[], x: number = 0, y: number = 0) => {
        if (objects.length === 0) return objects;
        objects = objects.filter(o => o !== undefined);

        if (objects.length === 1)
        {
            objects[0].setPosition(x, y);
            return objects;
        }

        let containerWidth = 0;
        const widthArray: number[] = [];
        const boundsArray: Phaser.Geom.Rectangle[] = [];
        const centerOffsets: number[] = [];

        if (!(gap instanceof Array)) gap = [gap];

        for (let i = 0; i < objects.length; i++)
        {
            const object = objects[i];
            const objectBounds = GetRealBounds(object);
            const objectWidth = objectBounds.width;
            const centerOffset = object.x - objectBounds.centerX;

            widthArray.push(objectWidth);
            boundsArray.push(objectBounds);
            centerOffsets.push(centerOffset);

            containerWidth += objectWidth;

            if (i !== 0) containerWidth += gap[(i - 1) % gap.length];

            object.setPosition(0, 0);
        }

        let nextX = x - containerWidth * 0.5;

        for (let i = 0; i < objects.length; i++)
        {
            const object = objects[i];
            const halfObjectWidth = widthArray[i] * 0.5;
            const _gap = i !== 0 ? gap[(i - 1) % gap.length] : 0;
            const centerOffset = centerOffsets[i];

            object.y = y;
            object.x = nextX + halfObjectWidth + _gap + centerOffset;

            nextX = object.x + halfObjectWidth - centerOffset;
        }

        return objects;
    },

    CenterAt(objects: Distributable[], x: number, y: number)
    {
        if (objects.length === 0) return;
        objects = objects.filter(o => o !== undefined);

        if (objects.length === 1)
        {
            objects[0].setPosition(x, y);
            return;
        }

        const bounds = new Phaser.Geom.Rectangle;

        if (objects instanceof Phaser.GameObjects.Container) ContainerFixCenter(objects);

        objects.forEach(object => Phaser.Geom.Rectangle.MergeRect(bounds, object.getBounds()));

        const xOffset = x - bounds.centerX;
        const yOffset = y - bounds.centerY;

        objects.forEach(object => object.setPosition(object.x + xOffset, object.y + yOffset));
    },

    AsGrid(objects: Distributable[], rows: number, cols: number, rowGap: number, colGap: number = rowGap, stepOffset?: { eachRow?: number, eachCol?: number, rowOffsetX?: number, rowOffsetY?: number, colOffsetX?: number, colOffsetY?: number, })
    {
        if (objects.length === 0) return;
        objects = objects.filter(o => o !== undefined);

        if (objects.length === 1)
        {
            objects[0].setPosition(0, 0);
            return;
        }

        const objectBounds = objects[0].getBounds();

        const objectWidth = (objectBounds as any).size !== undefined ? (objectBounds as any).size.x : objectBounds.width;
        const objectHeight = (objectBounds as any).size !== undefined ? (objectBounds as any).size.y : objectBounds.height;

        const stepX = objectWidth + colGap;
        const stepY = objectHeight + rowGap;

        let x = objects[0].x;
        let y = objects[0].y;

        const startX = x;

        for (let row = 0; row < rows; row++)
        {
            x = startX;
            for (let col = 0; col < cols; col++)
            {
                const index = row * cols + col;
                const object = objects[index];
                if (object != null)
                {
                    object.x = x;
                    object.y = y;
                }

                x += stepX;
                if (stepOffset != null)
                {
                    if (stepOffset.eachCol != null && stepOffset.eachCol % col === 0)
                    {
                        x += stepOffset.colOffsetX ?? 0;
                        y += stepOffset.colOffsetY ?? 0;
                    }
                }
            }

            y += stepY;
            if (stepOffset != null)
            {
                if (stepOffset.eachRow != null && stepOffset.eachRow % row === 0)
                {
                    x += stepOffset.rowOffsetX ?? 0;
                    y += stepOffset.rowOffsetY ?? 0;
                }
            }
        }

        objects.forEach(o => {
            o.x -= (stepX * (cols - 1)) * 0.5;
            o.y -= (stepY * (rows - 1)) * 0.5;
        });
    }
};

function ContainerFixCenter(container: Phaser.GameObjects.Container)
{
    const list = container.list as Distributable[];
    const bounds = container.getBounds();
    const xOffset = container.x - bounds.centerX;
    const yOffset = container.y - bounds.centerY;
    list.forEach(object => {
        if (object.type === 'Zone') return;
        object.setPosition(object.x + xOffset, object.y + yOffset)
    });
}

export const Distribute = _Distribute;