export function merge(p, u = {}) {
    let config = {};
    for (let key in p) {
        config[key] = u[key] !== undefined ? u[key] : p[key];
    }
    return config;
}