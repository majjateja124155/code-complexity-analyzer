/**
 * Code Complexity Analyzer - Application Controller
 * Handles Language switching, Preset algorithms, Accurate Complexity Analysis,
 * Visualizer chart rendering, and Output Scorecards.
 */

import { PRESETS } from './presets.js';
import { CodeComplexityAnalyzer } from './analyzer.js';
import { AIService } from './ai-service.js';
import { BigOVisualizer } from './visualizer.js';
import { sound } from './audio.js';

class CodeComplexApp {
  constructor() {
    this.analyzer = new CodeComplexityAnalyzer();
    this.aiService = new AIService();
    this.visualizer = null;

    this.currentPreset = PRESETS[0]; // Default: Linear Traversal
    this.currentLanguage = 'python';
    this.currentAnalysis = null;
    this.currentN = 1000;
    this.isUserCustomCode = false;

    this.dom = {
      // Nav
      navAnalyzeBtn: document.getElementById('navAnalyzeBtn'),
      navGuideBtn: document.getElementById('navGuideBtn'),
      navAboutBtn: document.getElementById('navAboutBtn'),
      themeToggleBtn: document.getElementById('themeToggleBtn'),

      // Hero
      btnStartAnalyzing: document.getElementById('btnStartAnalyzing'),

      // Workspace Editor
      codeEditor: document.getElementById('codeEditor'),
      lineNumbersGutter: document.getElementById('lineNumbersGutter'),
      activeLangTag: document.getElementById('activeLangTag'),
      metricLineChars: document.getElementById('metricLineChars'),
      statusIndicator: document.getElementById('statusIndicator'),
      btnRunAnalysis: document.getElementById('btnRunAnalysis'),
      btnCopyCode: document.getElementById('btnCopyCode'),
      btnClearCode: document.getElementById('btnClearCode'),

      // Controls
      languageButtonsGrid: document.getElementById('languageButtonsGrid'),
      presetAlgorithmsList: document.getElementById('presetAlgorithmsList'),
      samplesCountLabel: document.getElementById('samplesCountLabel'),

      // Results Section Dashboard
      resultsSection: document.getElementById('resultsSection'),
      dashboardLangBadge: document.getElementById('dashboardLangBadge'),
      dashboardAlgorithmDesc: document.getElementById('dashboardAlgorithmDesc'),
      btnCopyReport: document.getElementById('btnCopyReport'),
      btnDownloadMd: document.getElementById('btnDownloadMd'),
      btnEditCode: document.getElementById('btnEditCode'),
      btnAnalyzeAgain: document.getElementById('btnAnalyzeAgain'),
      btnClearDashboard: document.getElementById('btnClearDashboard'),

      // Time Card
      timeComplexityVal: document.getElementById('timeComplexityVal'),
      timeAverageVal: document.getElementById('timeAverageVal'),
      timeBestVal: document.getElementById('timeBestVal'),
      timeExplanationText: document.getElementById('timeExplanationText'),

      // Space Card
      spaceComplexityVal: document.getElementById('spaceComplexityVal'),
      spaceSubtext: document.getElementById('spaceSubtext'),
      spaceExplanationText: document.getElementById('spaceExplanationText'),

      // Status Card
      statusCompleteBadge: document.getElementById('statusCompleteBadge'),
      confidenceBadge: document.getElementById('confidenceBadge'),
      statusExplanationText: document.getElementById('statusExplanationText'),
      dashboardModelTag: document.getElementById('dashboardModelTag'),

      recurrenceContainer: document.getElementById('recurrenceContainer'),
      recurrenceFormula: document.getElementById('recurrenceFormula'),
      recurrenceMethod: document.getElementById('recurrenceMethod'),
      recurrenceExplanation: document.getElementById('recurrenceExplanation'),

      // Tabs
      outputTabBtns: document.querySelectorAll('.tab-nav-btn'),
      tabPanes: document.querySelectorAll('.tab-pane-content'),

      // Visualizer & Benchmark
      btnScaleLinear: document.getElementById('btnScaleLinear'),
      btnScaleLog: document.getElementById('btnScaleLog'),
      nSlider: document.getElementById('nSlider'),
      nValueDisplay: document.getElementById('nValueDisplay'),
      quickNBtns: document.querySelectorAll('.quick-n-btn'),
      benchmarkTableBody: document.getElementById('benchmarkTableBody'),

      // Line Profiler
      lineProfilerContainer: document.getElementById('lineProfilerContainer'),

      // Proof
      proofContentBox: document.getElementById('proofContentBox'),
      btnCopyProof: document.getElementById('btnCopyProof'),

      // Optimizations
      optimizationsGrid: document.getElementById('optimizationsGrid'),

      // Modals
      modalGuide: document.getElementById('modalGuide'),
      btnCloseGuide: document.getElementById('btnCloseGuide'),
      modalAbout: document.getElementById('modalAbout'),
      btnCloseAbout: document.getElementById('btnCloseAbout'),

      // Toast
      toastContainer: document.getElementById('toastContainer')
    };

    this.init();
  }

  init() {
    this.initTheme();
    this.initVisualizer();
    this.populateLanguageButtons();
    this.populatePresets();
    this.setupEditorEvents();
    this.setupWorkspaceActions();
    this.setupTabNavigation();
    this.setupBenchmarkControls();
    this.setupModals();

    // Load initial algorithm in default language (C++ for Coin Change matching screenshot)
    const initialPreset = PRESETS.find(p => p.id === 'coin-change-dp') || PRESETS[0];
    this.loadPreset(initialPreset, 'cpp');

    // Initial render of results & visualizer chart
    setTimeout(() => {
      if (this.visualizer) {
        this.visualizer.resizeAndRender();
      }
    }, 150);
  }

  initTheme() {
    const savedTheme = localStorage.getItem('codecomplex_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButtonIcon(savedTheme);

    this.dom.themeToggleBtn.addEventListener('click', () => {
      sound.playClick();
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('codecomplex_theme', next);
      this.updateThemeButtonIcon(next);
      if (this.visualizer) {
        this.visualizer.render();
      }
    });
  }

  updateThemeButtonIcon(theme) {
    this.dom.themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  initVisualizer() {
    try {
      this.visualizer = new BigOVisualizer('bigOCanvas');
    } catch (e) {
      console.warn('Canvas initialization deferred:', e);
    }
  }

  /**
   * Setup programming language buttons: Python, C++, C, Java, JavaScript, Go
   */
  populateLanguageButtons() {
    const buttons = this.dom.languageButtonsGrid.querySelectorAll('.btn-lang-choice');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const selectedLang = btn.getAttribute('data-lang');
        this.setLanguage(selectedLang);
      });
    });
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    
    // Update active button state
    const buttons = this.dom.languageButtonsGrid.querySelectorAll('.btn-lang-choice');
    buttons.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });

    // Update editor header tag
    const langNames = {
      python: 'PYTHON',
      cpp: 'C++',
      c: 'C',
      java: 'JAVA',
      javascript: 'JAVASCRIPT',
      go: 'GO'
    };
    this.dom.activeLangTag.textContent = langNames[lang] || lang.toUpperCase();

    // If we have a preset selected and the user hasn't wiped or written completely custom code,
    // switch the code editor content to this language's version of the preset!
    if (this.currentPreset && this.currentPreset.codeByLang && this.currentPreset.codeByLang[lang]) {
      this.dom.codeEditor.value = this.currentPreset.codeByLang[lang];
      this.updateLineNumbers();
      this.updateEditorMetrics();
    }

    // Run analysis with the new language rules
    this.runAnalysis(false);
    this.showToast(`Language switched to ${langNames[lang] || lang}`, 'info');
  }

  populatePresets() {
    const container = this.dom.presetAlgorithmsList;
    container.innerHTML = '';
    this.dom.samplesCountLabel.textContent = `📖 ${PRESETS.length} Samples`;

    PRESETS.forEach((preset, idx) => {
      const card = document.createElement('div');
      card.className = `preset-card-item ${idx === 0 ? 'active' : ''}`;
      card.innerHTML = `
        <div class="preset-info-block">
          <span class="preset-name-text">${preset.name}</span>
          <span class="preset-subname-text">${preset.subname || preset.category}</span>
        </div>
        <span class="preset-badge-complexity">${preset.timeComplexity}</span>
      `;

      card.addEventListener('click', () => {
        sound.playClick();
        document.querySelectorAll('.preset-card-item').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.isUserCustomCode = false;
        this.loadPreset(preset, this.currentLanguage);
      });

      container.appendChild(card);
    });
  }

  loadPreset(preset, lang = 'python') {
    this.currentPreset = preset;
    this.currentLanguage = lang;

    // Load language-specific code if available
    if (preset.codeByLang && preset.codeByLang[lang]) {
      this.dom.codeEditor.value = preset.codeByLang[lang];
    } else if (preset.code) {
      this.dom.codeEditor.value = preset.code;
    }

    // Update active button in grid
    const buttons = this.dom.languageButtonsGrid.querySelectorAll('.btn-lang-choice');
    buttons.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });

    const langNames = {
      python: 'PYTHON', cpp: 'C++', c: 'C', java: 'JAVA', javascript: 'JAVASCRIPT', go: 'GO'
    };
    this.dom.activeLangTag.textContent = langNames[lang] || lang.toUpperCase();

    this.updateLineNumbers();
    this.updateEditorMetrics();
    this.runAnalysis(false);
  }

  setupEditorEvents() {
    const editor = this.dom.codeEditor;

    editor.addEventListener('input', () => {
      this.isUserCustomCode = true;
      this.updateLineNumbers();
      this.updateEditorMetrics();
    });

    editor.addEventListener('scroll', () => {
      this.dom.lineNumbersGutter.scrollTop = editor.scrollTop;
    });

    editor.addEventListener('keyup', () => this.updateEditorMetrics());
    editor.addEventListener('click', () => this.updateEditorMetrics());

    // Hotkey: Ctrl+Enter or Cmd+Enter to run analysis
    editor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.runAnalysis(true);
        this.scrollToResults();
        return;
      }

      // Tab key indentation
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const tabSpaces = '    ';
        editor.value = editor.value.substring(0, start) + tabSpaces + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + tabSpaces.length;
        this.updateLineNumbers();
        this.updateEditorMetrics();
      }
    });

    // Run Button
    this.dom.btnRunAnalysis.addEventListener('click', () => {
      this.runAnalysis(true);
      this.scrollToResults();
    });
  }

  setupWorkspaceActions() {
    // Copy Code in Editor
    this.dom.btnCopyCode.addEventListener('click', () => {
      sound.playClick();
      navigator.clipboard.writeText(this.dom.codeEditor.value);
      this.showToast('Code copied to clipboard!', 'success');
    });

    // Clear Code in Editor
    this.dom.btnClearCode.addEventListener('click', () => {
      sound.playClick();
      this.dom.codeEditor.value = '';
      this.isUserCustomCode = true;
      this.updateLineNumbers();
      this.updateEditorMetrics();
      this.runAnalysis(false);
      this.showToast('Workspace cleared', 'info');
    });

    // Top Nav Analyze Button
    this.dom.navAnalyzeBtn.addEventListener('click', () => {
      sound.playClick();
      const workspace = document.getElementById('workspaceSection');
      if (workspace) workspace.scrollIntoView({ behavior: 'smooth' });
      this.runAnalysis(true);
    });

    // Dashboard: Copy Report Button
    if (this.dom.btnCopyReport) {
      this.dom.btnCopyReport.addEventListener('click', () => {
        sound.playClick();
        const report = this.generateMarkdownReport();
        navigator.clipboard.writeText(report);
        this.showToast('Full analysis report copied to clipboard!', 'success');
      });
    }

    // Dashboard: Download .md Button
    if (this.dom.btnDownloadMd) {
      this.dom.btnDownloadMd.addEventListener('click', () => {
        sound.playClick();
        const report = this.generateMarkdownReport();
        const blob = new Blob([report], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const prefix = (this.currentPreset?.id || 'complexity').replace(/[^a-z0-9_-]/gi, '_');
        const filename = `${prefix}_analysis_report.md`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast(`Report downloaded as ${filename}`, 'success');
      });
    }

    // Dashboard: Edit Code Button
    if (this.dom.btnEditCode) {
      this.dom.btnEditCode.addEventListener('click', () => {
        sound.playClick();
        const workspace = document.getElementById('workspaceSection');
        if (workspace) workspace.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => this.dom.codeEditor.focus(), 350);
      });
    }

    // Dashboard: Analyze Again Button
    if (this.dom.btnAnalyzeAgain) {
      this.dom.btnAnalyzeAgain.addEventListener('click', () => {
        sound.playClick();
        this.runAnalysis(true);
      });
    }

    // Dashboard: Clear / Trash Button
    if (this.dom.btnClearDashboard) {
      this.dom.btnClearDashboard.addEventListener('click', () => {
        sound.playClick();
        this.dom.codeEditor.value = '';
        this.isUserCustomCode = true;
        this.updateLineNumbers();
        this.updateEditorMetrics();
        this.runAnalysis(false);
        this.showToast('Workspace reset', 'info');
      });
    }
  }

  generateMarkdownReport() {
    const analysis = this.currentAnalysis;
    if (!analysis) return '# Code Complexity Analyzer Report\nNo analysis run yet.';

    const name = (!this.isUserCustomCode && this.currentPreset?.name) ? this.currentPreset.name : 'Custom Algorithm';
    const desc = (!this.isUserCustomCode && this.currentPreset?.description) 
      ? this.currentPreset.description 
      : 'Asymptotic complexity derived from AST loop & recursive branch evaluation.';
    const timeExp = (!this.isUserCustomCode && this.currentPreset?.timeExplanation) 
      ? this.currentPreset.timeExplanation 
      : analysis.timeComplexity.summary;
    const spaceExp = (!this.isUserCustomCode && this.currentPreset?.spaceExplanation) 
      ? this.currentPreset.spaceExplanation 
      : analysis.spaceComplexity.summary;
    const statusExp = (!this.isUserCustomCode && this.currentPreset?.statusSummary) 
      ? this.currentPreset.statusSummary 
      : (analysis.status?.summary || 'Textbook algorithmic implementation.');

    return `# Code Complexity Analyzer — Analysis Report
**Language:** ${this.currentLanguage}  
**Algorithm:** ${name}  
**Timestamp:** ${new Date().toLocaleString()}  

> ${desc}

---

## ⏱️ Time Complexity: ${analysis.timeComplexity.worstCase} (Worst Case)
- **Average Case:** ${analysis.timeComplexity.averageCase}
- **Best Case:** ${analysis.timeComplexity.bestCase}

### Execution Profile
${timeExp}

---

## 💾 Auxiliary Space: ${analysis.spaceComplexity.auxiliarySpace} (Extra Memory)
*Stack frames & heap allocations, excluding input size.*

### Memory Allocation Breakdown
${spaceExp}

---

## ✓ Analysis Status: COMPLETE (${analysis.status?.confidence || 'High Confidence'})
${statusExp}

**Model:** ${analysis.status?.model || 'Gemini 3.8 Flash'}  
**Assessment Type:** Qualitative Assessment
`;
  }

  updateLineNumbers() {
    const lines = this.dom.codeEditor.value.split('\n').length;
    let gutterHTML = '';
    for (let i = 1; i <= Math.max(lines, 1); i++) {
      gutterHTML += `<span class="line-number">${i}</span>`;
    }
    this.dom.lineNumbersGutter.innerHTML = gutterHTML;
  }

  updateEditorMetrics() {
    const val = this.dom.codeEditor.value;
    const lines = val.split('\n').length;
    const chars = val.length;
    this.dom.metricLineChars.textContent = `${lines} lines • ${chars} chars`;
  }

  scrollToResults() {
    const results = this.dom.resultsSection;
    if (results) {
      results.scrollIntoView({ behavior: 'smooth' });
    }
  }

  runAnalysis(playSounds = true) {
    if (playSounds) sound.playAnalyze();

    const code = this.dom.codeEditor.value;
    const language = this.currentLanguage;

    this.dom.statusIndicator.textContent = 'Parsing...';
    this.dom.statusIndicator.style.color = '#f59e0b';

    const analysis = this.analyzer.analyze(code, language);
    this.currentAnalysis = analysis;

    // 1. Update Top Scorecards (algorithm name shown in dashboard header)
    this.renderScorecards(analysis);

    // 3. Update Recurrence Box (if applicable)
    this.renderRecurrence(analysis.recurrence);

    // 4. Update Visualizer & Benchmark Table
    if (this.visualizer) {
      this.visualizer.setComplexity(analysis.timeComplexity.worstCase);
    }
    this.renderBenchmarkTable();

    // 5. Update Line-by-Line Profiler
    this.renderLineProfiler(analysis.lineHeatmap);

    // 6. Update Proof & Mathematical Invariants
    this.renderProof(analysis, code, language);

    // 7. Update Optimization Recommendations
    this.renderOptimizations(analysis.optimizations);

    this.dom.statusIndicator.textContent = 'Ready';
    this.dom.statusIndicator.style.color = '#10b981';

    if (playSounds) {
      setTimeout(() => sound.playSuccess(), 150);
      this.showToast(`Analyzed: Time ${analysis.timeComplexity.worstCase}, Space ${analysis.spaceComplexity.totalSpace}`, 'success');
    }
  }

  renderScorecards(analysis) {
    const time = analysis.timeComplexity;
    const space = analysis.spaceComplexity;
    const status = analysis.status;

    // Header Language Badge & Description
    if (this.dom.dashboardLangBadge) {
      this.dom.dashboardLangBadge.textContent = this.currentLanguage.toLowerCase();
    }
    if (this.dom.dashboardAlgorithmDesc) {
      this.dom.dashboardAlgorithmDesc.textContent = (!this.isUserCustomCode && this.currentPreset?.description)
        ? this.currentPreset.description
        : "Computes complexity profile via bottom-up invariant analysis and structural AST evaluation.";
    }

    // Card 1: Time Complexity
    if (this.dom.timeComplexityVal) {
      this.dom.timeComplexityVal.textContent = time.worstCase;
    }
    if (this.dom.timeAverageVal) {
      this.dom.timeAverageVal.textContent = `Avg: ${time.averageCase}`;
    }
    if (this.dom.timeBestVal) {
      this.dom.timeBestVal.textContent = `Best: ${time.bestCase}`;
    }
    if (this.dom.timeExplanationText) {
      this.dom.timeExplanationText.textContent = (!this.isUserCustomCode && this.currentPreset?.timeExplanation)
        ? this.currentPreset.timeExplanation
        : time.summary;
    }

    // Card 2: Auxiliary Space
    if (this.dom.spaceComplexityVal) {
      this.dom.spaceComplexityVal.textContent = space.auxiliarySpace;
    }
    if (this.dom.spaceSubtext) {
      this.dom.spaceSubtext.textContent = space.subtext || "Stack frames & heap allocations, excluding input size.";
    }
    if (this.dom.spaceExplanationText) {
      this.dom.spaceExplanationText.textContent = (!this.isUserCustomCode && this.currentPreset?.spaceExplanation)
        ? this.currentPreset.spaceExplanation
        : space.summary;
    }

    // Card 3: Analysis Status
    if (this.dom.statusCompleteBadge) {
      this.dom.statusCompleteBadge.textContent = status?.badge || 'COMPLETE';
    }
    if (this.dom.confidenceBadge) {
      this.dom.confidenceBadge.textContent = status?.confidence || 'High Confidence';
    }
    if (this.dom.statusExplanationText) {
      this.dom.statusExplanationText.textContent = (!this.isUserCustomCode && this.currentPreset?.statusSummary)
        ? this.currentPreset.statusSummary
        : (status?.summary || "The algorithm is a textbook implementation with explicit loop bounds and straightforward memory usage.");
    }
    if (this.dom.dashboardModelTag) {
      this.dom.dashboardModelTag.textContent = (status?.model) ? `Model: ${status.model}` : 'Model: Static AST Engine';
    }
  }

  renderRecurrence(recurrence) {
    if (!recurrence) {
      this.dom.recurrenceContainer.style.display = 'none';
      return;
    }

    this.dom.recurrenceContainer.style.display = 'block';
    this.dom.recurrenceFormula.textContent = recurrence.formula;
    this.dom.recurrenceMethod.textContent = recurrence.method;
    this.dom.recurrenceExplanation.textContent = recurrence.explanation;
  }

  renderLineProfiler(heatmap) {
    const container = this.dom.lineProfilerContainer;
    if (!heatmap || heatmap.length === 0) {
      container.innerHTML = `<div style="padding: 16px; color: var(--text-muted);">No code available to profile.</div>`;
      return;
    }

    let html = '';
    heatmap.forEach(item => {
      html += `
        <div class="profiler-row-item">
          <span class="profiler-line-no">${item.line}</span>
          <span class="profiler-cost-badge ${item.badgeClass}">${item.cost}</span>
          <span class="profiler-code-text">${this.escapeHTML(item.content)}</span>
          <span class="profiler-note" title="${this.escapeHTML(item.explanation)}">${item.type}</span>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  renderProof(analysis, code, language) {
    const box = this.dom.proofContentBox;
    const local = this.aiService._buildLocalAIResponse(code, language, analysis);
    box.innerHTML = this.markdownToHTML(local.aiDetailedReport);
  }

  renderOptimizations(optimizations) {
    const container = this.dom.optimizationsGrid;
    container.innerHTML = '';

    if (!optimizations || optimizations.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted);">No optimizations required. The algorithm appears asymptotically optimal.</p>`;
      return;
    }

    const hasPresetOpt = !this.isUserCustomCode && this.currentPreset && this.currentPreset.optimizedCode;

    optimizations.forEach((opt, idx) => {
      const card = document.createElement('div');
      card.className = 'opt-suggestion-card';

      let diffSnippet = '';
      if (hasPresetOpt && idx === 0) {
        diffSnippet = `
          <div class="opt-code-preview-box">${this.escapeHTML(this.currentPreset.optimizedCode)}</div>
          <button class="btn-apply-code" id="btnApplyPresetOpt">⚡ Apply Optimized Code</button>
        `;
      }

      card.innerHTML = `
        <div class="opt-card-header">
          <span class="opt-card-title">${opt.title}</span>
          <span class="opt-card-impact">${opt.impact}</span>
        </div>
        <p class="opt-card-desc">${opt.description}</p>
        <div style="font-size: 0.8rem; color: var(--text-muted); background: var(--bg-surface-subtle); padding: 8px 12px; border-radius: 8px; border-left: 3px solid var(--accent-amber);">
          <strong>Trade-off:</strong> ${opt.tradeoff}
        </div>
        ${diffSnippet}
      `;

      container.appendChild(card);
    });

    const btnApply = document.getElementById('btnApplyPresetOpt');
    if (btnApply) {
      btnApply.addEventListener('click', () => {
        sound.playSuccess();
        this.dom.codeEditor.value = this.currentPreset.optimizedCode;
        this.updateLineNumbers();
        this.updateEditorMetrics();
        this.runAnalysis(true);
        this.showToast('Optimized code applied to workspace!', 'success');
      });
    }
  }

  setupTabNavigation() {
    this.dom.outputTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const targetTab = btn.getAttribute('data-tab');
        
        this.dom.outputTabBtns.forEach(b => b.classList.toggle('active', b === btn));
        this.dom.tabPanes.forEach(p => p.classList.toggle('active', p.id === targetTab));

        if (targetTab === 'tab-chart' && this.visualizer) {
          setTimeout(() => this.visualizer.resizeAndRender(), 50);
        }
      });
    });
  }

  setupBenchmarkControls() {
    // Linear / Logarithmic Scale Toggle
    this.dom.btnScaleLinear.addEventListener('click', () => {
      sound.playClick();
      this.dom.btnScaleLinear.classList.add('active');
      this.dom.btnScaleLog.classList.remove('active');
      if (this.visualizer) this.visualizer.setLogScale(false);
    });

    this.dom.btnScaleLog.addEventListener('click', () => {
      sound.playClick();
      this.dom.btnScaleLog.classList.add('active');
      this.dom.btnScaleLinear.classList.remove('active');
      if (this.visualizer) this.visualizer.setLogScale(true);
    });

    // Slider
    this.dom.nSlider.addEventListener('input', (e) => {
      this.currentN = parseInt(e.target.value, 10);
      this.dom.nValueDisplay.textContent = `n = ${this.currentN.toLocaleString()}`;
      this.dom.quickNBtns.forEach(b => b.classList.remove('active'));
      this.renderBenchmarkTable();
    });

    // Quick N buttons
    this.dom.quickNBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        this.dom.quickNBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentN = parseInt(btn.getAttribute('data-n'), 10);
        this.dom.nSlider.value = this.currentN;
        this.dom.nValueDisplay.textContent = `n = ${this.currentN.toLocaleString()}`;
        this.renderBenchmarkTable();
      });
    });

    // Copy Proof
    this.dom.btnCopyProof.addEventListener('click', () => {
      sound.playClick();
      navigator.clipboard.writeText(this.dom.proofContentBox.innerText);
      this.showToast('Proof copied to clipboard!', 'success');
    });
  }

  renderBenchmarkTable() {
    const benchmarks = BigOVisualizer.calculateBenchmark(this.currentN);
    const currentWorst = this.currentAnalysis ? this.currentAnalysis.timeComplexity.worstCase : 'O(n)';

    let html = '';
    benchmarks.forEach(b => {
      const isCurrent = currentWorst.includes(b.complexity.replace('O(', '').replace(')', ''));
      const statusClass = `status-${b.status.toLowerCase()}`;

      html += `
        <tr class="${isCurrent ? 'row-active-algorithm' : ''}">
          <td>
            <strong>${b.complexity}</strong>
            <span style="font-size: 0.72rem; color: var(--text-muted); margin-left: 6px;">(${b.name})</span>
            ${isCurrent ? '<span class="pill-badge-tag badge-tag-purple" style="margin-left: 6px;">Active</span>' : ''}
          </td>
          <td>${typeof b.ops === 'number' && isFinite(b.ops) ? b.ops.toLocaleString() : '∞ Overflow'}</td>
          <td>${b.time}</td>
          <td><span class="tag-status-pill ${statusClass}">${b.status}</span></td>
        </tr>
      `;
    });

    this.dom.benchmarkTableBody.innerHTML = html;
  }

  setupModals() {
    // Complexity Guide Modal
    this.dom.navGuideBtn.addEventListener('click', () => {
      sound.playClick();
      this.dom.modalGuide.classList.add('active');
    });

    this.dom.btnCloseGuide.addEventListener('click', () => {
      sound.playClick();
      this.dom.modalGuide.classList.remove('active');
    });

    // About Modal
    this.dom.navAboutBtn.addEventListener('click', () => {
      sound.playClick();
      this.dom.modalAbout.classList.add('active');
    });

    this.dom.btnCloseAbout.addEventListener('click', () => {
      sound.playClick();
      this.dom.modalAbout.classList.remove('active');
    });

    // Click outside backdrop to close
    [this.dom.modalGuide, this.dom.modalAbout].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          sound.playClick();
          modal.classList.remove('active');
        }
      });
    });
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-notice';
    const icon = type === 'success' ? '✅' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${this.escapeHTML(message)}</span>`;
    this.dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2500);
  }

  escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  markdownToHTML(md) {
    if (!md) return '';
    let html = md
      .replace(/^### (.*$)/gim, '<h3 style="margin-top: 14px; margin-bottom: 6px; color: var(--text-heading); font-size: 1.05rem;">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 style="margin-top: 10px; margin-bottom: 4px; color: var(--text-heading); font-size: 0.95rem;">$1</h4>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/```([a-z]*)\n([\s\S]*?)```/gim, '<pre style="background: var(--bg-dark-editor); color: #f1f5f9; padding: 12px; border-radius: 8px; font-family: var(--font-mono); font-size: 12px; margin: 10px 0;"><code>$2</code></pre>')
      .replace(/`([^`]+)`/gim, '<code style="background: rgba(99, 102, 241, 0.1); color: var(--primary); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em;">$1</code>')
      .replace(/^\s*-\s+(.*$)/gim, '<li style="margin-bottom: 4px;">$1</li>')
      .replace(/\n\n/gim, '<br>');

    if (html.includes('<li>')) {
      html = html.replace(/(<li>.*<\/li>)/gms, '<ul style="padding-left: 20px; margin: 8px 0;">$1</ul>');
    }

    return html;
  }
}

// Instantiate robustly across all ready states
function initCodeComplex() {
  if (!window.codeComplexApp) {
    window.codeComplexApp = new CodeComplexApp();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCodeComplex);
} else {
  initCodeComplex();
}
