(function () {
  const codeATextarea = document.getElementById("code-a");
  const codeBTextarea = document.getElementById("code-b");
  const iterationsEl = document.getElementById("iterations");
  const runBtn = document.getElementById("run-benchmark");
  const resultsEl = document.getElementById("results");
  const consoleOutputEl = document.getElementById("console-output");
  const themeSelectEl = document.getElementById("editor-theme");
  const iterationsArrowUp = document.querySelector(".number-input-arrow--up");
  const iterationsArrowDown = document.querySelector(
    ".number-input-arrow--down"
  );
  const cyrillicSoundToggle = document.getElementById("cyrillic-sound-toggle");

  // Инициализация CodeMirror для обоих редакторов
  const codeAEditor = CodeMirror.fromTextArea(codeATextarea, {
    mode: "javascript",
    lineNumbers: true,
    tabSize: 2,
    indentUnit: 2,
    indentWithTabs: false,
    lineWrapping: true,
    theme: "material-darker",
    autoCloseBrackets: true,
  });

  const codeBEditor = CodeMirror.fromTextArea(codeBTextarea, {
    mode: "javascript",
    lineNumbers: true,
    tabSize: 2,
    indentUnit: 2,
    indentWithTabs: false,
    lineWrapping: true,
    theme: "material-darker",
    autoCloseBrackets: true,
  });

  let beepAudioContext = null;

  function playBeepForCyrillic() {
    // Проверяем, включена ли опция звукового сигнала
    if (!cyrillicSoundToggle || !cyrillicSoundToggle.checked) return;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!beepAudioContext) {
      try {
        beepAudioContext = new AudioCtx();
      } catch (e) {
        return;
      }
    }

    const ctx = beepAudioContext;
    const duration = 0.09;
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "square";
    oscillator.frequency.value = 880;

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  function setResults(text) {
    resultsEl.textContent = text;
  }

  function setConsoleOutput(text) {
    if (!consoleOutputEl) return;
    consoleOutputEl.textContent = text;
    consoleOutputEl.scrollTop = consoleOutputEl.scrollHeight;
  }

  function scrollToResults() {
    if (resultsEl && typeof resultsEl.scrollIntoView === "function") {
      resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function parseIterations() {
    const raw = iterationsEl.value.replace(/\s/g, "");
    let n = Number(raw);
    if (!Number.isFinite(n) || n <= 0) {
      n = 100000;
    }
    n = Math.floor(n);
    if (n > 5000000) n = 5000000;
    iterationsEl.value = String(n);
    return n;
  }

  function stepIterations(delta) {
    if (!iterationsEl) return;
    const step = Number(iterationsEl.step) || 1;
    const steps = delta > 0 ? 1 : -1;
    if (typeof iterationsEl.stepUp === "function" && steps > 0) {
      iterationsEl.stepUp(steps);
    } else if (typeof iterationsEl.stepDown === "function" && steps < 0) {
      iterationsEl.stepDown(-steps);
    } else {
      const current = Number(iterationsEl.value.replace(/\s/g, "")) || 0;
      iterationsEl.value = String(current + steps * step);
    }
    parseIterations();
  }

  function buildFunction(code, label) {
    try {
      // Передаём объект console как аргумент, чтобы можно было подменять его
      const fn = new Function("console", code);
      return { fn, error: null };
    } catch (e) {
      return {
        fn: null,
        error: "Ошибка при разборе кода " + label + ": " + e.message,
      };
    }
  }

  function measure(fn, iterations, label, consoleForFn) {
    const start = performance.now();
    try {
      for (let i = 0; i < iterations; i++) {
        // Передаём наш "подменённый" console внутрь кода пользователя
        fn(consoleForFn);
      }
    } catch (e) {
      return {
        error: "Ошибка во время выполнения кода " + label + ": " + e.message,
      };
    }
    const end = performance.now();
    const totalMs = end - start;
    return {
      totalMs,
      avgMs: totalMs / iterations,
      error: null,
    };
  }

  function formatMs(value) {
    if (!Number.isFinite(value)) return "—";
    if (value < 0.01) return value.toExponential(2) + " ms";
    return value.toFixed(3) + " ms";
  }

  function onRunBenchmark() {
    const codeA = codeAEditor.getValue() || "";
    const codeB = codeBEditor.getValue() || "";
    const iterations = parseIterations();

    setResults(
      "Выполняется бенчмарк...\nЭто может занять немного времени при большом числе итераций."
    );

    // Очищаем лог консоли перед новым запуском
    if (consoleOutputEl) {
      setConsoleOutput(
        "Ожидание вывода из console.log / console.debug во время текущего запуска..."
      );
    }

    // Небольшая задержка, чтобы обновить UI перед тяжёлой работой
    setTimeout(() => {
      const buildA = buildFunction(codeA, "варианта A");
      const buildB = buildFunction(codeB, "варианта B");

      if (buildA.error || buildB.error) {
        let msg = "Не удалось запустить бенчмарк из‑за ошибок в коде:\n\n";
        if (buildA.error) msg += "- " + buildA.error + "\n";
        if (buildB.error) msg += "- " + buildB.error + "\n";
        setResults(msg.trimEnd());
        if (consoleOutputEl) {
          setConsoleOutput(
            "Из‑за ошибок в коде бенчмарк не был запущен, вывод консоли отсутствует."
          );
        }
        scrollToResults();
        return;
      }

      // Буфер для логов текущего запуска
      const consoleLines = [];
      const nativeConsole = window.console || {};

      function formatConsoleArg(arg) {
        if (typeof arg === "string") return arg;
        if (typeof arg === "number" || typeof arg === "boolean") {
          return String(arg);
        }
        if (arg instanceof Error) {
          return arg.stack || arg.message || String(arg);
        }
        try {
          return JSON.stringify(arg);
        } catch (e) {
          return String(arg);
        }
      }

      function pushConsoleLine(kind, variantLabel, args) {
        const time = new Date().toLocaleTimeString("ru-RU");
        const text =
          "[" +
          time +
          "] [" +
          variantLabel +
          "] [" +
          kind +
          "] " +
          args.map(formatConsoleArg).join(" ");
        consoleLines.push(text);
        if (consoleOutputEl) {
          setConsoleOutput(consoleLines.join("\n"));
        }
      }

      function makeInstrumentedConsole(variantLabel) {
        return {
          log: function (...args) {
            if (typeof nativeConsole.log === "function") {
              nativeConsole.log.apply(nativeConsole, args);
            }
            pushConsoleLine("log", variantLabel, args);
          },
          debug: function (...args) {
            if (typeof nativeConsole.debug === "function") {
              nativeConsole.debug.apply(nativeConsole, args);
            } else if (typeof nativeConsole.log === "function") {
              nativeConsole.log.apply(nativeConsole, args);
            }
            pushConsoleLine("debug", variantLabel, args);
          },
          info: function (...args) {
            if (typeof nativeConsole.info === "function") {
              nativeConsole.info.apply(nativeConsole, args);
            } else if (typeof nativeConsole.log === "function") {
              nativeConsole.log.apply(nativeConsole, args);
            }
            pushConsoleLine("info", variantLabel, args);
          },
          warn: function (...args) {
            if (typeof nativeConsole.warn === "function") {
              nativeConsole.warn.apply(nativeConsole, args);
            } else if (typeof nativeConsole.log === "function") {
              nativeConsole.log.apply(nativeConsole, args);
            }
            pushConsoleLine("warn", variantLabel, args);
          },
          error: function (...args) {
            if (typeof nativeConsole.error === "function") {
              nativeConsole.error.apply(nativeConsole, args);
            } else if (typeof nativeConsole.log === "function") {
              nativeConsole.log.apply(nativeConsole, args);
            }
            pushConsoleLine("error", variantLabel, args);
          },
        };
      }

      const consoleA = makeInstrumentedConsole("A");
      const consoleB = makeInstrumentedConsole("B");

      const resultA = measure(buildA.fn, iterations, "варианта A", consoleA);
      const resultB = measure(buildB.fn, iterations, "варианта B", consoleB);

      if (resultA.error || resultB.error) {
        let msg = "Во время выполнения кода произошли ошибки:\n\n";
        if (resultA.error) msg += "- " + resultA.error + "\n";
        if (resultB.error) msg += "- " + resultB.error + "\n";
        setResults(msg.trimEnd());
        if (consoleOutputEl && consoleLines.length === 0) {
          setConsoleOutput(
            "Во время выполнения произошли ошибки, но вызовов console.log / console.debug не было."
          );
        }
        scrollToResults();
        return;
      }

      const lines = [];
      lines.push("Итераций: " + iterations.toLocaleString("ru-RU"));
      lines.push("");
      lines.push("Вариант A:");
      lines.push("  Общее время:      " + formatMs(resultA.totalMs));
      lines.push("  На итерацию:      " + formatMs(resultA.avgMs));
      lines.push("");
      lines.push("Вариант B:");
      lines.push("  Общее время:      " + formatMs(resultB.totalMs));
      lines.push("  На итерацию:      " + formatMs(resultB.avgMs));
      lines.push("");

      const totalA = resultA.totalMs;
      const totalB = resultB.totalMs;

      if (
        totalA > 0 &&
        totalB > 0 &&
        Number.isFinite(totalA) &&
        Number.isFinite(totalB)
      ) {
        let fasterLabel;
        let factor;

        if (totalA < totalB) {
          fasterLabel = "A";
          factor = totalB / totalA;
        } else if (totalB < totalA) {
          fasterLabel = "B";
          factor = totalA / totalB;
        } else {
          fasterLabel = null;
        }

        if (fasterLabel) {
          const slowerLabel = fasterLabel === "A" ? "B" : "A";
          lines.push(
            "Итог: вариант " +
              fasterLabel +
              " быстрее варианта " +
              slowerLabel +
              " примерно в " +
              factor.toFixed(2) +
              " раза."
          );
        } else {
          lines.push(
            "Итог: оба варианта показывают примерно одинаковое время выполнения."
          );
        }
      }

      setResults(lines.join("\n"));

      if (consoleOutputEl && consoleLines.length === 0) {
        setConsoleOutput(
          "За этот запуск вызовов console.log / console.debug не было."
        );
      }
      scrollToResults();
    }, 30);
  }

  runBtn.addEventListener("click", onRunBenchmark);

  // Переключение темы редактора
  if (themeSelectEl) {
    themeSelectEl.addEventListener("change", function (event) {
      const theme = event.target.value || "material-darker";
      codeAEditor.setOption("theme", theme);
      codeBEditor.setOption("theme", theme);
    });
  }

  // Запуск по Ctrl/Cmd+Enter или Ctrl/Cmd+S в любом редакторе CodeMirror
  function attachRunShortcuts(editor) {
    editor.on("keydown", function (cm, event) {
      const key = event.key || "";
      const isEnter =
        key === "Enter" || event.keyCode === 13 || event.code === "Enter";
      const isS = key === "s" || key === "S";
      const hasMetaOrCtrl = event.metaKey || event.ctrlKey;

      if (hasMetaOrCtrl && (isEnter || isS)) {
        event.preventDefault();
        onRunBenchmark();
      }
    });
  }

  attachRunShortcuts(codeAEditor);
  attachRunShortcuts(codeBEditor);

  // Звуковой сигнал при вводе кириллицы в редакторы
  function attachCyrillicBeep(editor) {
    editor.on("change", function (_cm, changeObj) {
      if (!changeObj || !changeObj.text) return;
      const inserted = changeObj.text.join("\n");
      if (/[А-Яа-яЁё]/.test(inserted)) {
        playBeepForCyrillic();
      }
    });
  }

  attachCyrillicBeep(codeAEditor);
  attachCyrillicBeep(codeBEditor);

  // Интерактивные кастомные стрелки для поля с количеством итераций
  if (iterationsArrowUp) {
    iterationsArrowUp.addEventListener("click", function () {
      stepIterations(1);
    });
  }
  if (iterationsArrowDown) {
    iterationsArrowDown.addEventListener("click", function () {
      stepIterations(-1);
    });
  }
})();
