/**
 * OmniComplexity Visualizer
 * High-performance Canvas renderer for Big-O growth curves, recursion trees, and scalability benchmark calculations.
 */

export class BigOVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.currentComplexity = 'O(n²)';
    this.isLogScale = false;
    this.hoverPoint = null;
    this.animationProgress = 1;

    this.curves = [
      { id: 'O(1)', label: 'O(1) Constant', color: '#10b981', fn: (n) => 1 },
      { id: 'O(log n)', label: 'O(log n) Logarithmic', color: '#06b6d4', fn: (n) => Math.log2(Math.max(1, n)) },
      { id: 'O(n)', label: 'O(n) Linear', color: '#3b82f6', fn: (n) => n },
      { id: 'O(n log n)', label: 'O(n log n) Linearithmic', color: '#eab308', fn: (n) => n * Math.log2(Math.max(1, n)) },
      { id: 'O(n²)', label: 'O(n²) Quadratic', color: '#f97316', fn: (n) => n * n },
      { id: 'O(n³)', label: 'O(n³) Cubic', color: '#ef4444', fn: (n) => n * n * n },
      { id: 'O(2ⁿ)', label: 'O(2ⁿ) Exponential', color: '#ec4899', fn: (n) => Math.pow(2, Math.min(25, n)) }
    ];

    if (this.canvas) {
      this._initCanvasEvents();
      window.addEventListener('resize', () => this.resizeAndRender());
    }
  }

  setComplexity(complexityStr) {
    this.currentComplexity = complexityStr || 'O(n)';
    this.triggerAnimation();
  }

  setLogScale(useLog) {
    this.isLogScale = useLog;
    this.render();
  }

  triggerAnimation() {
    this.animationProgress = 0;
    const start = performance.now();
    const duration = 600;

    const step = (now) => {
      const elapsed = now - start;
      this.animationProgress = Math.min(1, elapsed / duration);
      this.render();
      if (this.animationProgress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  resizeAndRender() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.render();
  }

  _initCanvasEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.hoverPoint = { x, y };
      this.render();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverPoint = null;
      this.render();
    });
  }

  render() {
    if (!this.canvas || !this.ctx) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 35, right: 30, bottom: 45, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    if (chartW <= 0 || chartH <= 0) return;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    const gridCols = 8;
    const gridRows = 5;

    for (let i = 0; i <= gridCols; i++) {
      const x = padding.left + (chartW / gridCols) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
    }

    for (let j = 0; j <= gridRows; j++) {
      const y = padding.top + (chartH / gridRows) * j;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Y Axis
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    // X Axis
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Input Size (n) ➔', padding.left + chartW / 2, height - 12);

    ctx.save();
    ctx.translate(18, padding.top + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Operations / Time Cost ➔', 0, 0);
    ctx.restore();

    const maxN = 20;
    const maxY = this.isLogScale ? 16 : 400;

    // Map coordinates
    const mapX = (n) => padding.left + (n / maxN) * chartW;
    const mapY = (val) => {
      let mappedVal = val;
      if (this.isLogScale) {
        mappedVal = Math.log2(Math.max(1, val));
      }
      const clamped = Math.min(maxY, mappedVal);
      return height - padding.bottom - (clamped / maxY) * chartH;
    };

    // Draw all curves
    this.curves.forEach((curve) => {
      const isCurrent = this.currentComplexity.includes(curve.id.replace('O(', '').replace(')', ''));
      ctx.beginPath();
      ctx.strokeStyle = isCurrent ? '#00f2fe' : curve.color;
      ctx.lineWidth = isCurrent ? 3.5 : 1.5;
      ctx.globalAlpha = isCurrent ? 1 : 0.35;

      if (isCurrent) {
        ctx.setLineDash([]);
      } else {
        ctx.setLineDash([4, 4]);
      }

      let started = false;
      const steps = 60;
      for (let s = 0; s <= steps; s++) {
        const n = (s / steps) * maxN * this.animationProgress;
        const val = curve.fn(n);
        const px = mapX(n);
        const py = mapY(val);

        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);

      // Draw label tag at the end of current curve
      if (isCurrent) {
        const endN = maxN * this.animationProgress;
        const endVal = curve.fn(endN);
        const tagX = mapX(endN);
        const tagY = mapY(endVal);

        // Pulsing glow circle
        ctx.fillStyle = '#00f2fe';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(tagX, tagY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Badge pill
        ctx.fillStyle = 'rgba(0, 242, 254, 0.15)';
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 1;
        const labelText = `Your Algorithm: ${this.currentComplexity}`;
        ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
        const textWidth = ctx.measureText(labelText).width;
        const pillX = Math.min(width - textWidth - 25, tagX + 10);
        const pillY = Math.max(padding.top + 10, tagY - 12);

        ctx.fillRect(pillX - 6, pillY - 10, textWidth + 12, 20);
        ctx.strokeRect(pillX - 6, pillY - 10, textWidth + 12, 20);

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText(labelText, pillX, pillY + 4);
      }
    });

    // Draw hover guide
    if (this.hoverPoint && this.hoverPoint.x >= padding.left && this.hoverPoint.x <= width - padding.right) {
      const hoverN = ((this.hoverPoint.x - padding.left) / chartW) * maxN;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(this.hoverPoint.x, padding.top);
      ctx.lineTo(this.hoverPoint.x, height - padding.bottom);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`n = ${Math.round(hoverN)}`, this.hoverPoint.x, padding.top - 8);
    }
  }

  /**
   * Helper to compute estimated runtime benchmark
   * @param {number} n - Input size
   */
  static calculateBenchmark(n) {
    const clockOpsPerSec = 1e9; // 1 GHz single core assumption

    const calculateTime = (ops) => {
      const seconds = ops / clockOpsPerSec;
      if (seconds < 1e-6) return `${(seconds * 1e9).toFixed(1)} ns`;
      if (seconds < 1e-3) return `${(seconds * 1e6).toFixed(2)} µs`;
      if (seconds < 1) return `${(seconds * 1e3).toFixed(2)} ms`;
      if (seconds < 60) return `${seconds.toFixed(2)} s`;
      if (seconds < 3600) return `${(seconds / 60).toFixed(1)} min`;
      if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hrs`;
      if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)} days`;
      const years = seconds / 31536000;
      if (years > 1e12) return '> 1 Trillion Years';
      return `${years.toExponential(2)} yrs`;
    };

    const logN = Math.log2(Math.max(1, n));
    const nLogN = n * logN;
    const n2 = n * n;
    const n3 = n * n * n;
    const exp2 = n <= 60 ? Math.pow(2, n) : Infinity;

    return [
      { complexity: 'O(1)', name: 'Constant', ops: 1, time: calculateTime(1), status: 'Instant' },
      { complexity: 'O(log n)', name: 'Logarithmic', ops: Math.round(logN), time: calculateTime(logN), status: 'Lightning' },
      { complexity: 'O(n)', name: 'Linear', ops: n, time: calculateTime(n), status: 'Fast' },
      { complexity: 'O(n log n)', name: 'Linearithmic', ops: Math.round(nLogN), time: calculateTime(nLogN), status: 'Optimal' },
      { complexity: 'O(n²)', name: 'Quadratic', ops: n2, time: calculateTime(n2), status: n > 50000 ? 'Slow' : 'Acceptable' },
      { complexity: 'O(n³)', name: 'Cubic', ops: n3, time: calculateTime(n3), status: n > 1000 ? 'Heavy' : 'Acceptable' },
      { complexity: 'O(2ⁿ)', name: 'Exponential', ops: exp2, time: calculateTime(exp2), status: n > 35 ? 'Infeasible' : 'Heavy' }
    ];
  }
}
