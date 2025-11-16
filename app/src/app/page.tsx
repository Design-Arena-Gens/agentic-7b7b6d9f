"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CHAPTERS,
  DAILY_QUOTES,
  LANGUAGES,
  type Chapter,
  type ChapterSection,
  type Language,
} from "@/data/gita";

const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  hi: "हिन्दी",
  ml: "Malayalam",
  ta: "தமிழ்",
  kn: "ಕನ್ನಡ",
  te: "తెలుగు",
  bn: "বাংলা",
  ar: "العربية",
};

const SPEECH_LANG_CODES: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  ml: "ml-IN",
  ta: "ta-IN",
  kn: "kn-IN",
  te: "te-IN",
  bn: "bn-IN",
  ar: "ar-SA",
};

const TAMPURA_FREQUENCIES = [136.1, 204.15, 272.2, 408.3];

const computeDailyQuoteIndex = () => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.valueOf() - startOfYear.valueOf();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear % DAILY_QUOTES.length;
};

const chapterSort = (a: Chapter, b: Chapter) => a.number - b.number;

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [activeNarration, setActiveNarration] = useState<string | null>(null);
  const [isTanpuraOn, setTanpuraOn] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const tanpuraNodesRef = useRef<GainNode[]>([]);

  const sortedChapters = useMemo(() => [...CHAPTERS].sort(chapterSort), []);
  const selectedChapter = sortedChapters[chapterIndex] ?? sortedChapters[0];

  const quoteIndex = useMemo(computeDailyQuoteIndex, []);
  const dailyQuote = DAILY_QUOTES[quoteIndex];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    };

    updateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setActiveNarration(null);
  }, [language, chapterIndex]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
      stopTanpura();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getVoiceForLanguage = (lang: Language) => {
    const targetCode = SPEECH_LANG_CODES[lang];
    if (!targetCode) return undefined;

    const directMatch = voices.find((voice) =>
      voice.lang.toLowerCase().startsWith(targetCode.toLowerCase()),
    );
    if (directMatch) return directMatch;

    const baseMatch = voices.find((voice) =>
      voice.lang.toLowerCase().startsWith(targetCode.split("-")[0]),
    );
    return baseMatch;
  };

  const handleNarrate = (section: ChapterSection) => {
    if (typeof window === "undefined") return;
    const synthesis = window.speechSynthesis;

    if (activeNarration === section.id) {
      synthesis.cancel();
      setActiveNarration(null);
      return;
    }

    synthesis.cancel();

    const text = [
      section.title[language],
      section.brief[language],
      section.narration[language],
      section.scenario[language],
    ]
      .filter(Boolean)
      .join(". ");

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LANG_CODES[language] ?? "en-IN";
    const voice = getVoiceForLanguage(language);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = 0.96;
    utterance.pitch = 1;

    utterance.onend = () => setActiveNarration(null);
    utterance.onerror = () => setActiveNarration(null);

    utteranceRef.current = utterance;
    synthesis.speak(utterance);
    setActiveNarration(section.id);
  };

  const stopTanpura = () => {
    if (tanpuraNodesRef.current.length > 0) {
      tanpuraNodesRef.current.forEach((gain) => {
        const node = oscillatorFromGain(gain);
        if (node) {
          try {
            node.stop();
          } catch {
            // no-op if already stopped
          }
          node.disconnect();
        }
        gain.disconnect();
      });
      tanpuraNodesRef.current = [];
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => undefined);
      audioCtxRef.current = null;
    }
    setTanpuraOn(false);
  };

  const oscillatorFromGain = (gain: GainNode) => {
    // @ts-expect-error custom tracking
    return gain.__oscillator as OscillatorNode | undefined;
  };

  const startTanpura = async () => {
    if (typeof window === "undefined") return;
    if (isTanpuraOn) {
      stopTanpura();
    }

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    tanpuraNodesRef.current = [];

    const baseGain = ctx.createGain();
    baseGain.gain.value = 0.08;
    baseGain.connect(ctx.destination);

    TAMPURA_FREQUENCIES.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      oscillator.type = index % 2 === 0 ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.value = 0.08 - index * 0.01;
      oscillator.connect(gain);
      gain.connect(baseGain);
      // @ts-expect-error custom tracking
      gain.__oscillator = oscillator;
      tanpuraNodesRef.current.push(gain);
      oscillator.start();
    });

    setTanpuraOn(true);
  };

  const toggleTanpura = () => {
    if (isTanpuraOn) {
      stopTanpura();
    } else {
      startTanpura();
    }
  };

  const themeBadges = selectedChapter.keyThemes.map((theme) => (
    <span
      key={theme[language]}
      className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-900 shadow-sm backdrop-blur"
    >
      {theme[language]}
    </span>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-sky-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-24 pt-12 sm:px-8">
        <header className="flex flex-col gap-6 rounded-3xl bg-white/70 px-6 py-8 shadow-xl shadow-amber-200/30 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-amber-500">Bhagavad Gita Companion</p>
              <h1 className="mt-1 max-w-3xl text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
                {"Journey through the Gita's 18 chapters with voice, visuals, and lived wisdom."}
              </h1>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <label className="text-xs font-semibold uppercase text-slate-500">
                Choose Language
              </label>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/60 md:w-56"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {LANGUAGE_LABELS[lang]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-amber-100 via-white to-emerald-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                Daily Dawn Quote
              </p>
              <p className="mt-2 max-w-2xl text-lg font-medium text-slate-800">
                “{dailyQuote.text[language]}”
              </p>
              <p className="mt-1 text-sm text-slate-500">— {dailyQuote.source[language]}</p>
            </div>
            <button
              onClick={toggleTanpura}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                isTanpuraOn
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                  : "bg-white text-emerald-600 shadow-md shadow-emerald-200/60"
              }`}
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-current" />
              {isTanpuraOn ? "Stop Tanpura Drone" : "Play Tanpura Drone"}
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="flex flex-col gap-4 rounded-3xl bg-white/80 p-6 shadow-lg shadow-amber-200/30 backdrop-blur lg:col-span-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Chapters
            </h2>
            <div className="flex flex-col gap-3 overflow-y-auto pr-1" style={{ maxHeight: "32rem" }}>
              {sortedChapters.map((chapter, index) => {
                const isActive = index === chapterIndex;
                return (
                  <button
                    key={chapter.slug ?? String(chapter.number)}
                    onClick={() => setChapterIndex(index)}
                    className={`flex flex-col rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
                      isActive
                        ? "border-transparent bg-gradient-to-r from-amber-200 via-amber-100 to-white shadow-lg"
                        : "border-slate-200 bg-white/80 hover:border-amber-200"
                    }`}
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
                      {chapter.number.toString().padStart(2, "0")}
                    </span>
                    <span className="mt-1 text-base font-semibold text-slate-900">
                      {chapter.title[language]}
                    </span>
                    <span className="mt-1 text-sm text-slate-600">
                      {chapter.overview[language]}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="flex flex-col gap-6 lg:col-span-8">
            <section className="flex flex-col gap-6 rounded-3xl bg-white/90 p-6 shadow-xl shadow-amber-200/40 backdrop-blur">
              <div className="flex flex-col gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-700">
                  <span>Chapter {selectedChapter.number}</span>
                  <span>•</span>
                  <span>{selectedChapter.title[language]}</span>
                </div>
                <p className="text-lg text-slate-700">
                  {selectedChapter.overview[language]}
                </p>
                <div className="flex flex-wrap gap-2">{themeBadges}</div>
              </div>
            </section>

            {selectedChapter.sections.map((section) => {
              const isNarrating = activeNarration === section.id;
              return (
                <article
                  key={section.id}
                  className={`grid gap-6 rounded-3xl p-6 shadow-lg backdrop-blur transition ${
                    isNarrating
                      ? "bg-gradient-to-br from-emerald-100 via-white to-amber-100 shadow-emerald-200/60"
                      : "bg-white/90 shadow-amber-200/40"
                  } md:grid-cols-[minmax(0,1fr)_220px]`}
                >
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {section.title[language]}
                      </h3>
                      <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-amber-500">
                        {"Brief Insight"}
                      </p>
                      <p className="mt-1 text-base text-slate-700">
                        {section.brief[language]}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/80 p-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.15em] text-emerald-600">
                        Guided Narration
                      </p>
                      <p className="mt-1 text-base text-slate-700">
                        {section.narration[language]}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-amber-50/70 p-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-600">
                        Real-life Scenario
                      </p>
                      <p className="mt-1 text-base text-slate-700">
                        {section.scenario[language]}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleNarrate(section)}
                        className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          isNarrating
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                            : "bg-white text-emerald-600 shadow-md shadow-emerald-200/60"
                        }`}
                      >
                        {isNarrating ? "Stop Narration" : "Play Narration"}
                      </button>
                    </div>
                  </div>
                  <div className="relative h-52 w-full overflow-hidden rounded-2xl border border-white/60 shadow-inner">
                    <Image
                      src={`/images/${section.image}`}
                      alt={section.title[language]}
                      fill
                      className="object-cover"
                    />
                  </div>
                </article>
              );
            })}
          </main>
        </div>
      </div>
    </div>
  );
}
