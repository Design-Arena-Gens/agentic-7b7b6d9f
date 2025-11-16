import fs from "fs";
import path from "path";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ml", label: "മലയാളം" },
  { code: "ta", label: "தமிழ்" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "te", label: "తెలుగు" },
  { code: "bn", label: "বাংলা" },
  { code: "ar", label: "العربية" },
];

const chapters = [
  {
    number: 1,
    slug: "arjunas-dilemma",
    title: "Arjuna's Dilemma",
    overview:
      "Arjuna is paralysed by doubt on the battlefield, unsure of his role and responsibility.",
    keyThemes: [
      "Moral confusion",
      "Duty versus emotion",
      "Seeking guidance",
    ],
    sections: [
      {
        id: "1-1",
        title: "Seeing loved ones as opponents",
        brief:
          "Arjuna looks at his teachers and cousins in the opposing army and feels his courage drain away.",
        narration:
          "Krishna lets Arjuna express his fear fully. Only when the mind empties its panic can wisdom enter.",
        scenario:
          "A professional asked to lead layoffs freezes because long-time colleagues sit on the list. Their mentor reminds them that acting with clarity can still honour relationships.",
        image: "chapter-1.svg",
      },
      {
        id: "1-2",
        title: "The pause before guidance",
        brief:
          "Arjuna lowers his bow and admits he cannot decide. This pause becomes the doorway to the Gita.",
        narration:
          "In stillness, Krishna prepares to offer a teaching that turns battle into a classroom of inner mastery.",
        scenario:
          "Before a crucial medical decision, a doctor steps out, breathes, and calls a senior specialist. The humility to pause prevents a rushed mistake.",
        image: "chapter-1b.svg",
      },
    ],
  },
  {
    number: 2,
    slug: "sankhya-yoga",
    title: "Wisdom of Clarity",
    overview:
      "Krishna introduces a vision beyond the body and explains steady wisdom as the anchor for action.",
    keyThemes: [
      "Immortality of the self",
      "Equanimity",
      "Detachment in action",
    ],
    sections: [
      {
        id: "2-1",
        title: "You are more than the body",
        brief:
          "Krishna reminds Arjuna that the true self neither kills nor dies; bodies change like clothes.",
        narration:
          "By widening Arjuna's identity from warrior to timeless witness, Krishna dissolves paralyzing fear.",
        scenario:
          "During sudden career loss, remembering that identity is larger than a job allows a person to pivot creatively instead of spiralling.",
        image: "chapter-2.svg",
      },
      {
        id: "2-2",
        title: "Balanced intelligence",
        brief:
          "Steady understanding is not swayed by success or failure, pleasure or pain.",
        narration:
          "Krishna calls this state sthita-prajna—a mind like a lake without ripples, reflecting reality clearly.",
        scenario:
          "An entrepreneur celebrates the launch day and calmly maps next steps even when early sales lag, keeping the team inspired.",
        image: "chapter-2b.svg",
      },
    ],
  },
  {
    number: 3,
    slug: "karma-yoga",
    title: "Yoga of Action",
    overview:
      "Action becomes sacred when offered without clinging to personal reward.",
    keyThemes: ["Selfless service", "Discipline", "Interconnected duty"],
    sections: [
      {
        id: "3-1",
        title: "Sacred rhythm of work",
        brief:
          "The cosmos runs on cooperation; each person fuels the cycle by doing their role well.",
        narration:
          "Krishna frames work as worship when the ego releases possession of the outcome.",
        scenario:
          "A city sanitation worker shows up daily at dawn. Their consistency keeps the community healthy, even if no one applauds.",
        image: "chapter-3.svg",
      },
      {
        id: "3-2",
        title: "Offering the fruits",
        brief:
          "Act wholeheartedly, but place the results at the altar of the collective good.",
        narration:
          "When the fruit of labour is surrendered, the heart stays light and flexible.",
        scenario:
          "A research team shares open-source findings instead of guarding patents, accelerating medical breakthroughs for all.",
        image: "chapter-3b.svg",
      },
    ],
  },
  {
    number: 4,
    slug: "jnana-karma",
    title: "Wisdom in Action",
    overview:
      "Krishna reveals the timeless lineage of insight and shows how knowledge purifies action.",
    keyThemes: ["Guided lineage", "Purifying knowledge", "Inner sacrifice"],
    sections: [
      {
        id: "4-1",
        title: "Learning from timeless teachers",
        brief:
          "The Gita is part of a living conversation passed down to keep wisdom fresh.",
        narration:
          "Krishna rekindles trust by placing their dialogue inside an ancient continuum.",
        scenario:
          "A coder reads commit histories and mentorship notes before pushing major changes, respecting collective memory.",
        image: "chapter-4.svg",
      },
      {
        id: "4-2",
        title: "Inner fire of understanding",
        brief:
          "When knowledge lights the mind, actions stop leaving smoky residue.",
        narration:
          "Self-knowledge burns doubts like a clean flame, transforming work into clarity.",
        scenario:
          "After studying mindful leadership, a manager runs meetings with transparency, ending office gossip loops.",
        image: "chapter-4b.svg",
      },
    ],
  },
  {
    number: 5,
    slug: "karma-sannyasa",
    title: "Renunciation and Participation",
    overview:
      "True renunciation is inward: let go of ownership while staying fully engaged in the world.",
    keyThemes: ["Inner freedom", "Calm in chaos", "Service without ego"],
    sections: [
      {
        id: "5-1",
        title: "Walking in the world lightly",
        brief:
          "The wise person works, loves, and serves without sticking labels of 'mine' and 'yours'.",
        narration:
          "Krishna shows that freedom is an internal posture, not a change of address.",
        scenario:
          "A social worker leaves heavy stories at the doorway each night through journaling, so they can show up fresh again.",
        image: "chapter-5.svg",
      },
      {
        id: "5-2",
        title: "Peace as the true luxury",
        brief:
          "Inner stillness is the treasure that cannot be taxed, stolen, or inflated away.",
        narration:
          "This peace comes when the mind stops shouting 'I did it' and 'I failed'.",
        scenario:
          "A founder exits a startup and invests time mentoring others, discovering joy in shared growth over titles.",
        image: "chapter-5b.svg",
      },
    ],
  },
  {
    number: 6,
    slug: "dhyana-yoga",
    title: "Meditative Poise",
    overview:
      "Discipline of mind and compassion for self co-exist in the path of meditation.",
    keyThemes: ["Practice", "Self-compassion", "Mindful presence"],
    sections: [
      {
        id: "6-1",
        title: "Steady seat of awareness",
        brief:
          "Meditation is a daily craft—same place, same time, gentle breath, honest observation.",
        narration:
          "Krishna paints meditation as friendship with the mind, not a battle against thoughts.",
        scenario:
          "A parent rises before dawn to sit quietly for ten minutes, carrying that stillness into breakfast chaos.",
        image: "chapter-6.svg",
      },
      {
        id: "6-2",
        title: "Falling forward",
        brief:
          "Even if the mind wanders, the sincere practitioner never truly loses progress.",
        narration:
          "Every return to the seat adds invisible strength, like reheating metal to shape resilience.",
        scenario:
          "After missing a week of physiotherapy, an athlete restarts gently instead of quitting in shame.",
        image: "chapter-6b.svg",
      },
    ],
  },
  {
    number: 7,
    slug: "jnana-vijnana",
    title: "Knowing and Feeling the Divine",
    overview:
      "Krishna blends intellectual insight with heartfelt experience of the sacred woven through life.",
    keyThemes: ["Whole devotion", "Seeing unity", "Grace in everyday"],
    sections: [
      {
        id: "7-1",
        title: "Seeing the sacred in elements",
        brief:
          "Earth, water, fire, air, space, mind, intellect, ego—all waves of the same ocean.",
        narration:
          "Krishna invites Arjuna to taste divinity in every texture of existence.",
        scenario:
          "A chef thanks the farmers, rain, soil, and fire before plating food, turning cooking into gratitude.",
        image: "chapter-7.svg",
      },
      {
        id: "7-2",
        title: "From belief to experience",
        brief:
          "Knowledge ripens into unshakeable trust when heart and head align.",
        narration:
          "Faith becomes lived certainty through repeated glimpses of presence in daily life.",
        scenario:
          "An engineer volunteering at a hospice feels awe at patients' serenity, deepening their own spirituality.",
        image: "chapter-7b.svg",
      },
    ],
  },
  {
    number: 8,
    slug: "akshara-brahma",
    title: "Timeless Continuum",
    overview:
      "Life, death, and rebirth fit within a greater rhythm; awareness chooses the direction.",
    keyThemes: ["Conscious transition", "Memory of purpose", "Eternal presence"],
    sections: [
      {
        id: "8-1",
        title: "Awareness at life's threshold",
        brief:
          "Whatever fills the mind in the final moment directs the next chapter.",
        narration:
          "Practising remembrance daily makes the last breath an act of continuity, not panic.",
        scenario:
          "A hospice volunteer plays whispered affirmations, helping residents rest in gratitude as they pass.",
        image: "chapter-8.svg",
      },
      {
        id: "8-2",
        title: "Daily rehearsal for eternity",
        brief:
          "Every focused meditation becomes a rehearsal for conscious living and leaving.",
        narration:
          "Krishna normalises death by rehearsing presence with every sunrise.",
        scenario:
          "A dancer visualises the performance nightly, so on stage the body moves with calm precision.",
        image: "chapter-8b.svg",
      },
    ],
  },
  {
    number: 9,
    slug: "raja-vidya",
    title: "Royal Knowledge",
    overview:
      "The heart of the teaching is loving trust—simple, accessible, and transformative.",
    keyThemes: ["Devotion", "Inclusive path", "Joyful surrender"],
    sections: [
      {
        id: "9-1",
        title: "Nothing is outside grace",
        brief:
          "Even a small leaf offered with sincerity becomes a bridge to the infinite.",
        narration:
          "Krishna lowers the doorway so no seeker feels unworthy of approach.",
        scenario:
          "A teenager writes a daily thank-you note to someone unnoticed at school, turning gratitude into practice.",
        image: "chapter-9.svg",
      },
      {
        id: "9-2",
        title: "Joy of belonging",
        brief:
          "Those who remember the divine with love dwell already in that presence.",
        narration:
          "Belonging is not delayed to heaven; it is tasted in every loving remembrance.",
        scenario:
          "A commuter hums a favourite mantra on the train, arriving at work grounded despite noise.",
        image: "chapter-9b.svg",
      },
    ],
  },
  {
    number: 10,
    slug: "vibhuti-yoga",
    title: "Splendour Everywhere",
    overview:
      "Krishna points to excellence in nature and humanity as flashes of the divine signature.",
    keyThemes: ["Admiring excellence", "Unity in diversity", "Inspired perception"],
    sections: [
      {
        id: "10-1",
        title: "Catalog of wonders",
        brief:
          "From Himalayas to flowing Ganges, from wisdom of sages to courage of warriors—each peak is a door.",
        narration:
          "By naming vivid examples, Krishna trains Arjuna's sight to recognise greatness as one light.",
        scenario:
          "A teacher highlights diverse student strengths on a classroom wall, cultivating collective pride.",
        image: "chapter-10.svg",
      },
      {
        id: "10-2",
        title: "Celebrating brilliance without envy",
        brief:
          "Admiration can inspire rather than diminish when we see others as mirrors of the same source.",
        narration:
          "Every excellence becomes an invitation to expand rather than compare.",
        scenario:
          "An artist applauds a peer's award and studies their craft to deepen their own studio practice.",
        image: "chapter-10b.svg",
      },
    ],
  },
  {
    number: 11,
    slug: "visvarupa",
    title: "Vision of the Whole",
    overview:
      "Krishna grants Arjuna a cosmic vision where time, creation, and dissolution dance together.",
    keyThemes: ["Awe", "Impermanence", "Courage"],
    sections: [
      {
        id: "11-1",
        title: "Seeing beyond scale",
        brief:
          "Arjuna witnesses countless forms and timelines within Krishna's universal form.",
        narration:
          "The experience is overwhelming, reminding him that battle is one sentence in an endless epic.",
        scenario:
          "An astronaut views Earth from orbit and returns committed to planetary stewardship.",
        image: "chapter-11.svg",
      },
      {
        id: "11-2",
        title: "Grace within magnitude",
        brief:
          "Even in cosmic immensity, gentleness returns—the familiar friend who guides with love.",
        narration:
          "Krishna resumes the human form so Arjuna can act with steadied heart.",
        scenario:
          "After confronting the scale of climate change, a scientist focuses on local wetlands restoration with renewed determination.",
        image: "chapter-11b.svg",
      },
    ],
  },
  {
    number: 12,
    slug: "bhakti-yoga",
    title: "Path of Devotion",
    overview:
      "Loving attention expressed through humility, patience, and inclusive kindness becomes yoga.",
    keyThemes: ["Steady love", "Humility", "Compassion"],
    sections: [
      {
        id: "12-1",
        title: "Qualities of a bhakta",
        brief:
          "One who is friendly, fearless, and free from possessiveness lives in divine intimacy.",
        narration:
          "Devotion is less about rituals and more about how we hold each being in the heart.",
        scenario:
          "A neighbourhood group stocks a community fridge daily, greeting visitors without judgement.",
        image: "chapter-12.svg",
      },
      {
        id: "12-2",
        title: "Making love practical",
        brief:
          "If meditation feels hard, serve; if service feels hard, offer your intention—there is always a gentle entry.",
        narration:
          "Krishna layers the path with compassionate staircases for every temperament.",
        scenario:
          "A busy nurse dedicates each shift to one patient in silent prayer, transforming exhaustion into purpose.",
        image: "chapter-12b.svg",
      },
    ],
  },
  {
    number: 13,
    slug: "kshetra-kshetrajna",
    title: "Field and Knower",
    overview:
      "The body-mind is a field; awareness is the farmer who can cultivate or witness.",
    keyThemes: ["Discernment", "Self-study", "Nature and spirit"],
    sections: [
      {
        id: "13-1",
        title: "Mapping the inner field",
        brief:
          "Krishna lists qualities—desire, aversion, composure—to help Arjuna see patterns with clarity.",
        narration:
          "Naming the ingredients of experience empowers wise cultivation.",
        scenario:
          "A therapist and client map triggers on a whiteboard, turning vague anxiety into tangible steps.",
        image: "chapter-13.svg",
      },
      {
        id: "13-2",
        title: "Witness consciousness",
        brief:
          "The knower of the field remains untouched, like the sky holding every weather.",
        narration:
          "By resting as awareness, Arjuna can engage without drowning.",
        scenario:
          "During a heated meeting, a leader notes their racing pulse and chooses measured words, averting escalation.",
        image: "chapter-13b.svg",
      },
    ],
  },
  {
    number: 14,
    slug: "guna-traya",
    title: "Forces of Nature",
    overview:
      "Sattva, rajas, and tamas weave together to colour behaviour; awareness can rebalance them.",
    keyThemes: ["Self-regulation", "Understanding tendencies", "Conscious choice"],
    sections: [
      {
        id: "14-1",
        title: "Spotting the gunas",
        brief:
          "Purity uplifts, activity agitates, inertia dulls—each has a signature rhythm.",
        narration:
          "Krishna hands Arjuna a language to describe moods without shame.",
        scenario:
          "A developer noticing sluggishness takes a brisk walk, shifting from tamas to a creative sattva flow.",
        image: "chapter-14.svg",
      },
      {
        id: "14-2",
        title: "Rising above",
        brief:
          "The goal is not to banish the gunas but to become their choreographer.",
        narration:
          "By observing without attachment, one gains freedom to choose responses.",
        scenario:
          "Before negotiations, an executive journals to settle rajas into sattva, entering the room grounded.",
        image: "chapter-14b.svg",
      },
    ],
  },
  {
    number: 15,
    slug: "purushottama",
    title: "Tree of Life",
    overview:
      "Krishna describes an upside-down tree rooted in the Absolute, urging Arjuna to climb toward the source.",
    keyThemes: ["Transcending attachment", "Seeking the root", "Inner ascent"],
    sections: [
      {
        id: "15-1",
        title: "Cutting through illusion",
        brief:
          "Worldly attractions are branches; discernment is the axe that frees one to seek the roots.",
        narration:
          "Detach with gratitude, not bitterness, and the path upward appears.",
        scenario:
          "A professional declutters digital life, keeping only purposeful tools, regaining mental space.",
        image: "chapter-15.svg",
      },
      {
        id: "15-2",
        title: "Remembering the supreme person",
        brief:
          "At the root of the tree rests the eternal person who nourishes all beings.",
        narration:
          "Krishna invites Arjuna to anchor identity in this sustaining presence.",
        scenario:
          "A musician whispers gratitude to the source of creativity before each concert, staying humble and open.",
        image: "chapter-15b.svg",
      },
    ],
  },
  {
    number: 16,
    slug: "daivasura",
    title: "Divine and Shadow Qualities",
    overview:
      "Krishna contrasts expansive virtues with constricting impulses to guide ethical growth.",
    keyThemes: ["Character formation", "Ethical clarity", "Inner vigilance"],
    sections: [
      {
        id: "16-1",
        title: "Cultivating luminous traits",
        brief:
          "Fearlessness, generosity, and compassion stretch the heart's capacity.",
        narration:
          "Every generous act is a vote for the divine nature within.",
        scenario:
          "A company adopts transparent pay bands, reducing suspicion and fostering trust.",
        image: "chapter-16.svg",
      },
      {
        id: "16-2",
        title: "Transforming the shadows",
        brief:
          "Anger, arrogance, and greed shrink the horizon if left unchecked.",
        narration:
          "Notice the shadow, name it, and redirect its energy into service.",
        scenario:
          "A student feeling jealous of a peer requests to collaborate, turning rivalry into shared achievement.",
        image: "chapter-16b.svg",
      },
    ],
  },
  {
    number: 17,
    slug: "shraddha-traya",
    title: "Quality of Faith",
    overview:
      "Faith shapes choices—from food to words to rituals—revealing the guna we inhabit.",
    keyThemes: ["Intentional living", "Refining taste", "Aligned conviction"],
    sections: [
      {
        id: "17-1",
        title: "Faith flavours life",
        brief:
          "What we love to eat, read, and do mirrors the quality of attention within.",
        narration:
          "By uplifting small daily choices, faith gradually brightens.",
        scenario:
          "Someone swaps doom-scrolling at night for reading poetry, falling asleep nourished.",
        image: "chapter-17.svg",
      },
      {
        id: "17-2",
        title: "Aligning intention and action",
        brief:
          "Rituals done with vanity drain energy, but offered with sincerity replenish.",
        narration:
          "Krishna asks Arjuna to examine the 'why' beneath every act.",
        scenario:
          "A volunteer chooses a cause they authentically care about, sustaining long-term commitment.",
        image: "chapter-17b.svg",
      },
    ],
  },
  {
    number: 18,
    slug: "moksha-sannyasa",
    title: "Liberation through Surrender",
    overview:
      "Krishna synthesises all paths and invites Arjuna to surrender into purposeful action.",
    keyThemes: ["Integration", "Courageous duty", "Trust"],
    sections: [
      {
        id: "18-1",
        title: "Layers of renunciation",
        brief:
          "Let go of clinging, not of responsibility—the wise discern what to release and what to embrace.",
        narration:
          "Clarity about one's nature and duty makes every action worship.",
        scenario:
          "A teacher nearing retirement mentors successors, handing over knowledge with blessing.",
        image: "chapter-18.svg",
      },
      {
        id: "18-2",
        title: "Surrender and act",
        brief:
          "Offer every action to the highest ideal and step forward without fear.",
        narration:
          "Krishna ends with a promise: aligned action, surrendered to love, brings peace.",
        scenario:
          "An activist balances protest with constructive policy work, trusting the process while staying engaged.",
        image: "chapter-18b.svg",
      },
    ],
  },
];

const dailyQuotes = [
  {
    source: "Bhagavad Gita 2.47",
    text: "You control the action, never the harvest of the action.",
  },
  {
    source: "Bhagavad Gita 4.13",
    text: "Discernment and selfless work keep the world in harmony.",
  },
  {
    source: "Bhagavad Gita 6.26",
    text: "Bring the wandering mind back to the heart of the Self.",
  },
  {
    source: "Bhagavad Gita 12.15",
    text: "One who neither disturbs others nor is disturbed by the world is dearly loved.",
  },
  {
    source: "Bhagavad Gita 13.30",
    text: "See the same light in all beings, and you rise into the Infinite.",
  },
  {
    source: "Bhagavad Gita 14.10",
    text: "Balance the restless, the heavy, and the luminous within you.",
  },
  {
    source: "Bhagavad Gita 18.66",
    text: "Surrender to me with a full heart, and I shall free you from sorrow.",
  },
];

const artPalette = [
  "motif-dawn.svg",
  "motif-lotus.svg",
  "motif-ocean.svg",
  "motif-sky.svg",
  "motif-flame.svg",
  "motif-grove.svg",
];

let artIndex = 0;
for (const chapter of chapters) {
  for (const section of chapter.sections) {
    section.image = artPalette[artIndex % artPalette.length];
    artIndex += 1;
  }
}

const allStrings = new Set();

const collectStrings = (obj) => {
  if (typeof obj === "string") {
    allStrings.add(obj);
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach(collectStrings);
    return;
  }
  if (obj && typeof obj === "object") {
    Object.values(obj).forEach(collectStrings);
  }
};

collectStrings(chapters);
collectStrings(dailyQuotes);

const uniqueStrings = Array.from(allStrings);

async function translateText(text, targetLanguage) {
  if (targetLanguage === "en") return text;
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&dt=t" +
    `&tl=${targetLanguage}&q=${encodeURIComponent(text)}`;

  const maxAttempts = 4;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const json = await response.json();
      const translated = json[0].map((item) => item[0]).join("");
      return translated;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw new Error(
          `Failed to translate '${text}' to ${targetLanguage}: ${error}`,
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  return text;
}

async function buildTranslations() {
  const cachePath = path.join(process.cwd(), "tools", ".translation-cache.json");
  const translations = {};
  for (const { code } of languages) {
    translations[code] = {};
  }

  if (fs.existsSync(cachePath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
      for (const { code } of languages) {
        if (existing[code]) {
          translations[code] = existing[code];
        }
      }
      console.log("Loaded cached translations");
    } catch (error) {
      console.warn("Failed to read cache, starting fresh", error);
    }
  }

  let processed = 0;
  const total = uniqueStrings.length * languages.length;

  const persist = () => {
    fs.writeFileSync(cachePath, JSON.stringify(translations, null, 2));
  };

  for (const text of uniqueStrings) {
    for (const { code } of languages) {
      if (translations[code][text]) {
        processed += 1;
        continue;
      }
      const translated = await translateText(text, code);
      translations[code][text] = translated;
      processed += 1;
      if (processed % 16 === 0) {
        console.log(`Progress: ${processed}/${total}`);
        persist();
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    persist();
  }
  persist();
  return translations;
}

function generateModule(translations) {
  const header = `/* eslint-disable */\n// Auto-generated by tools/build-content.mjs\n// Multilingual Bhagavad Gita content\n\n`;
  const langList = languages
    .map((lang) => `  \"${lang.code}\"`)
    .join(",\n");
  const langConst = `export const LANGUAGES = [\n${langList}\n] as const;\nexport type Language = (typeof LANGUAGES)[number];\n\n`;

  const translationsLines = Object.entries(translations)
    .map(([lang, map]) => {
      const entries = Object.entries(map)
        .map(([key, value]) =>
          `    \"${key.replace(/\\n/g, "\\n")}\": \"${value.replace(/\\n/g, "\\n").replace(/\"/g, '\\\"')}\"`
        )
        .join(",\n");
      return `  ${lang}: {\n${entries}\n  }`;
    })
    .join(",\n");
  const translationsConst = `const TRANSLATIONS: Record<Language, Record<string, string>> = {\n${translationsLines}\n};\n\n`;

  const helper = `const localise = (text: string) => {\n  const result = {} as Record<Language, string>;\n  for (const lang of LANGUAGES) {\n    result[lang] = TRANSLATIONS[lang][text] ?? text;\n  }\n  return result;\n};\n\n`;

  const formattedChapters = chapters
    .map((chapter) => {
      const formattedSections = chapter.sections
        .map((section) => {
          return `      {\n        id: \"${section.id}\",\n        title: localise(\"${section.title}\"),\n        brief: localise(\"${section.brief}\"),\n        narration: localise(\"${section.narration}\"),\n        scenario: localise(\"${section.scenario}\"),\n        image: \"${section.image}\",\n      }`;
        })
        .join(",\n");

      const formattedThemes = chapter.keyThemes
        .map((theme) => `localise(\"${theme}\")`)
        .join(",\n      ");

      return `  {\n    number: ${chapter.number},\n    slug: \"${chapter.slug}\",\n    title: localise(\"${chapter.title}\"),\n    overview: localise(\"${chapter.overview}\"),\n    keyThemes: [\n      ${formattedThemes}\n    ],\n    sections: [\n${formattedSections}\n    ],\n  }`;
    })
    .join(",\n");

  const formattedQuotes = dailyQuotes
    .map((quote) => {
      return `  {\n    source: localise(\"${quote.source}\"),\n    text: localise(\"${quote.text}\"),\n  }`;
    })
    .join(",\n");

  const body = `export const CHAPTERS = [\n${formattedChapters}\n];\n\nexport const DAILY_QUOTES = [\n${formattedQuotes}\n];\n\nexport type LocalisedText = ReturnType<typeof localise>;\n\nexport type Chapter = (typeof CHAPTERS)[number];\nexport type ChapterSection = Chapter[\"sections\"][number];\n`;

  return header + langConst + translationsConst + helper + body;
}

(async () => {
  try {
    const translations = await buildTranslations();
    const moduleContent = generateModule(translations);
    const outputPath = path.join(process.cwd(), "src", "data", "gita.ts");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, moduleContent, "utf-8");
    console.log("Content generated at src/data/gita.ts");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
