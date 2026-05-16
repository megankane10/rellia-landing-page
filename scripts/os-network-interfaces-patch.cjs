/**
 * Workaround for a Node.js bug on some macOS versions where `os.networkInterfaces()`
 * can throw `uv_interface_addresses returned Unknown system error 1`.
 *
 * Vite calls `os.networkInterfaces()` to print dev server URLs; if it throws, Vite exits.
 * This preload makes `os.networkInterfaces()` safe by returning an empty object on error.
 */
const os = require("node:os");

const original = os.networkInterfaces;

os.networkInterfaces = function networkInterfacesPatched() {
  try {
    return original();
  } catch {
    return {};
  }
};

