import * as fs from 'fs'
import * as path from 'path'

interface Config {
  port: number
  // eslint-disable-next-line camelcase
  mongo_host: string
  // eslint-disable-next-line camelcase
  mongo_db: string
  uploadSizeLimit: number
}

const config: Config = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8')
)
export default config
