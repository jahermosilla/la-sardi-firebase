export default function <T> (json: object, clazz: T) : T {
    return Object.assign(clazz, json);
}