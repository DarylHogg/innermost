import type { Metadata } from 'next'
import NewEntryEditor from './new-entry-editor'

export const metadata: Metadata = { title: 'New entry' }

export default function NewEntryPage() {
  return <NewEntryEditor />
}
