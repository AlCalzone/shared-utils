/** limits a value to the range given by min/max */
export function clamp(value, min, max) {
    if (min > max) {
        [min, max] = [max, min];
    }
    if (value < min)
        return min;
    if (value > max)
        return max;
    return value;
}
export function roundTo(value, digits) {
    const exp = Math.pow(10, digits);
    return Math.round(value * exp) / exp;
}
//# sourceMappingURL=index.js.map