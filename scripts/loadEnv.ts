import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"

const scriptsDir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(scriptsDir, "..")
dotenv.config({ path: path.join(root, ".env") })
dotenv.config({ path: path.join(root, ".env.local") })

