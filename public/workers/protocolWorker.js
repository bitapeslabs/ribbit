// protocolWorker.js (ESM)
// public/workers/protocolWorker.js
self.onmessage = async (e) => {
  const { scriptUrl, method, params } = e.data;

  try {
    // Dynamically import the module from scriptUrl
    const protocolModule = await import(scriptUrl);

    if (!protocolModule.protocolFunctions) {
      throw new Error("No 'protocolFunctions' export found in the loaded script.");
    }

    const protocolFunctions = protocolModule.protocolFunctions;

    if (typeof protocolFunctions[method] !== 'function') {
      throw new Error(`Method "${method}" not found in protocolFunctions.`);
    }

    const result = await protocolFunctions[method](...params);
    self.postMessage({ success: true, result });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
