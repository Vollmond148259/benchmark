(function () {
  const codeAEl = document.getElementById("code-a");
  const codeBEl = document.getElementById("code-b");
  const iterationsEl = document.getElementById("iterations");
  const runBtn = document.getElementById("run-benchmark");
  const resultsEl = document.getElementById("results");

  function setResults(text) {
    resultsEl.textContent = text;
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

  function buildFunction(code, label) {
    try {
      const fn = new Function(code);
      return { fn, error: null };
    } catch (e) {
      return {
        fn: null,
        error: "Ошибка при разборе кода " + label + ": " + e.message,
      };
    }
  }

  function measure(fn, iterations, label) {
    const start = performance.now();
    try {
      for (let i = 0; i < iterations; i++) {
        fn();
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
    const codeA = codeAEl.value || "";
    const codeB = codeBEl.value || "";
    const iterations = parseIterations();

    setResults(
      "Выполняется бенчмарк...\nЭто может занять немного времени при большом числе итераций."
    );

    // Небольшая задержка, чтобы обновить UI перед тяжёлой работой
    setTimeout(() => {
      const buildA = buildFunction(codeA, "варианта A");
      const buildB = buildFunction(codeB, "варианта B");

      if (buildA.error || buildB.error) {
        let msg = "Не удалось запустить бенчмарк из‑за ошибок в коде:\n\n";
        if (buildA.error) msg += "- " + buildA.error + "\n";
        if (buildB.error) msg += "- " + buildB.error + "\n";
        setResults(msg.trimEnd());
        scrollToResults();
        return;
      }

      const resultA = measure(buildA.fn, iterations, "варианта A");
      const resultB = measure(buildB.fn, iterations, "варианта B");

      if (resultA.error || resultB.error) {
        let msg = "Во время выполнения кода произошли ошибки:\n\n";
        if (resultA.error) msg += "- " + resultA.error + "\n";
        if (resultB.error) msg += "- " + resultB.error + "\n";
        setResults(msg.trimEnd());
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
      scrollToResults();
    }, 30);
  }

  runBtn.addEventListener("click", onRunBenchmark);

  // Запуск по Ctrl/Cmd+Enter в любом редакторе
  function handleKeydown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      onRunBenchmark();
    }
  }

  codeAEl.addEventListener("keydown", handleKeydown);
  codeBEl.addEventListener("keydown", handleKeydown);
})();
