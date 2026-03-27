'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { moodOptions } from '@/lib/mock-data'

export default function NewEntryEditor() {
  const router = useRouter()
  const [title, setTitle]           = useState('')
  const [body, setBody]             = useState('')
  const [moodScore, setMoodScore]   = useState<number | null>(null)
  const [isPrivate, setIsPrivate]   = useState(false)
  const [saving, setSaving]         = useState(false)

  const wordCount = body.trim() === '' ? 0 : body.trim().split(/\s+/).length

  function handleSave() {
    if (!body.trim()) return
    setSaving(true)
    // TODO: call POST /api/entries
    setTimeout(() => {
      router.push('/journal')
    }, 800)
  }

  const selectedMood = moodOptions.find((m) => m.score === moodScore)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a] tracking-tight">New entry</h1>
          <p className="text-xs text-zinc-400 mt-1">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        className="w-full text-lg font-medium text-[#1a1a1a] placeholder-zinc-300 bg-transparent border-none outline-none"
      />

      {/* Body */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What's on your mind today…"
        rows={12}
        className="w-full text-base text-[#1a1a1a] placeholder-zinc-300 bg-transparent border-none outline-none resize-none leading-relaxed"
        autoFocus
      />

      {/* Divider */}
      <div className="h-px bg-zinc-100" />

      {/* Mood picker */}
      <div>
        <p className="text-xs font-medium text-zinc-500 mb-3">How are you feeling?</p>
        <div className="flex flex-wrap gap-2">
          {moodOptions.map((m) => (
            <button
              key={m.score}
              onClick={() => setMoodScore(moodScore === m.score ? null : m.score)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                moodScore === m.score
                  ? 'border-transparent text-white'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
              }`}
              style={
                moodScore === m.score
                  ? { background: m.color, borderColor: m.color }
                  : {}
              }
            >
              <span>{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
        {selectedMood && (
          <p className="text-xs text-zinc-400 mt-2">
            Feeling <span className="font-medium" style={{ color: selectedMood.color }}>{selectedMood.label}</span>
          </p>
        )}
      </div>

      {/* Options + Save */}
      <div className="flex items-center justify-between pt-2 pb-16 md:pb-2">
        <div className="flex items-center gap-4">
          {/* Word count */}
          <span className="text-xs text-zinc-400">{wordCount} words</span>

          {/* Private toggle */}
          <button
            onClick={() => setIsPrivate(!isPrivate)}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              isPrivate ? 'text-[#BA7517]' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {isPrivate ? '🔒' : '🌐'} {isPrivate ? 'Private' : 'Shared with therapist'}
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={!body.trim() || saving}
          className="bg-[#1a1a1a] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {saving ? 'Saving…' : 'Save entry'}
        </button>
      </div>
    </div>
  )
}
