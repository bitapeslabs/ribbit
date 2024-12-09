// src/shared/lib/btc/utils/protocolMethods.ts
export function callProtocolMethod(scriptUrl: string, method: string, params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
        const worker = new Worker('/workers/protocolWorker.js', { type: 'module' });


        worker.postMessage({ scriptUrl, method, params });

        worker.onmessage = (e) => {
            const { success, result, error } = e.data;
            if (success) {
                resolve(result);
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
}
