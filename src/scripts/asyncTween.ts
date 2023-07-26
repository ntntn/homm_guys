export async function addAsyncTween(scene: Phaser.Scene, options: Phaser.Types.Tweens.TweenBuilderConfig & { [key: string]: any }): Promise<Phaser.Tweens.Tween | undefined>
{
    return new Promise(resolve =>
    {
        if (scene == null)
        {
            resolve(undefined);
            return;
        }

        const t = scene.tweens.add({
            ...options,
            onComplete: (tween) =>
            {
                tween.remove();
                if (options.onComplete)
                {
                    if (options.onCompleteScope) options.onComplete.bind(options.onCompleteScope)(t, options.targets, options.onCompleteParams);
                    else options.onComplete(t, options.targets, options.onCompleteParams);
                }
                resolve(t);
            }
        });
    });
}