export default function camelCasify<T extends { [k: string]: any }>(
    object?: any,
): T | undefined {
    if (typeof object !== 'object' || Array.isArray(object) || object === null)
        return undefined;

    return new Proxy<T>(object, {
        get(target: any, property) {
            if (typeof property !== 'string') {
                return target?.[property];
            }

            const snakeCase = property.replace(
                /[A-Z]+/g,
                (letter) => `_${letter.toLowerCase()}`,
            );

            const willReturn = target?.[snakeCase];

            const isObject =
                typeof willReturn === 'object' &&
                !Array.isArray(willReturn) &&
                willReturn !== null;

            if (isObject) {
                const proxy = `__proxy-${snakeCase}`;
                if (!target?.[proxy]) {
                    target[proxy] = camelCasify(willReturn);
                }
                return target?.[proxy];
            } else {
                return willReturn;
            }
        },
    });
}
