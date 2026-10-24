/**
 * Export and Share Engine for OmniComplexity
 */

export class ReportExporter {
  static exportMarkdown(analysis, code, language) {
    const md = `# OmniComplexity Analysis Report
*Generated on: ${new Date().toLocaleString()}*

## 1. Complexity Scorecard
- **Time Complexity (Worst-Case):** \`${analysis.timeComplexity.worstCase}\`
- **Time Complexity (Average-Case):** \`${analysis.timeComplexity.averageCase}\`
- **Time Complexity (Best-Case):** \`${analysis.timeComplexity.bestCase}\`
- **Space Complexity (Auxiliary):** \`${analysis.spaceComplexity.auxiliarySpace}\`
- **Space Complexity (Call Stack):** \`${analysis.spaceComplexity.callStackSpace}\`
- **Total Space Complexity:** \`${analysis.spaceComplexity.totalSpace}\`
- **Scalability Rating:** **${analysis.scalability.grade}** (${analysis.scalability.label})

---

## 2. Dominant Factors & Breakdown
${analysis.timeComplexity.breakdown.map(b => `- ${b}`).join('\n')}

### Memory Allocation:
${analysis.spaceComplexity.allocations.length > 0 ? analysis.spaceComplexity.allocations.map(a => `- ${a}`).join('\n') : '- Minimal scalar variables: O(1) auxiliary space.'}

${analysis.recurrence ? `### Recurrence Relation:
- **Formula:** \`${analysis.recurrence.formula}\`
- **Method:** ${analysis.recurrence.method}
- **Solution:** \`${analysis.recurrence.solution}\`
- **Details:** ${analysis.recurrence.explanation}
` : ''}

---

## 3. Optimization Recommendations
${analysis.optimizations.map(opt => `### ${opt.title} (${opt.impact})
- **Type:** ${opt.type}
- **Description:** ${opt.description}
- **Trade-off:** ${opt.tradeoff}
`).join('\n')}

---

## 4. Evaluated Source Code (${language})
\`\`\`${language}
${code}
\`\`\`
`;

    this._downloadFile(md, `OmniComplexity_Report_${Date.now()}.md`, 'text/markdown');
  }

  static exportJSON(analysis, code, language) {
    const payload = {
      meta: {
        tool: 'OmniComplexity AI',
        exportedAt: new Date().toISOString(),
        language: language
      },
      sourceCode: code,
      analysis: analysis
    };

    const jsonStr = JSON.stringify(payload, null, 2);
    this._downloadFile(jsonStr, `OmniComplexity_Analysis_${Date.now()}.json`, 'application/json');
  }

  static _downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
}
