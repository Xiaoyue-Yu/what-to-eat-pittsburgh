import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

const RESTAURANT_LIST = [
  "CAVA",
  "FiveGuys",
  "BAO",
  "McDonald's",
  "Chipotle",
  "Cane's",
  "Root",
  "西安面馆",
  "天天见面",
  "鑫福源",
  "Popeyes",
  "南翔小笼包",
  "Porch",
  "金阁",
  "pho",
];

const HOME_RECIPE_LIST = [
  "Tomato & Egg Stir-fry",
  "Fried Rice",
  "Pasta",
  "Steak",
  "Noodles",
];

const timeOptions = [
  { value: "lunch", label: "午餐" },
  { value: "dinner", label: "晚餐" },
];

const modeOptions = [
  { value: "eat-out", label: "外食" },
  { value: "cook-home", label: "做饭" },
];

function getOptionList(mode) {
  return mode === "eat-out" ? RESTAURANT_LIST : HOME_RECIPE_LIST;
}

function shuffleList(list) {
  const next = [...list];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function getCardTheme(mode) {
  return mode === "cook-home"
    ? {
        accentText: "text-[#ff8b8b]",
        buttonBorder: "border-[#ff8b8b]/40",
        buttonBg:
          "bg-[linear-gradient(180deg,#ff8b8b_0%,#d94a4a_58%,#7f1d1d_100%)]",
        panelBorder: "border-[#ff8b8b]/16",
        activeChip: "border-[#ff8b8b]/60 bg-[#ff8b8b]/12 text-[#ffb4b4]",
        backOuter:
          "bg-[linear-gradient(160deg,#f2a4a4_0%,#bb3d3d_45%,#551313_100%)]",
        backPatternBorder: "border-[#ffd1d1]/30",
        faceOuter: "border-[#ffc6c6]/30 bg-[linear-gradient(180deg,#fff1f1_0%,#efaaaa_100%)]",
        faceInner: "bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(255,232,232,0.98))]",
        faceMeta: "text-[#9f2d2d]",
      }
    : {
        accentText: "text-[#f7e7a1]",
        buttonBorder: "border-[#f4d35e]/40",
        buttonBg:
          "bg-[linear-gradient(180deg,#f4d35e_0%,#d88429_62%,#933814_100%)]",
        panelBorder: "border-[#e7c967]/16",
        activeChip: "border-[#f4d35e]/60 bg-[#f4d35e]/12 text-[#f6df93]",
        backOuter:
          "bg-[linear-gradient(160deg,#f0d36f_0%,#b56a29_45%,#4b1c12_100%)]",
        backPatternBorder: "border-[#f6df93]/30",
        faceOuter: "border-[#f3df9b]/30 bg-[linear-gradient(180deg,#f8efcf_0%,#dfc07f_100%)]",
        faceInner: "bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(252,244,223,0.96))]",
        faceMeta: "text-[#8d5c1c]",
      };
}

function App() {
  const [step, setStep] = useState("time");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [mode, setMode] = useState("");
  const [isShuffling, setIsShuffling] = useState(false);
  const [deckCards, setDeckCards] = useState([]);
  const [selectedResult, setSelectedResult] = useState("");
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [shuffleTick, setShuffleTick] = useState(0);
  const timersRef = useRef([]);

  const currentList = useMemo(() => getOptionList(mode), [mode]);
  const cardTheme = useMemo(() => getCardTheme(mode), [mode]);
  const hasSelection = Boolean(timeOfDay && mode);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  function queueTimer(fn, delay) {
    const timer = setTimeout(fn, delay);
    timersRef.current.push(timer);
  }

  function handleTimePick(nextTime) {
    setTimeOfDay(nextTime);
    setStep("mode");
  }

  function handleModePick(nextMode) {
    setMode(nextMode);
    setSelectedResult("");
    setSelectedCardIndex(null);
    setDeckCards(shuffleList(getOptionList(nextMode)));
    setShuffleTick((value) => value + 1);
    setStep("deal");
  }

  function handleReset() {
    clearTimers();
    setStep("time");
    setTimeOfDay("");
    setMode("");
    setIsShuffling(false);
    setDeckCards([]);
    setSelectedResult("");
    setSelectedCardIndex(null);
    setShuffleTick(0);
  }

  function handleCardPick(index) {
    if (isShuffling || selectedResult || index == null) {
      return;
    }

    clearTimers();
    setIsShuffling(true);
    setSelectedResult("");
    setSelectedCardIndex(index);

    queueTimer(() => {
      setSelectedResult(deckCards[index]);
      setIsShuffling(false);
    }, 980);
  }

  function handleRedeal() {
    if (!currentList.length || isShuffling) {
      return;
    }

    clearTimers();
    setSelectedResult("");
    setSelectedCardIndex(null);
    setDeckCards(shuffleList(currentList));
    setShuffleTick((value) => value + 1);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b1712] px-4 py-6 text-stone-100 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#214d36_0%,#08110d_52%,#040706_100%)]" />
      <div className="absolute inset-0 opacity-70">
        <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,211,94,0.22)_0%,transparent_68%)] blur-3xl" />
        <div className="absolute left-10 top-40 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(188,32,42,0.16)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(58,130,246,0.14)_0%,transparent_72%)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col justify-center">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-[0.12em] text-[#f7e7a1] sm:text-5xl">
              吃什么
            </h1>
            <div className="mt-2 flex gap-2 text-xs font-bold uppercase tracking-[0.3em] text-stone-400">
              <span className={timeOfDay ? "text-[#f4d35e]" : ""}>
                {timeOfDay === "lunch" ? "Lunch" : timeOfDay === "dinner" ? "Dinner" : "--"}
              </span>
              <span>/</span>
              <span className={mode ? "text-[#f4d35e]" : ""}>
                {mode === "eat-out" ? "Out" : mode === "cook-home" ? "Home" : "--"}
              </span>
            </div>
          </div>

          <IconButton onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </IconButton>
        </header>

        <section className="rounded-[2.2rem] border border-white/10 bg-black/20 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${step}-${selectedResult || "idle"}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="space-y-5"
            >
              {step === "time" && (
                <OptionGrid
                  options={timeOptions}
                  onPick={handleTimePick}
                  selectedValue={timeOfDay}
                />
              )}

              {step === "mode" && (
                <OptionGrid
                  options={modeOptions}
                  onPick={handleModePick}
                  selectedValue={mode}
                />
              )}

              {step === "deal" && (
                <>
                  <DeckTable
                    key={shuffleTick}
                    cards={deckCards}
                    isShuffling={isShuffling}
                    theme={cardTheme}
                    selectedResult={selectedResult}
                    selectedCardIndex={selectedCardIndex}
                    onCardPick={handleCardPick}
                    onRedeal={handleRedeal}
                  />
                  <MiniList
                    items={hasSelection ? currentList : []}
                    activeItem={selectedResult}
                    theme={cardTheme}
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}

function OptionGrid({ options, onPick, selectedValue }) {
  return (
    <div className="grid min-h-[24rem] gap-4 sm:grid-cols-2">
      {options.map((option, index) => (
        <motion.button
          key={option.value}
          initial={{ opacity: 0, y: 28, rotate: index === 0 ? -2 : 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          whileHover={{ y: -6, rotate: index === 0 ? -1.5 : 1.5 }}
          whileTap={{ scale: 0.98, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          onClick={() => onPick(option.value)}
          className={`group relative min-h-[11rem] overflow-hidden rounded-[1.8rem] border p-5 text-left ${
            selectedValue === option.value
              ? "border-[#f4d35e]/70 bg-[linear-gradient(160deg,rgba(142,97,20,0.92),rgba(44,22,10,0.98))]"
              : "border-white/10 bg-[linear-gradient(160deg,rgba(25,25,22,0.96),rgba(7,8,10,0.96))]"
          } shadow-[0_20px_60px_rgba(0,0,0,0.38)]`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,211,94,0.16),transparent_35%)] opacity-70" />
          <div className="relative flex h-full items-end">
            <div className="text-4xl font-black tracking-[0.08em] text-stone-50 sm:text-5xl">
              {option.label}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function DeckTable({
  cards,
  isShuffling,
  selectedResult,
  selectedCardIndex,
  onCardPick,
  onRedeal,
  theme,
}) {
  return (
    <div
      className={`rounded-[1.9rem] border ${theme.panelBorder} bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),rgba(255,255,255,0.02)_28%,rgba(0,0,0,0.24)_70%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]`}
    >
      <div className="relative min-h-[31rem] overflow-hidden rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(20,52,35,0.9),rgba(11,25,18,0.96))] p-4 sm:p-6">
        <div className="absolute right-4 top-4 z-30">
          <button
            onClick={onRedeal}
            disabled={isShuffling}
            className={`h-14 rounded-full border px-6 text-xs font-black uppercase tracking-[0.28em] transition-all ${
              isShuffling
                ? "cursor-not-allowed border-white/10 bg-white/5 text-stone-500"
                : `${theme.buttonBorder} ${theme.buttonBg} text-stone-950 shadow-[0_12px_34px_rgba(0,0,0,0.35)] hover:translate-y-[-2px]`
            }`}
          >
            {isShuffling ? "Drawing" : selectedResult ? "Again" : "Shuffle"}
          </button>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_55%)]" />
        <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/6" />

        <div className="relative flex min-h-[23rem] items-center justify-center px-3">
          <div className="relative flex w-full max-w-5xl flex-wrap items-center justify-center gap-2 sm:gap-3">
            {cards.map((item, index) => (
              <BackCard
                key={`${item}-${index}`}
                index={index}
                total={cards.length}
                isShuffling={isShuffling}
                isSelected={selectedCardIndex === index}
                isRevealed={Boolean(selectedResult)}
                isDimmed={selectedCardIndex !== null && selectedCardIndex !== index}
                theme={theme}
                onPick={() => onCardPick(index)}
              />
            ))}

            <AnimatePresence>
              {selectedResult && selectedCardIndex !== null && !isShuffling && (
                <motion.div
                  initial={{ y: 8, scale: 0.9, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 12, scale: 0.92, opacity: 0 }}
                  transition={{
                    duration: 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="pointer-events-none absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2"
                >
                  <FaceCard label={selectedResult} featured theme={theme} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative mt-4 flex min-h-16 items-center justify-center">
          <AnimatePresence mode="wait">
            {selectedResult ? (
              <motion.div
                key={selectedResult}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`text-center text-3xl font-black tracking-[0.06em] ${theme.accentText} sm:text-4xl`}
              >
                {selectedResult}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="text-xs font-bold uppercase tracking-[0.45em] text-stone-500"
              >
                {isShuffling ? "Drawing..." : "Pick A Card"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative mt-4 flex flex-wrap justify-center gap-3">
          {cards.map((item, index) => (
            <motion.div
              key={`${item}-${index}`}
              initial={{ opacity: 0, y: 16, rotate: -4 + index }}
              animate={{ opacity: 0.92, y: 0, rotate: -4 + index }}
              transition={{ delay: index * 0.03 }}
              className="hidden sm:block"
            >
              <MiniCard label={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BackCard({
  index,
  total,
  isShuffling,
  isSelected,
  isRevealed,
  isDimmed,
  theme,
  onPick,
}) {
  const spread = total > 1 ? index / (total - 1) - 0.5 : 0;
  const baseRotate = spread * 22;
  const lift = 18 - Math.abs(spread) * 36;

  return (
    <motion.div
      initial={{ x: 0, y: 54, rotate: 0, scale: 0.92, opacity: 0 }}
      animate={
        isSelected && isShuffling
          ? {
              y: [lift, lift - 22, lift + 10, lift - 36, -92],
              rotate: [baseRotate, baseRotate - 8, baseRotate + 6, 0, 0],
              scale: [1, 1.04, 0.98, 1.08, 1.12],
              opacity: [1, 1, 1, 1, 0],
            }
          : {
              x: 0,
              y: isDimmed && isRevealed ? 52 : lift,
              rotate: isDimmed && isRevealed ? baseRotate * 0.45 : baseRotate,
              scale: isSelected && !isRevealed ? 1.02 : 1,
              opacity: isDimmed && isRevealed ? 0 : 1,
            }
      }
      transition={{
        duration: isSelected && isShuffling ? 0.96 : 0.52,
        times: isSelected && isShuffling ? [0, 0.2, 0.45, 0.72, 1] : undefined,
        ease: [0.22, 1, 0.36, 1],
        delay: isSelected && isShuffling ? 0.03 : index * 0.035,
      }}
      whileHover={!isShuffling && !isRevealed ? { y: lift - 12, scale: 1.03 } : undefined}
      whileTap={!isShuffling && !isRevealed ? { scale: 0.98 } : undefined}
      className={`h-36 w-24 origin-bottom rounded-[1.3rem] border border-white/20 ${theme.backOuter} p-[3px] shadow-[0_18px_30px_rgba(0,0,0,0.34)] sm:h-40 sm:w-28 ${
        isShuffling || isRevealed ? "pointer-events-none" : "cursor-pointer"
      }`}
      style={{ zIndex: isSelected ? total + 10 : index + 1 }}
      onClick={onPick}
    >
      <div className="flex h-full w-full items-center justify-center rounded-[1.05rem] border border-black/20 bg-[radial-gradient(circle_at_top,#2d3d79_0%,#192140_55%,#0e1224_100%)]">
        <div
          className={`h-24 w-16 rounded-[0.9rem] border ${theme.backPatternBorder} bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.18)_0,rgba(255,255,255,0.18)_8px,transparent_8px,transparent_16px)]`}
        />
      </div>
    </motion.div>
  );
}

function MiniCard({ label }) {
  return (
    <div className="flex min-h-16 min-w-28 items-center justify-center rounded-[1rem] border border-white/8 bg-white/[0.05] px-4 py-3 text-center text-xs font-bold tracking-[0.04em] text-stone-200">
      {label}
    </div>
  );
}

function MiniList({ items, activeItem, theme }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <div
          key={item}
          className={`rounded-full border px-3 py-1.5 text-xs font-bold tracking-[0.08em] ${
            item === activeItem
              ? theme.activeChip
              : "border-white/8 bg-white/[0.04] text-stone-400"
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
function FaceCard({ label, featured = false, theme }) {
  return (
    <div
      className={`rounded-[1.7rem] ${theme.faceOuter} p-[3px] text-stone-950 shadow-[0_24px_70px_rgba(0,0,0,0.42)] ${
        featured ? "h-56 w-40" : "h-48 w-34"
      }`}
    >
      <div className={`flex h-full w-full flex-col rounded-[1.45rem] border border-black/10 ${theme.faceInner} p-4`}>
        <div className={`text-xs font-black uppercase tracking-[0.35em] ${theme.faceMeta}`}>Pick</div>
        <div className="flex flex-1 items-center justify-center text-center text-2xl font-black leading-tight tracking-[0.04em] text-stone-950">
          {label}
        </div>
        <div className={`text-right text-xs font-bold uppercase tracking-[0.35em] ${theme.faceMeta}`}>Eat</div>
      </div>
    </div>
  );
}

function IconButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-stone-200 transition-all hover:border-[#f4d35e]/40 hover:bg-[#f4d35e]/10 hover:text-[#f8e8a8]"
    >
      {children}
    </button>
  );
}

export default App;
