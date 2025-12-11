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
  const langSwitcherRoot = document.getElementById("lang-switcher");

  const translations = {
    ru: {
      page_title:
        "JS Benchmark Playground — сравнить скорость кода в онлайн редакторе JavaScript",
      ui_header_title:
        "JS Benchmark Playground — JS playground и онлайн редактор кода",
      ui_header_subtitle:
        "Сравнивайте производительность двух вариантов JavaScript‑кода. Отредактируйте оба блока и нажмите <code>Запустить бенчмарк</code>, чтобы увидеть статистику. Также вы можете запустить бенчмарк с помощью сочетаний клавиш <code>Cmd+S</code> (macOS) или <code>Ctrl+S</code> (Windows/Linux).",
      ui_lang_switcher_label: "Язык",
      ui_variant_a_title: "Вариант A",
      ui_variant_a_subtitle:
        "Например, классический цикл <code>for</code>, который суммирует элементы массива.",
      ui_variant_b_title: "Вариант B",
      ui_variant_b_subtitle:
        "Альтернативная реализация той же задачи, например <code>Array.prototype.reduce</code>.",
      ui_editor_theme_label: "Тема редактора",
      ui_theme_option_material: "Тёмная — Material Darker",
      ui_theme_option_dracula: "Тёмная — Dracula",
      ui_theme_option_neo: "Светлая — Neo",
      ui_iterations_label: "Количество итераций",
      ui_iterations_increase_aria: "Увеличить количество итераций",
      ui_iterations_decrease_aria: "Уменьшить количество итераций",
      ui_additional_label: "Дополнительно",
      ui_cyrillic_toggle_label:
        "Звуковой сигнал при вводе кириллицы в редакторе",
      ui_run_button: "Запустить бенчмарк",
      ui_hint_text:
        "Совет: начните с меньшего числа итераций, если браузер «подвисает».",
      ui_results_title: "Результаты бенчмарка",
      ui_results_placeholder: "Здесь появятся результаты выполнения кода.",
      ui_results_hint:
        "Запустите тест несколько раз и попробуйте разные браузеры (Chrome, Firefox, Safari), чтобы увидеть, как движок влияет на производительность.",
      ui_logs_header: "Логи консоли",
      ui_console_placeholder:
        "Здесь появится вывод <code>console.log</code> и <code>console.debug</code> за последний запуск.",

      msg_benchmark_running:
        "Выполняется бенчмарк...\nЭто может занять немного времени при большом числе итераций.",
      msg_console_waiting:
        "Ожидание вывода из console.log / console.debug во время текущего запуска...",
      msg_parse_errors_header:
        "Не удалось запустить бенчмарк из‑за ошибок в коде:\n\n",
      msg_console_not_run_due_to_errors:
        "Из‑за ошибок в коде бенчмарк не был запущен, вывод консоли отсутствует.",
      msg_execution_errors_header:
        "Во время выполнения кода произошли ошибки:\n\n",
      msg_execution_errors_no_console:
        "Во время выполнения произошли ошибки, но вызовов console.log / console.debug не было.",
      msg_no_console_calls:
        "За этот запуск вызовов console.log / console.debug не было.",
      msg_iterations_label: "Итераций",
      msg_results_variant_a_title: "Вариант A:",
      msg_results_variant_b_title: "Вариант B:",
      msg_results_total_time_label: "  Общее время:      ",
      msg_results_per_iteration_label: "  На итерацию:      ",
      msg_summary_both_equal:
        "Итог: оба варианта показывают примерно одинаковое время выполнения.",
      msg_summary_prefix: "Итог: вариант ",
      msg_summary_middle: " быстрее варианта ",
      msg_summary_suffix_prefix: " примерно в ",
      msg_summary_suffix_times: " раза.",
      msg_error_parse_prefix: "Ошибка при разборе кода ",
      msg_error_execution_prefix: "Ошибка во время выполнения кода ",
      code_variant_a_genitive: "варианта A",
      code_variant_b_genitive: "варианта B",
    },
    en: {
      page_title:
        "JS Benchmark Playground — JS playground & online JavaScript editor",
      ui_header_title:
        "JS Benchmark Playground — JS playground & online editor",
      ui_header_subtitle:
        "Compare performance of two JavaScript code variants. Edit both blocks and press <code>Run benchmark</code> to see statistics. You can also run the benchmark with <code>Cmd+S</code> (macOS) or <code>Ctrl+S</code> (Windows/Linux).",
      ui_lang_switcher_label: "Language",
      ui_variant_a_title: "Variant A",
      ui_variant_a_subtitle:
        "For example, a classic <code>for</code> loop that sums array elements.",
      ui_variant_b_title: "Variant B",
      ui_variant_b_subtitle:
        "Alternative implementation of the same task, e.g. <code>Array.prototype.reduce</code>.",
      ui_editor_theme_label: "Editor theme",
      ui_theme_option_material: "Dark — Material Darker",
      ui_theme_option_dracula: "Dark — Dracula",
      ui_theme_option_neo: "Light — Neo",
      ui_iterations_label: "Iterations count",
      ui_iterations_increase_aria: "Increase iterations count",
      ui_iterations_decrease_aria: "Decrease iterations count",
      ui_additional_label: "Additional",
      ui_cyrillic_toggle_label:
        "Play a sound when Cyrillic characters are typed in the editor",
      ui_run_button: "Run benchmark",
      ui_hint_text:
        "Tip: start with fewer iterations if the browser feels sluggish.",
      ui_results_title: "Benchmark results",
      ui_results_placeholder: "Benchmark results will appear here.",
      ui_results_hint:
        "Run the test multiple times and try different browsers (Chrome, Firefox, Safari) to see how the engine affects performance.",
      ui_logs_header: "Console logs",
      ui_console_placeholder:
        "Output of <code>console.log</code> and <code>console.debug</code> from the last run will appear here.",

      msg_benchmark_running:
        "Benchmark is running...\nThis may take some time with a large number of iterations.",
      msg_console_waiting:
        "Waiting for console.log / console.debug output during the current run...",
      msg_parse_errors_header:
        "Failed to start the benchmark due to errors in the code:\n\n",
      msg_console_not_run_due_to_errors:
        "The benchmark was not started because of code errors, so there is no console output.",
      msg_execution_errors_header:
        "Errors occurred while executing the code:\n\n",
      msg_execution_errors_no_console:
        "Errors occurred during execution, but there were no console.log / console.debug calls.",
      msg_no_console_calls:
        "There were no console.log / console.debug calls during this run.",
      msg_iterations_label: "Iterations",
      msg_results_variant_a_title: "Variant A:",
      msg_results_variant_b_title: "Variant B:",
      msg_results_total_time_label: "  Total time:       ",
      msg_results_per_iteration_label: "  Per iteration:    ",
      msg_summary_both_equal:
        "Summary: both variants show roughly the same execution time.",
      msg_summary_prefix: "Summary: variant ",
      msg_summary_middle: " is faster than variant ",
      msg_summary_suffix_prefix: " by about ",
      msg_summary_suffix_times: " times.",
      msg_error_parse_prefix: "Error while parsing code ",
      msg_error_execution_prefix: "Error during execution of code ",
      code_variant_a_genitive: "variant A",
      code_variant_b_genitive: "variant B",
    },
  };

  let currentLang = "ru";

  function getCurrentLocale() {
    if (currentLang === "en") return "en-US";
    return "ru-RU";
  }

  function t(key) {
    const dict = translations[currentLang] || translations.ru;
    if (dict && Object.prototype.hasOwnProperty.call(dict, key)) {
      return dict[key];
    }
    const fallback = translations.ru;
    if (fallback && Object.prototype.hasOwnProperty.call(fallback, key)) {
      return fallback[key];
    }
    return key;
  }

  function applyTranslations(lang) {
    currentLang = translations[lang] ? lang : currentLang;

    const docEl = document.documentElement;
    if (docEl) {
      docEl.lang = currentLang;
    }

    const pageTitle = translations[currentLang].page_title;
    if (typeof pageTitle === "string") {
      document.title = pageTitle;
    }

    const textNodes = document.querySelectorAll("[data-i18n]");
    textNodes.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const value = t(key);
      if (typeof value === "string") {
        el.innerHTML = value;
      }
    });

    const ariaLabelNodes = document.querySelectorAll("[data-i18n-aria-label]");
    ariaLabelNodes.forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      if (!key) return;
      const value = t(key);
      if (typeof value === "string") {
        el.setAttribute("aria-label", value);
      }
    });
  }

  function updateLangSwitcherUI() {
    if (!langSwitcherRoot) return;
    const buttons = langSwitcherRoot.querySelectorAll("[data-lang]");
    buttons.forEach((btn) => {
      const btnLang = btn.getAttribute("data-lang");
      const isActive = btnLang === currentLang;
      btn.classList.toggle("lang-switcher__btn--active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function setLanguage(lang, options) {
    const opts = options || {};
    const targetLang = translations[lang] ? lang : currentLang;
    currentLang = targetLang;

    if (!opts.skipSave) {
      try {
        window.localStorage.setItem("benchmark_lang", currentLang);
      } catch (_e) {
        // ignore
      }
    }

    applyTranslations(currentLang);
    updateLangSwitcherUI();
  }

  function detectInitialLanguage() {
    try {
      const stored = window.localStorage.getItem("benchmark_lang");
      if (stored && translations[stored]) {
        return stored;
      }
    } catch (_e) {
      // ignore
    }

    const docLang = (document.documentElement.lang || "").toLowerCase();
    if (docLang && translations[docLang.slice(0, 2)]) {
      return docLang.slice(0, 2);
    }

    const navLangs = window.navigator
      ? window.navigator.languages || [window.navigator.language]
      : [];
    for (const l of navLangs) {
      if (!l) continue;
      const code = l.toLowerCase().slice(0, 2);
      if (translations[code]) {
        return code;
      }
    }

    return "ru";
  }

  function attachLangSwitcherHandlers() {
    if (!langSwitcherRoot) return;
    const buttons = langSwitcherRoot.querySelectorAll("[data-lang]");
    buttons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const lang = btn.getAttribute("data-lang");
        if (!lang || lang === currentLang) return;
        setLanguage(lang, { skipSave: false });
      });
    });
  }

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
      const labelText =
        label === "A"
          ? t("code_variant_a_genitive")
          : t("code_variant_b_genitive");
      return {
        fn: null,
        error:
          t("msg_error_parse_prefix") + labelText + ": " + (e && e.message),
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
      const labelText =
        label === "A"
          ? t("code_variant_a_genitive")
          : t("code_variant_b_genitive");
      return {
        error:
          t("msg_error_execution_prefix") + labelText + ": " + (e && e.message),
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

    setResults(t("msg_benchmark_running"));

    // Очищаем лог консоли перед новым запуском
    if (consoleOutputEl) {
      setConsoleOutput(t("msg_console_waiting"));
    }

    // Небольшая задержка, чтобы обновить UI перед тяжёлой работой
    setTimeout(() => {
      const buildA = buildFunction(codeA, "A");
      const buildB = buildFunction(codeB, "B");

      if (buildA.error || buildB.error) {
        let msg = t("msg_parse_errors_header");
        if (buildA.error) msg += "- " + buildA.error + "\n";
        if (buildB.error) msg += "- " + buildB.error + "\n";
        setResults(msg.trimEnd());
        if (consoleOutputEl) {
          setConsoleOutput(t("msg_console_not_run_due_to_errors"));
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
        const time = new Date().toLocaleTimeString(getCurrentLocale());
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
      const resultB = measure(buildB.fn, iterations, "B", consoleB);

      if (resultA.error || resultB.error) {
        let msg = t("msg_execution_errors_header");
        if (resultA.error) msg += "- " + resultA.error + "\n";
        if (resultB.error) msg += "- " + resultB.error + "\n";
        setResults(msg.trimEnd());
        if (consoleOutputEl && consoleLines.length === 0) {
          setConsoleOutput(t("msg_execution_errors_no_console"));
        }
        scrollToResults();
        return;
      }

      const lines = [];
      lines.push(
        t("msg_iterations_label") +
          ": " +
          iterations.toLocaleString(getCurrentLocale())
      );
      lines.push("");
      lines.push(t("msg_results_variant_a_title"));
      lines.push(t("msg_results_total_time_label") + formatMs(resultA.totalMs));
      lines.push(
        t("msg_results_per_iteration_label") + formatMs(resultA.avgMs)
      );
      lines.push("");
      lines.push(t("msg_results_variant_b_title"));
      lines.push(t("msg_results_total_time_label") + formatMs(resultB.totalMs));
      lines.push(
        t("msg_results_per_iteration_label") + formatMs(resultB.avgMs)
      );
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
            t("msg_summary_prefix") +
              fasterLabel +
              t("msg_summary_middle") +
              slowerLabel +
              t("msg_summary_suffix_prefix") +
              factor.toFixed(2) +
              t("msg_summary_suffix_times")
          );
        } else {
          lines.push(t("msg_summary_both_equal"));
        }
      }

      setResults(lines.join("\n"));

      if (consoleOutputEl && consoleLines.length === 0) {
        setConsoleOutput(t("msg_no_console_calls"));
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

  const initialLang = detectInitialLanguage();
  applyTranslations(initialLang);
  updateLangSwitcherUI();
  attachLangSwitcherHandlers();
})();
