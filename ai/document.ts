/**
 * 文档领域类型 — Chat 与 Workflow 共用
 */

export const DOCUMENT_UPLOAD_ACCEPT =
  'image/*,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.ofd'

export const DOCUMENT_FORMAT_LABEL =
  'PNG、JPG、GIF、WebP、PDF、DOC、DOCX、TXT、CSV、XLS、XLSX、OFD'

const EXTENSION_MIME_MAP: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ofd': 'application/ofd',
}

export function isAllowedDocumentUpload(filename: string, mimetype: string): boolean {
  const ext = filename.includes('.') ? filename.slice(filename.lastIndexOf('.')).toLowerCase() : ''
  const type = (mimetype || '').trim().toLowerCase()

  if (type.startsWith('image/')) return true
  if (['application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/csv', 'application/csv', 'application/ofd', 'application/x-ofd',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(type)) {
    return true
  }
  if (type === 'application/vnd.ms-excel' && ext === '.csv') return true
  if (type === 'application/octet-stream' && (ext === '.ofd' || ext === '.csv' || ext === '.xls' || ext === '.xlsx')) return true
  return ext in EXTENSION_MIME_MAP
}

export interface DocumentChunk {
  page: number
  text: string
  startOffset: number
}

export interface StructuredSummary {
  title: string
  summary: string
  keyPoints: string[]
  sections: Array<{ heading: string; content: string }>
  entities?: string[]
  generatedAt: string
}

export interface DocumentRecord {
  id: string
  filename: string
  mimetype: string
  size: number
  textLength: number
  chunkCount: number
  hasSummary: boolean
  summary?: StructuredSummary
  createdAt: string
  updatedAt: string
}

export interface DocumentPreview {
  id: string
  filename: string
  mimetype: string
  size: number
  text: string
  excerpt: string
  chunks: DocumentChunk[]
  summary?: StructuredSummary
}

export interface MessageDocumentAttachment {
  documentId: string
  filename: string
  mimetype: string
  size: number
  excerpt?: string
}

export interface MessageDocumentSummary {
  documentId: string
  filename: string
  summary: StructuredSummary
}
