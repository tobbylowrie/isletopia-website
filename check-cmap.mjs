import { readFileSync } from 'node:fs'

const file = process.argv[2]
const buf = readFileSync(file)

// 解析 TTF/OTF 表目录
const numTables = buf.readUInt16BE(4)
let cmapOffset = 0
for (let i = 0; i < numTables; i++) {
  const off = 12 + i * 16
  const tag = buf.toString('ascii', off, off + 4)
  if (tag === 'cmap') cmapOffset = buf.readUInt32BE(off + 8)
}

// 读取 cmap 子表，优先 format 4（覆盖 BMP）
const subCount = buf.readUInt16BE(cmapOffset + 2)
let format4 = null
for (let i = 0; i < subCount; i++) {
  const recOff = cmapOffset + 4 + i * 8
  const pid = buf.readUInt16BE(recOff)
  const sid = buf.readUInt16BE(recOff + 2)
  const subOff = cmapOffset + buf.readUInt32BE(recOff + 4)
  const fmt = buf.readUInt16BE(subOff)
  if (fmt === 4 && (pid === 3 || pid === 0) && (sid === 1 || sid === 0)) {
    format4 = subOff
  }
}

if (!format4) {
  console.log('未找到 format 4 cmap 子表')
  process.exit(0)
}

// 解析 format 4
const o = format4
const segCountX2 = buf.readUInt16BE(o + 6)
const segCount = segCountX2 / 2
const endCodesOff = o + 14
const startCodesOff = endCodesOff + segCountX2 + 2
const idDeltaOff = startCodesOff + segCountX2
const idRangeOffsetOff = idDeltaOff + segCountX2

const endCodes = []
const startCodes = []
const idDeltas = []
const idRangeOffsets = []
for (let i = 0; i < segCount; i++) {
  endCodes.push(buf.readUInt16BE(endCodesOff + i * 2))
  startCodes.push(buf.readUInt16BE(startCodesOff + i * 2))
  idDeltas.push(buf.readInt16BE(idDeltaOff + i * 2))
  idRangeOffsets.push(buf.readUInt16BE(idRangeOffsetOff + i * 2))
}

const has = (cp) => {
  for (let i = 0; i < segCount; i++) {
    if (cp >= startCodes[i] && cp <= endCodes[i]) {
      let gid
      if (idRangeOffsets[i] === 0) {
        gid = (cp + idDeltas[i]) & 0xffff
      } else {
        const idx = idRangeOffsetOff + i * 2 + (cp - startCodes[i]) * 2 + idRangeOffsets[i]
        gid = buf.readUInt16BE(idx)
        if (gid !== 0) gid = (gid + idDeltas[i]) & 0xffff
      }
      return gid !== 0
    }
  }
  return false
}

const ranges = {
  '数字 0-9 (U+0030-0039)': [0x30, 0x39],
  '大写 A-Z (U+0041-005A)': [0x41, 0x5a],
  '小写 a-z (U+0061-007a)': [0x61, 0x7a],
  'CJK 基本区 (U+4E00-9FFF)': [0x4e00, 0x9fff],
}

for (const [label, [lo, hi]] of Object.entries(ranges)) {
  let count = 0
  for (let cp = lo; cp <= hi; cp++) if (has(cp)) count++
  const total = hi - lo + 1
  console.log(`${label}: ${count}/${total} ${count === total ? '✅ 全覆盖' : count === 0 ? '❌ 无' : '⚠️ 部分'}`)
}
