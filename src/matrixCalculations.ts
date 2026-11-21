export function multiplyMatrix(a: number[][], b: number[][]) {
    if (a.length === 0 || b.length === 0 || a[0].length === 0 || b[0].length === 0) {
        throw new Error("Matrices are empty");
    }

    const rowsA = a.length;
    const colsA = a[0].length;
    const rowsB = b.length;
    const colsB = b[0].length;

    if (colsA !== rowsB) {
        throw new Error("Incompatible matrix dimensions")
    }

    const result: number[][] = Array.from({ length: rowsA }, () =>
        Array(colsB).fill(0)
    );

    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            let sum = 0;
            for (let k = 0; k < colsA; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }

    return result;
}

export function addMatrix(a: number[][], b: number[][]) {
    if (a.length === 0 || b.length === 0 || a[0].length === 0 || b[0].length === 0) {
        throw new Error("Matrices are empty");
    }

    const rowsA = a.length;
    const colsA = a[0].length;
    const rowsB = b.length;
    const colsB = b[0].length;

    if (colsA !== colsB || rowsA !== rowsB) {
        throw new Error("Incompatible matrix dimensions")
    }

    const result: number[][] = Array.from({ length: rowsA }, () =>
        Array(colsA).fill(0)
    );

    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsA; j++) {
            result[i][j] = a[i][j] + b[i][j]
        }
    }

    return result;
}