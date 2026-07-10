import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const asset = (file: string) => path.resolve(dirname, '../public/assets', file)

// --- lexical rich-text helpers -------------------------------------------
type Node = Record<string, unknown>
const text = (t: string): Node => ({
  type: 'text',
  text: t,
  format: 0,
  style: '',
  mode: 'normal',
  detail: 0,
  version: 1,
})
const para = (t: string): Node => ({
  type: 'paragraph',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  textFormat: 0,
  children: [text(t)],
})
const heading = (t: string): Node => ({
  type: 'heading',
  tag: 'h2',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  children: [text(t)],
})
const quote = (t: string): Node => ({
  type: 'quote',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  children: [text(t)],
})
const doc = (...children: Node[]) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children },
})

const ANIMA = 'This is a template Figma file, turned into code using Anima. Learn more at AnimaApp.com'

// --- posts (Blog + Article) ----------------------------------------------
const POSTS = [
  {
    title: 'Designing with unicorns',
    tag: 'Design',
    excerpt: 'How mythical creatures quietly shape a creative process.',
    thumb: 'work-1.jpg',
    featured: 'jezael-melgoza.jpg',
    date: '2026-06-15',
    readingTime: 5,
    body: doc(
      para(
        'When I was five, a family of unicorns borrowed me for a summer. I came back with a strange new way of seeing — one that still shows up in every file I open. This is the story of how make-believe quietly became a method.',
      ),
      heading('Where the ideas come from'),
      para(
        'Inspiration rarely arrives on schedule. It hides in the lil’ details of everyday life: a mistyped sign, a colour that shouldn’t work, the leftover food in a good beard. The trick is staying curious enough to notice — and disciplined enough to write it down.',
      ),
      quote('Being a human is way too complicated. Time to be a unicorn.'),
      para(
        'So I keep a notebook of nonsense, and once a week I try to turn one ridiculous entry into something real. Most of it stays ridiculous. But every so often a unicorn gallops out — and that’s the work worth shipping.',
      ),
    ),
  },
  {
    title: 'From Figma to code, in one loop',
    tag: 'Process',
    excerpt: 'Closing the gap between design and build for good.',
    thumb: 'work-2.jpg',
    date: '2026-05-20',
    readingTime: 4,
    body: doc(
      para(
        'For years the handoff from design to code was a game of telephone. A clean, well-formatted file changes that: the structure is the spec, and the spec compiles.',
      ),
      para(
        'Close the loop with a render and a pixel-diff and you stop eyeballing “close enough” — you converge on a match.',
      ),
    ),
  },
  {
    title: 'The art of the tiny detail',
    tag: 'Craft',
    excerpt: 'Why the little things carry the most weight.',
    thumb: 'work-3.jpg',
    date: '2026-05-10',
    readingTime: 3,
    body: doc(
      para(
        'A two-pixel misalignment is invisible until it isn’t. Craft is the discipline of caring about the parts nobody is supposed to notice.',
      ),
      para('Get the small things right and the big things tend to look after themselves.'),
    ),
  },
  {
    title: 'Growing a beard, growing ideas',
    tag: 'Life',
    excerpt: 'Inspiration hides in the most unexpected places.',
    thumb: 'work-4.jpg',
    date: '2026-04-20',
    readingTime: 3,
    body: doc(
      para(
        'Some ideas need to be left alone to grow. Step away from the screen, let it get a little wild, and come back to see what took root.',
      ),
    ),
  },
  {
    title: 'Auto layout everything',
    tag: 'Tools',
    excerpt: 'A love letter to constraints that set you free.',
    thumb: 'work-5.jpg',
    date: '2026-04-10',
    readingTime: 4,
    body: doc(
      para(
        'Constraints are not the enemy of creativity — they are its scaffolding. Auto Layout turns a pile of rectangles into a system that survives contact with real content.',
      ),
    ),
  },
  {
    title: 'Available Monday to Tuesday',
    tag: 'Rambles',
    excerpt: 'On rest, rhythm, and the occasional unicorn race.',
    thumb: 'work-6.jpg',
    date: '2026-03-15',
    readingTime: 2,
    body: doc(
      para(
        'Rest is part of the work. The best ideas rarely show up during the hours you scheduled for them.',
      ),
    ),
  },
]

async function run() {
  const payload = await getPayload({ config })
  const email = process.env.SEED_EMAIL || 'admin@example.com'
  const password = process.env.SEED_PASSWORD || 'changeme123'

  // fresh start (idempotent)
  await payload.delete({ collection: 'posts', where: { id: { exists: true } } })
  await payload.delete({ collection: 'case-studies', where: { id: { exists: true } } })
  await payload.delete({ collection: 'media', where: { id: { exists: true } } })

  const admins = await payload.find({ collection: 'users', limit: 1 })
  if (admins.totalDocs === 0) {
    await payload.create({ collection: 'users', data: { email, password } })
    console.log(`Created admin user: ${email} / ${password}`)
  } else {
    console.log('Admin user already exists — leaving it as is.')
  }

  // upload every asset once, keyed by filename
  const IMAGES = [
    'hero.jpg',
    'skill-1.png',
    'skill-2.png',
    'skill-3.png',
    'work-1.jpg',
    'work-2.jpg',
    'work-3.jpg',
    'work-4.jpg',
    'work-5.jpg',
    'work-6.jpg',
    'jezael-melgoza.jpg',
    'avatar-1.jpg',
    'avatar-2.jpg',
    'avatar-3.jpg',
    'about-portrait.jpg',
  ]
  const media: Record<string, number> = {}
  for (const file of IMAGES) {
    const doc = await payload.create({
      collection: 'media',
      data: { alt: file.replace(/\.[a-z]+$/, '') },
      filePath: asset(file),
    })
    media[file] = doc.id
  }
  console.log(`Uploaded ${IMAGES.length} images.`)

  for (const p of POSTS) {
    await payload.create({
      collection: 'posts',
      data: {
        title: p.title,
        tag: p.tag,
        excerpt: p.excerpt,
        thumbnail: media[p.thumb],
        featuredImage: p.featured ? media[p.featured] : undefined,
        author: 'Pablo Designero',
        publishedDate: p.date,
        readingTime: p.readingTime,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- hand-authored Lexical state
        body: p.body as any,
      },
    })
    console.log(`Seeded post: ${p.title}`)
  }

  // --- globals ------------------------------------------------------------
  await payload.updateGlobal({
    slug: 'home',
    data: {
      hero: {
        eyebrow: 'Branding | Image making ',
        title: 'My awesome portfolio',
        sub: 'And I made it myself! Yes. In Figma with Anima',
        image: media['hero.jpg'],
      },
      skills: [
        { title: 'Product design', description: ANIMA, image: media['skill-1.png'] },
        { title: 'Art direction', description: ANIMA, image: media['skill-2.png'] },
        { title: 'Visual design', description: ANIMA, image: media['skill-3.png'] },
      ],
      workTitle: 'My latest work',
      work: [
        { title: 'Free Bird', artist: 'Lynyrd Skynyrd', image: media['work-1.jpg'] },
        { title: 'Purple Haze', artist: 'Jimi Hendrix', image: media['work-2.jpg'] },
        { title: 'You Really Got Me', artist: 'The Kinks', image: media['work-3.jpg'] },
        { title: 'American Girl', artist: 'Tom Petty', image: media['work-4.jpg'] },
        { title: 'Whole Lotta Love', artist: 'Led Zeppelin', image: media['work-5.jpg'] },
        { title: 'Under Pressure ', artist: 'Queen', image: media['work-6.jpg'] },
      ],
      clientsTitle: 'Clients',
      clients: [
        { quote: ANIMA, name: 'Gemma Nolen', company: 'Google', avatar: media['avatar-1.jpg'] },
        { quote: ANIMA, name: 'Gemma Nolen', company: 'Google', avatar: media['avatar-2.jpg'] },
        { quote: ANIMA, name: 'Gemma Nolen', company: 'Google', avatar: media['avatar-3.jpg'] },
      ],
    },
  })
  console.log('Seeded global: home')

  await payload.updateGlobal({
    slug: 'about',
    data: {
      persona: {
        image: media['about-portrait.jpg'],
        name: 'Pablo Designero',
        role: 'Designer & Unicorn Trainer',
      },
      bio: 'Father of 3 humans, 5 unicorns & 2 dogs, I design since I can remember it. I often get asked where I get my inspiration from: in everyday’s lil’ details. And sometimes in leftover food I find in my beard.',
      lead: 'When I was 5, I got adbucted by a unicorn family. When they returned me to earth, I joined a designer school. But, fo’ real, what I learned with my kidnaptive family really gave an edge to my creative language.',
      lines: [
        { text: 'Being a human is way too complicated. Time to be a unicorn.', highlight: true },
        {
          text: 'Try it and you’ll see. Then your Figma files are just gonna fly in color, glitter, interactions and autolayout.',
          highlight: false,
        },
        { text: 'Also, grow a beard. Check my bio if that is not clear.', highlight: true },
        {
          text: 'Available for projects, from Monday to Tuesday, mainy between 14 and 16. (Unless there is a unicorn race on TV - DUH -in that case, come back another day).\nProjects include, RocknRoll covers, furniture refurbishing, Unicorn potty training and more.',
          highlight: false,
        },
      ],
    },
  })
  console.log('Seeded global: about')

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      footerHeading: 'Let’s work together',
      footerBody: `${ANIMA} ${ANIMA}`,
    },
  })
  console.log('Seeded global: site-settings')

  // --- case studies (fictional — named to match the Home "latest work" cards) ---
  const paras = (...t: string[]) => t.map((text) => ({ text }))
  const caseStudy = (o: {
    title: string; subtitle: string; intro: string; services: string[];
    problem: string; idea: string; quote: string;
    chapters: { title: string; paras: string[] }[];
  }) => ({
    title: o.title,
    subtitle: o.subtitle,
    intro: o.intro,
    services: o.services.map((label) => ({ label })),
    ctaHeading: 'Have an uncommon problem or promising pitch? Let’s partner up.',
    ctaAccent: 'Let’s partner up.',
    layout: [
      { blockType: 'media', variant: 'phones', background: 'cream', label: 'Screen' },
      { blockType: 'split', leftLabel: 'Business problem', leftText: o.problem, rightLabel: 'Bold idea', rightText: o.idea },
      { blockType: 'quote', text: o.quote, author: o.subtitle, role: 'Client' },
      { blockType: 'chapter', title: o.chapters[0].title, paragraphs: paras(...o.chapters[0].paras) },
      { blockType: 'media', variant: 'phones', background: 'white', label: 'Screen' },
      { blockType: 'chapter', title: o.chapters[1].title, paragraphs: paras(...o.chapters[1].paras) },
      { blockType: 'media', variant: 'wide', background: 'cream', label: 'Gallery' },
      { blockType: 'media', variant: 'tall', background: 'white', label: 'Photo' },
    ],
  })

  const CASES = [
    caseStudy({
      title: 'Free Bird', subtitle: 'Lynyrd Skynyrd',
      intro: 'Free Bird is a spontaneous-travel app for people who decide where to go on the morning they leave. It turns a vague itch to get away into a bookable day-trip in three taps — routes, stops, and a soundtrack included.',
      services: ['Product Strategy', 'UI/UX Design', 'Brand Identity', 'Prototyping', 'Growth Strategy'],
      problem: 'Travel apps are built for planners — endless filters, weeks of research, and rigid itineraries. There was nothing for the person who wants to leave in an hour and figure it out on the way.',
      idea: 'A one-screen “just go” flow that proposes a full day out from your doorstep, adapts as you wander, and never makes you feel behind schedule. Freedom, with just enough scaffolding.',
      quote: '“They took a half-formed feeling and shipped it as a product. The first prototype already felt like freedom.”',
      chapters: [
        { title: 'Designing for the unplanned.', paras: [
          'We started by throwing out the itinerary. Instead of a plan you build, Free Bird offers a plan you accept — one confident suggestion you can reshuffle with a swipe.',
          'Every screen assumes you’re already moving. Directions, timings, and detours update quietly in the background so the app never nags.'] },
        { title: 'A soundtrack for the road.', paras: [
          'Each trip generates a playlist tuned to its distance and mood, so the drive feels authored rather than random. It became the feature testers talked about most.'] },
      ],
    }),
    caseStudy({
      title: 'Purple Haze', subtitle: 'Jimi Hendrix',
      intro: 'Purple Haze is a generative-art studio in your pocket. Describe a feeling, and it paints — turning a sentence into a poster, a pattern, or a moving gradient you can export anywhere.',
      services: ['Product Strategy', 'AI Design', 'UI/UX Design', 'Creative Direction', 'Prototyping'],
      problem: 'Generative tools overwhelmed newcomers with knobs and jargon. Making something beautiful took a tutorial, not a moment of play.',
      idea: 'Hide the machinery. Lead with a single prompt and a canvas that responds instantly, so the first thing you feel is delight, not confusion.',
      quote: '“We wanted people to make something gorgeous in ten seconds. The team made it five.”',
      chapters: [
        { title: 'Prompt first, controls later.', paras: [
          'The home screen is a blank canvas and one line of text. Advanced controls fold away until you go looking for them, so beginners and pros share the same door.'] },
        { title: 'Colour as the core loop.', paras: [
          'We built a palette engine that keeps every generation on-brand and print-ready, turning happy accidents into usable assets in a tap.'] },
      ],
    }),
    caseStudy({
      title: 'You Really Got Me', subtitle: 'The Kinks',
      intro: 'You Really Got Me is a local-events app that learns what actually gets you out of the house — then fills your week with exactly enough of it.',
      services: ['Product Strategy', 'UI/UX Design', 'Data & Personalisation', 'Prototyping', 'Growth Strategy'],
      problem: 'Event apps drown you in listings and reward the loudest promoters. Finding one thing you’d truly enjoy took more effort than just staying in.',
      idea: 'Fewer, better invitations. A curated handful each week, chosen from your real behaviour, with a one-tap “I’m in” that handles the rest.',
      quote: '“It stopped feeling like a listings site and started feeling like a friend with good taste.”',
      chapters: [
        { title: 'Curation over search.', paras: [
          'We replaced the endless feed with a weekly set of hand-feeling picks. Scarcity made each suggestion feel considered, and attendance climbed.'] },
        { title: 'Learning without the creep.', paras: [
          'Personalisation runs on-device and stays legible — you can see why something was suggested and mute what you don’t want, no dark patterns.'] },
      ],
    }),
    caseStudy({
      title: 'American Girl', subtitle: 'Tom Petty',
      intro: 'American Girl is a sustainable-fashion marketplace where every piece carries its story — who made it, from what, and how far it travelled — without turning a purchase into homework.',
      services: ['Brand Identity', 'UI/UX Design', 'Product Strategy', 'Commercial Modelling', 'Growth Strategy'],
      problem: 'Ethical fashion asked shoppers to become researchers. Provenance data existed, but it was buried, inconsistent, and joyless.',
      idea: 'Make the story part of the product shot. Surface origin and impact as beautifully as the garment itself, so conscience and desire pull the same direction.',
      quote: '“They made doing the right thing look better than the alternative. That’s the whole game.”',
      chapters: [
        { title: 'Provenance you can feel.', paras: [
          'Each listing opens with a visual supply-chain — a few honest frames that turn abstract sustainability claims into something tangible and shareable.'] },
        { title: 'A marketplace makers trust.', paras: [
          'We designed seller tools that reward transparency, so small ethical labels could compete on story, not just ad spend.'] },
      ],
    }),
    caseStudy({
      title: 'Whole Lotta Love', subtitle: 'Led Zeppelin',
      intro: 'Whole Lotta Love is a community fundraising platform for the causes closest to home — the local team, the neighbour in trouble, the street party that needs a stage.',
      services: ['Product Strategy', 'UI/UX Design', 'Brand Identity', 'Prototyping', 'Commercial Advice'],
      problem: 'Big fundraising platforms felt corporate and took a heavy cut. Small, local drives got lost and organisers burned out on admin.',
      idea: 'A warm, hyper-local tool built for organisers — set up a drive in minutes, rally your street, and watch generosity compound in public.',
      quote: '“It felt like our neighbourhood, not a payment processor. Donations doubled the first weekend.”',
      chapters: [
        { title: 'Built for the organiser.', paras: [
          'We obsessed over the setup flow: a live drive in under five minutes, with updates and thank-yous that take seconds to send.'] },
        { title: 'Generosity in public.', paras: [
          'A shared momentum bar and neighbourhood map turned giving into a visible, contagious act rather than a private transaction.'] },
      ],
    }),
    caseStudy({
      title: 'Under Pressure', subtitle: 'Queen',
      intro: 'Under Pressure is a stress companion that notices before you do — a calm, private check-in that turns a rough day into a plan you can actually follow.',
      services: ['Product Strategy', 'UI/UX Design', 'AI Design', 'Testing & Validation', 'Growth Strategy'],
      problem: 'Wellness apps piled on streaks and guilt, adding pressure to the very people trying to relieve it. Engagement metrics fought the mission.',
      idea: 'Design for less, not more. Gentle nudges, no streaks, and a check-in that rewards honesty over consistency.',
      quote: '“The bravest thing they did was remove features. It’s the only wellness app I haven’t deleted.”',
      chapters: [
        { title: 'Calm by default.', paras: [
          'Every interaction is short, quiet, and skippable. The app’s success is measured by how little you need it, not how long you stay.'] },
        { title: 'Signals, not surveillance.', paras: [
          'On-device signals surface a gentle heads-up when patterns shift, always with a clear reason and an easy way to opt out.'] },
      ],
    }),
  ]
  for (const data of CASES) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- block-union literals
    await payload.create({ collection: 'case-studies', data: data as any })
    console.log(`Seeded case study: ${data.title}`)
  }

  console.log('Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
