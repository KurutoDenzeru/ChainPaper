import { promises as fs } from 'fs'
import { join } from 'path'
import { readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event)
  const uploadsDir = join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })

  const saved: Array<{ url: string; filename: string }> = []
  if (parts && parts.length) {
    for (const p of parts) {
      // Each part from readMultipartFormData has filename and data
      if (p && (p as any).filename && (p as any).data) {
        const filename = `${Date.now()}-${(p as any).filename}`
        const filePath = join(uploadsDir, filename)
        // data may be a Uint8Array / Buffer
        await fs.writeFile(filePath, (p as any).data)
        saved.push({ url: `/uploads/${filename}`, filename: (p as any).filename })
      }
    }
  }

  return { files: saved }
})
