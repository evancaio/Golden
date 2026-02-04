import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'cadastros.json')

export function ensureDataDir(){
  const d = path.dirname(DATA_FILE)
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true })
}

export function readAll(){
  ensureDataDir()
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) } catch(e) { return [] }
}

export function append(record: any){
  const arr = readAll()
  arr.push(record)
  fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8')
}
