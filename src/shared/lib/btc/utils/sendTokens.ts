// src/utils/sendToken.ts
export const sendTokens = (sendScriptUrl: string, params: any[]): Promise<string> => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(new URL('../workers/sendTokenWorker.js', import.meta.url));

        worker.postMessage({
            sendScriptUrl,
            method: 'sendTokens',
            params,
        });

        worker.onmessage = (e) => {
            const { success, txHex, error } = e.data;
            if (success) {
                resolve(txHex);
            } else {
                reject(new Error(error));
            }
            worker.terminate();
        };

        worker.onerror = (err) => {
            reject(err);
            worker.terminate();
        };
    });
};
