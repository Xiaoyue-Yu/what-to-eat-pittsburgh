import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Sparkles, UtensilsCrossed } from "lucide-react";

const RESTAURANT_LIST = [
  "Restaurant A",
  "Restaurant B",
  "Restaurant C",
  "Restaurant D",
  "Restaurant E",
];

const HOME_RECIPE_LIST = [
  "Tomato & Egg Stir-fry",
  "Fried Rice",
  "Pasta",
  "Steak",
  "Noodles",
];

const STEP_COPY = {
  time: {
    title: "今天吃什么？",
    subtitle: "匹兹堡觅食决策局，开局先决定是中饭还是晚饭。",
  },
  mode: {
    title: "选择你的路线",
    subtitle: "出门觅食，还是在家开火？命运会沿着你的选择发牌。",
  },
  spin: {
    title: "命运转盘",
    subtitle: "按下按钮，像洗牌一样快速翻动，最后停在今天的答案。",
  },
};

const timeOptions = [
  { value: "lunch", label: "中饭", accent: "午场", description: "来一局轻快的午餐决策" },
  { value: "dinner", label: "晚饭", accent: "夜场", description: "把今晚的胃口交给幸运女神" },
];

const modeOptions = [
  { value: "eat-out", label: "在外吃", accent: "外食牌组", description: "切到餐馆牌堆，抽一家出门开吃" },
  { value: "cook-home", label: "自己做", accent: "家常牌组", description: "切到厨房牌堆，抽一道今晚要做的菜" },
];

const shimmer =
  "before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(120deg,transparent_15%,rgba(255,255,255,0.16)_48%,transparent_82%)] before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100";

function getOptionList(mode) {
  return mode === "eat-out" ? RESTAURANT_LIST : HOME_RECIPE_LIST;
}

function randomFromList(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function App() {
  const [step, setStep] = useState("time");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [mode, setMode] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayValue, setDisplayValue] = useState("等待发牌");
  const [selectedResult, setSelectedResult] = useState("");
  const [flash, setFlash] = useState(0);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const currentList = getOptionList(mode);
  const hasSelection = Boolean(timeOfDay && mode);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleTimePick(nextTime) {
    setTimeOfDay(nextTime);
    setStep("mode");
  }

  function handleModePick(nextMode) {
    setMode(nextMode);
    setSelectedResult("");
    setDisplayValue("准备抽取");
    setStep("spin");
  }

  function handleStartOver() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setStep("time");
    setTimeOfDay("");
    setMode("");
    setIsSpinning(false);
    setSelectedResult("");
    setDisplayValue("等待发牌");
  }

  function handleSpin() {
    if (isSpinning || !currentList.length) {
      return;
    }

    const winner = randomFromList(currentList);
    setIsSpinning(true);
    setSelectedResult("");
    setFlash((value) => value + 1);

    let tick = 0;
    const reelItems = [...currentList, ...currentList, ...currentList];

    intervalRef.current = setInterval(() => {
      const nextItem = reelItems[tick % reelItems.length];
      setDisplayValue(nextItem);
      tick += 1;
    }, 90);

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      setDisplayValue(winner);
      setSelectedResult(winner);
      setIsSpinning(false);
    }, 2500);
  }

  const stageCopy = STEP_COPY[step];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#15533c_0%,#07130f_48%,#020404_100%)] px-4 py-8 text-stone-50 sm:px-6 lg:px-8">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(248,201,72,0.2)_0%,transparent_68%)] blur-3xl" />
        <div className="absolute -left-20 top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(7,135,215,0.22)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute -right-12 bottom-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(238,55,82,0.18)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center">
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-300/35 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.4em] text-amber-200 shadow-[0_0_24px_rgba(253,224,71,0.18)] backdrop-blur">
            <Sparkles className="h-4 w-4" />
            What to Eat in Pittsburgh?
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-[0.1em] text-transparent drop-shadow-[0_4px_0_rgba(0,0,0,0.45)] sm:text-6xl lg:text-7xl">
            <span className="bg-[linear-gradient(180deg,#fff4bf_0%,#f8ca48_38%,#ff756e_100%)] bg-clip-text">
              匹兹堡今天吃什么
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-stone-200/78 sm:text-base">
            复古赌场风抽签机，三步决定今天的命运菜单。先选场次，再选路线，最后一把抽出答案。
          </p>
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="relative overflow-hidden rounded-[2rem] border border-amber-200/18 bg-black/35 p-5 shadow-[0_0_0_1px_rgba(251,191,36,0.08),0_26px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7">
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(251,191,36,0.8),transparent)]" />
            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-[0.35em] text-sky-300">
                Stage {step === "time" ? "01" : step === "mode" ? "02" : "03"}
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-[0.08em] text-stone-50 sm:text-4xl">
                {stageCopy.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300/80 sm:text-base">
                {stageCopy.subtitle}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {step === "time" && (
                <motion.div
                  key="time"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ type: "spring", stiffness: 140, damping: 18 }}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  {timeOptions.map((option) => (
                    <OptionCard
                      key={option.value}
                      title={option.label}
                      accent={option.accent}
                      description={option.description}
                      onClick={() => handleTimePick(option.value)}
                    />
                  ))}
                </motion.div>
              )}

              {step === "mode" && (
                <motion.div
                  key="mode"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ type: "spring", stiffness: 140, damping: 18 }}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  {modeOptions.map((option) => (
                    <OptionCard
                      key={option.value}
                      title={option.label}
                      accent={option.accent}
                      description={option.description}
                      onClick={() => handleModePick(option.value)}
                    />
                  ))}
                </motion.div>
              )}

              {step === "spin" && (
                <motion.div
                  key="spin"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ type: "spring", stiffness: 140, damping: 18 }}
                  className="space-y-6"
                >
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                    <div className="rounded-[1.6rem] border border-sky-300/20 bg-[linear-gradient(180deg,rgba(16,30,31,0.95),rgba(3,8,9,0.92))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.35)]">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-stone-400">
                        <span>{timeOfDay === "lunch" ? "中饭牌局" : "晚饭牌局"}</span>
                        <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-1 text-amber-200">
                          {mode === "eat-out" ? "外食牌组" : "家常牌组"}
                        </span>
                      </div>
                      <SlotDisplay
                        value={displayValue}
                        isSpinning={isSpinning}
                        flashKey={flash}
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <ActionButton onClick={handleSpin} disabled={isSpinning}>
                        {isSpinning ? "洗牌中..." : "开始抽签"}
                      </ActionButton>
                      <SecondaryButton onClick={handleStartOver}>
                        重新开局
                      </SecondaryButton>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 28, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 170, damping: 14 }}
                        className="relative overflow-hidden rounded-[1.8rem] border border-amber-300/35 bg-[linear-gradient(135deg,rgba(83,28,21,0.88),rgba(23,17,4,0.96))] p-5 shadow-[0_0_30px_rgba(248,201,72,0.18),0_24px_80px_rgba(0,0,0,0.38)]"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,221,124,0.28),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.2),transparent_36%)]" />
                        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="text-xs font-bold uppercase tracking-[0.35em] text-amber-200/80">
                              今日揭晓
                            </div>
                            <div className="mt-2 text-3xl font-black tracking-[0.08em] text-stone-50 sm:text-4xl">
                              {selectedResult}
                            </div>
                            <p className="mt-2 text-sm text-stone-200/78">
                              {mode === "eat-out"
                                ? "命运建议你直接出门，冲这一家。"
                                : "命运建议你今晚开火，就做这一道。"}
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <ActionButton onClick={handleSpin} disabled={isSpinning} compact>
                              再抽一次
                            </ActionButton>
                            <SecondaryButton onClick={handleStartOver} compact>
                              从头再来
                            </SecondaryButton>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <aside className="grid gap-6">
            <div className="rounded-[2rem] border border-sky-300/18 bg-[linear-gradient(180deg,rgba(6,18,25,0.88),rgba(3,6,10,0.94))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl">
              <div className="flex items-center gap-3 text-sky-200">
                <UtensilsCrossed className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-[0.28em]">
                  当前牌面
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <StatusChip
                  label="用餐时段"
                  value={
                    timeOfDay
                      ? timeOfDay === "lunch"
                        ? "中饭"
                        : "晚饭"
                      : "尚未选择"
                  }
                />
                <StatusChip
                  label="路线"
                  value={
                    mode
                      ? mode === "eat-out"
                        ? "在外吃"
                        : "自己做"
                      : "尚未选择"
                  }
                />
                <StatusChip
                  label="候选池"
                  value={hasSelection ? `${currentList.length} 个选项` : "等待建立牌组"}
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-rose-300/18 bg-[linear-gradient(180deg,rgba(31,7,12,0.88),rgba(8,3,4,0.96))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl">
              <div className="text-sm font-bold uppercase tracking-[0.28em] text-rose-200">
                牌组预览
              </div>
              <div className="mt-4 grid gap-3">
                {(hasSelection ? currentList : ["等待选择后显示牌组"]).map((item, index) => (
                  <motion.div
                    key={`${item}-${index}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm font-semibold tracking-[0.05em] text-stone-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function OptionCard({ title, accent, description, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 240, damping: 16 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[1.7rem] border border-amber-300/22 bg-[linear-gradient(150deg,rgba(38,16,6,0.96),rgba(8,8,12,0.95)_48%,rgba(8,30,33,0.96))] p-5 text-left shadow-[0_0_0_1px_rgba(245,158,11,0.06),0_24px_60px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-amber-300/55 hover:shadow-[0_0_26px_rgba(250,204,21,0.18),0_28px_70px_rgba(0,0,0,0.42)] ${shimmer}`}
    >
      <div className="absolute right-3 top-3 rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-sky-200">
        {accent}
      </div>
      <div className="relative">
        <div className="text-sm font-bold uppercase tracking-[0.35em] text-amber-200/72">
          Choose
        </div>
        <div className="mt-7 text-3xl font-black tracking-[0.08em] text-stone-50">{title}</div>
        <p className="mt-3 max-w-xs text-sm leading-6 text-stone-300/82">{description}</p>
      </div>
    </motion.button>
  );
}

function SlotDisplay({ value, isSpinning, flashKey }) {
  return (
    <motion.div
      key={flashKey}
      animate={isSpinning ? { boxShadow: ["0 0 0 rgba(14,165,233,0)", "0 0 36px rgba(14,165,233,0.28)", "0 0 0 rgba(14,165,233,0)"] } : undefined}
      transition={{ repeat: isSpinning ? Infinity : 0, duration: 0.9 }}
      className="mt-4 rounded-[1.5rem] border border-amber-200/18 bg-[linear-gradient(180deg,rgba(245,183,66,0.08),rgba(255,255,255,0.02))] p-4 sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.3em] text-stone-400">
        <span>抽签窗口</span>
        <span className={isSpinning ? "text-sky-300" : "text-amber-200"}>
          {isSpinning ? "Spinning" : "Ready"}
        </span>
      </div>
      <div className="relative overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/45 px-4 py-8 shadow-[inset_0_2px_12px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-x-0 top-1/2 h-16 -translate-y-1/2 rounded-xl border-y border-amber-200/20 bg-amber-300/[0.06]" />
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ opacity: 0, y: -40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.8 }}
            className="relative z-10 text-center text-3xl font-black tracking-[0.08em] text-stone-50 sm:text-4xl"
          >
            {value}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ActionButton({ children, disabled, onClick, compact = false }) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 250, damping: 16 }}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-[1.25rem] border border-amber-300/35 bg-[linear-gradient(180deg,#f6ce5a_0%,#de8d1d_52%,#9f3412_100%)] px-5 font-black tracking-[0.08em] text-stone-950 shadow-[0_10px_0_rgba(117,44,18,0.85),0_20px_40px_rgba(0,0,0,0.35)] transition-all duration-200 ${compact ? "py-3 text-sm" : "py-4 text-base"} ${disabled ? "cursor-not-allowed opacity-60 shadow-[0_8px_0_rgba(117,44,18,0.55)]" : "hover:brightness-110"}`}
    >
      {children}
    </motion.button>
  );
}

function SecondaryButton({ children, onClick, compact = false }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-[1.25rem] border border-white/12 bg-white/[0.06] px-5 font-bold tracking-[0.08em] text-stone-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-200 hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-100 ${compact ? "py-3 text-sm" : "py-4 text-base"}`}
    >
      <RotateCcw className="h-4 w-4" />
      {children}
    </motion.button>
  );
}

function StatusChip({ label, value }) {
  return (
    <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-stone-400">{label}</div>
      <div className="mt-2 text-lg font-black tracking-[0.06em] text-stone-50">{value}</div>
    </div>
  );
}

export default App;
