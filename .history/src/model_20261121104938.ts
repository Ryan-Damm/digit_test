import { addMatrix, multiplyMatrix } from "./matrixCalculations";

export interface Model {
    weights: Record<string, number[][]>;
    biases: Record<string, number[][]>;
    architecture: number[];
}

const initializeModel = async (file: string) => {
    const response = await fetch(file);
    return await response.json();
}

const softmax = (z: number[][]): number[][] => {
    if (z.length === 0) return [];
    const numCols = z[0].length;

    const colMaxes: number[] = Array.from({ length: numCols }, (_, colIdx) =>
        Math.max(...z.map((row) => row[colIdx]))
    );

    const expZ: number[][] = z.map((row) =>
        row.map((val, colIdx) => Math.exp(val - colMaxes[colIdx]))
    );

    const colSums: number[] = Array.from({ length: numCols }, (_, colIdx) =>
        expZ.reduce((sum, row) => sum + row[colIdx], 0)
    );

    return expZ.map((row) =>
        row.map((val, colIdx) => val / colSums[colIdx])
    );
}

const relu = (z: number[][]): number[][] => {
    return z.map(row =>
        row.map(value => Math.max(0, value))
    );
};

export const forwardPass = (input: number[][], model: Model) => {
    let cache: Record<string, number[][]> = {}
    let a = input
    cache["A0"] = a

    for (let i = 1; i < model.architecture.length; i++) {
        let z = addMatrix(multiplyMatrix(model.weights[`weight${i}`], a), model.biases[`bias${i}`]);
        cache[`Z${i}`] = z;

        if (i === model.architecture.length - 1)
            a = softmax(z);
        else
            a = relu(z)
        cache[`A${i}`] = a;
    }

    return { cache: cache, a: a }
}