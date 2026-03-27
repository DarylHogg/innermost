import { PrismaClient, Tier } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? '',
})

const prisma = new PrismaClient({ adapter })

const prompts = [
  // gratitude (6)
  { text: "What three small things made you smile today?", category: "gratitude" },
  { text: "Who in your life are you most grateful for right now, and why?", category: "gratitude" },
  { text: "Describe a moment this week where you felt at peace.", category: "gratitude" },
  { text: "What is something your body did today that you appreciate?", category: "gratitude" },
  { text: "Write about a place that always makes you feel grateful to be alive.", category: "gratitude" },
  { text: "What ordinary moment from today deserves more appreciation?", category: "gratitude" },
  // reflection (6)
  { text: "What is one belief you hold today that you didn't have a year ago?", category: "reflection" },
  { text: "Describe a recent decision you're proud of, and what led you to it.", category: "reflection" },
  { text: "What emotion have you been carrying this week without naming it?", category: "reflection" },
  { text: "If your future self could send you a message about this period, what might it say?", category: "reflection" },
  { text: "What pattern in your behavior would you like to understand better?", category: "reflection" },
  { text: "What does 'home' mean to you right now?", category: "reflection" },
  // growth (6)
  { text: "What is one uncomfortable truth you've been avoiding?", category: "growth" },
  { text: "Describe a failure that taught you something valuable.", category: "growth" },
  { text: "What would you attempt if you knew you couldn't fail?", category: "growth" },
  { text: "What habit, if started today, would most improve your life in a year?", category: "growth" },
  { text: "Who is someone you admire, and which of their qualities do you want to develop?", category: "growth" },
  { text: "What boundary do you need to set, and what's holding you back?", category: "growth" },
  // anxiety (6)
  { text: "What is worrying you most right now? Write it out fully without filtering.", category: "anxiety" },
  { text: "What is the worst realistic outcome of what you're anxious about? Could you survive it?", category: "anxiety" },
  { text: "What would you tell a close friend who had exactly the same worry?", category: "anxiety" },
  { text: "What physical sensations does anxiety create in your body, and where do you feel them?", category: "anxiety" },
  { text: "What has helped you through anxious moments in the past?", category: "anxiety" },
  { text: "Write about something that is certain and stable in your life right now.", category: "anxiety" },
  // cbt (6)
  { text: "Identify a negative thought you had today. What evidence supports it? What contradicts it?", category: "cbt" },
  { text: "Describe a situation where your interpretation made things harder than they needed to be.", category: "cbt" },
  { text: "What is a more balanced way to think about a challenge you're currently facing?", category: "cbt" },
  { text: "Write about a time you catastrophized. What actually happened?", category: "cbt" },
  { text: "What 'rule' do you live by that might be worth questioning?", category: "cbt" },
  { text: "Rate your mood 1–10 right now. What thoughts are contributing most to that number?", category: "cbt" },
]

const badges = [
  { key: "first_entry", name: "First Entry", description: "Write your very first journal entry", iconEmoji: "✍️", entriesRequired: 1 },
  { key: "streak_7", name: "Week Warrior", description: "Maintain a 7-day journaling streak", iconEmoji: "🔥", streakRequired: 7 },
  { key: "streak_30", name: "Month Strong", description: "Maintain a 30-day journaling streak", iconEmoji: "🏆", streakRequired: 30 },
  { key: "night_owl", name: "Night Owl", description: "Write an entry after 10pm", iconEmoji: "🌙" },
  { key: "wordsmith_1k", name: "1,000 Words", description: "Write 1,000 words total across all entries", iconEmoji: "📖" },
  { key: "wordsmith_10k", name: "Deep Thinker", description: "Write 10,000 words total across all entries", iconEmoji: "💎" },
  { key: "mindful_month", name: "Mindful Month", description: "Write 20 entries in a single month", iconEmoji: "🧘" },
  { key: "year_strong", name: "Year Strong", description: "Be a member for 365 days", iconEmoji: "🌟" },
  { key: "grateful", name: "Gratitude Practice", description: "Write 10 entries using a gratitude prompt", iconEmoji: "🙏" },
]

async function main() {
  console.log('Seeding badges...')
  for (const badge of badges) {
    await prisma.badge.upsert({ where: { key: badge.key }, update: badge, create: badge })
  }

  console.log('Seeding prompts...')
  for (const prompt of prompts) {
    await prisma.promptOfDay.create({ data: prompt })
  }

  console.log('Creating demo user...')
  const demoUser = await prisma.user.upsert({
    where: { email: 'alex@innermost.app' },
    update: {},
    create: {
      email: 'alex@innermost.app',
      name: 'Alex',
      tier: Tier.PAID,
      goals: ['clarity', 'anxiety', 'gratitude'],
      reminderFreq: 'daily',
      reminderTime: '20:00',
    },
  })

  await prisma.streak.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      current: 14,
      longest: 14,
      shields: 1,
      lastEntry: new Date(),
    },
  })

  await prisma.therapistLink.upsert({
    where: { patientId: demoUser.id },
    update: {},
    create: {
      patientId: demoUser.id,
      therapistName: 'Dr. Sarah Chen',
      therapistEmail: 'sarah@therapy.example.com',
      accessGranted: true,
      shareAuto: true,
      allowAnnotations: true,
    },
  })

  console.log('Done!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
