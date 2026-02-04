import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'cadastros.json')
const UPLOADS_DIR = path.join(process.cwd(), process.env.UPLOAD_DIR || 'public/uploads')

function ensureDirs(){
  const d = path.dirname(DATA_FILE)
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true })
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

function loadData(){
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) } catch(e){ return [] }
}

function saveData(arr: any[]){ fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), 'utf-8') }

export async function GET(){
  ensureDirs()
  const data = loadData()
  return NextResponse.json(data)
}

export async function POST(req: Request){
  ensureDirs()
  try{
    const body = await req.json()
    // validation
    const required = ['nome','cpf','telefone','idade','endereco','experiencia','formacao']
    for (const k of required){ if (!body[k]) return NextResponse.json({ error: `${k} é obrigatório` }, { status: 400 }) }

    // cpf simple digits check
    const cpf = String(body.cpf || '').replace(/\D/g,'')
    if (cpf.length !== 11) return NextResponse.json({ error: 'CPF inválido' }, { status: 400 })

    const telefone = String(body.telefone || '').replace(/\D/g,'')
    if (telefone.length < 10) return NextResponse.json({ error: 'Telefone inválido' }, { status: 400 })

    // handle foto (data URL)
    let fotoUrl = ''
    if (body.foto) {
      const m = String(body.foto).match(/^data:(image\/(png|jpeg));base64,(.+)$/)
      if (!m) return NextResponse.json({ error: 'Foto inválida' }, { status: 400 })
      const ext = m[2] === 'jpeg' ? 'jpg' : m[2]
      const b64 = m[3]
      const buf = Buffer.from(b64, 'base64')
      const filename = `foto_${Date.now()}.${ext}`
      const filepath = path.join(UPLOADS_DIR, filename)
      fs.writeFileSync(filepath, buf)
      fotoUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/uploads/${filename}`
    }

    const data = loadData()
    const record = { ...body, cpf, telefone, fotoUrl, createdAt: new Date().toISOString() }
    data.push(record)
    saveData(data)

    return NextResponse.json({ ok: true })
  } catch(err:any){
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 })
  }
}
