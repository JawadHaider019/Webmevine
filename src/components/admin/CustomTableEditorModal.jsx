'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table as TableIcon,
  Sparkles,
  Check,
  Grid,
  Columns,
  Rows,
} from 'lucide-react';

const PRESET_TEMPLATES = [
  {
    id: 'tech-stack',
    label: '⚡ Tech Stack Comparison',
    headers: ['Technology / Layer', 'Primary Use Case', 'Scalability', 'Performance'],
    alignments: ['left', 'left', 'center', 'left'],
    rows: [
      ['**Next.js 16 (App Router)**', 'SSR, SEO & Full-Stack UI', 'Enterprise', 'Sub-second LCP & Edge ready'],
      ['**Python / FastAPI + LLMs**', 'AI Agents & RAG Pipelines', 'High', 'Async streaming inference'],
      ['**MongoDB Atlas / Vector**', 'Document & Semantic Search', 'Horizontal', 'Low-latency global clusters'],
    ],
  },
  {
    id: 'mvp-vs-scale',
    label: '🚀 MVP vs. Enterprise Build',
    headers: ['Delivery Phase', 'Timeline', 'Core Deliverables', 'Ideal Stage'],
    alignments: ['left', 'center', 'left', 'left'],
    rows: [
      ['**Phase 1: AI / SaaS MVP**', '4 – 6 Weeks', 'Core workflows, Auth, Stripe, Admin CMS', 'Seed / Market validation'],
      ['**Phase 2: Growth Platform**', '6 – 10 Weeks', 'Multi-tenant RBAC, API integrations, SEO engine', 'Series A / Scaling revenue'],
      ['**Phase 3: Enterprise Suite**', '12+ Weeks', 'Custom SLAs, SOC2 compliance, microservices', 'Global enterprise rollout'],
    ],
  },
  {
    id: 'agency-comparison',
    label: '🏆 Agency vs. In-House vs. Freelancer',
    headers: ['Evaluation Factor', 'WebMavien Agency', 'In-House Team', 'Freelance Contractor'],
    alignments: ['left', 'left', 'left', 'left'],
    rows: [
      ['**Time to Kickoff**', '**Immediate (48 Hours)**', '3 – 6 Months hiring', '1 – 3 Weeks'],
      ['**Cross-Disciplinary Skill**', '**Full-Stack, AI, UI/UX & SEO**', 'Requires 4+ separate hires', 'Single specialization'],
      ['**Code Ownership & IP**', '**100% Client Owned**', '100% Client Owned', 'Varies by contract'],
    ],
  },
  {
    id: 'ai-roi',
    label: '🤖 AI Automation ROI Matrix',
    headers: ['Business Workflow', 'Manual Effort', 'With WebMavien AI Agent', 'Net Efficiency Gain'],
    alignments: ['left', 'center', 'center', 'right'],
    rows: [
      ['**Lead Qualification & Triage**', '25 mins / lead', 'Instant (24/7)', '**+92% Faster**'],
      ['**Technical SEO Content Ops**', '6 hours / article', '45 mins human review', '**8x Output**'],
      ['**Customer Support Resolution**', '4 – 12 hour wait', '< 10 seconds', '**-70% Ticket Load**'],
    ],
  },
];

export default function CustomTableEditorModal({ isOpen, onClose, onInsert }) {
  const [headers, setHeaders] = useState(['Criterion / Option', 'Details & Specs', 'Business Impact']);
  const [alignments, setAlignments] = useState(['left', 'left', 'left']);
  const [rows, setRows] = useState([
    ['**Option A**', 'Description or key metric', 'High ROI & fast deployment'],
    ['**Option B**', 'Alternative specification', 'Long-term scalability'],
  ]);

  // Visual Grid Picker state (up to 8x8)
  const [showGridPicker, setShowGridPicker] = useState(false);
  const [hoverGrid, setHoverGrid] = useState({ r: 0, c: 0 });

  if (!isOpen) return null;

  // Resize table to target rows x cols while preserving existing cell values
  const resizeTableDimensions = (targetRows, targetCols) => {
    const numRows = Math.max(1, Math.min(20, Number(targetRows) || 1));
    const numCols = Math.max(2, Math.min(10, Number(targetCols) || 2));

    setHeaders((prev) => {
      const next = [...prev];
      while (next.length < numCols) next.push(`Column ${next.length + 1}`);
      return next.slice(0, numCols);
    });

    setAlignments((prev) => {
      const next = [...prev];
      while (next.length < numCols) next.push('left');
      return next.slice(0, numCols);
    });

    setRows((prev) => {
      const next = prev.map((row) => {
        const r = [...row];
        while (r.length < numCols) r.push('');
        return r.slice(0, numCols);
      });
      while (next.length < numRows) {
        next.push(Array(numCols).fill(''));
      }
      return next.slice(0, numRows);
    });
  };

  const addColumn = () => {
    if (headers.length >= 10) return;
    setHeaders([...headers, `Column ${headers.length + 1}`]);
    setAlignments([...alignments, 'left']);
    setRows(rows.map((r) => [...r, '']));
  };

  const removeColumn = (colIdx) => {
    if (headers.length <= 2) return;
    setHeaders(headers.filter((_, i) => i !== colIdx));
    setAlignments(alignments.filter((_, i) => i !== colIdx));
    setRows(rows.map((r) => r.filter((_, i) => i !== colIdx)));
  };

  const addRow = () => {
    setRows([...rows, headers.map(() => '')]);
  };

  const removeRow = (rowIdx) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== rowIdx));
  };

  const updateHeader = (colIdx, val) => {
    const next = [...headers];
    next[colIdx] = val;
    setHeaders(next);
  };

  const updateAlignment = (colIdx, align) => {
    const next = [...alignments];
    next[colIdx] = align;
    setAlignments(next);
  };

  const updateCell = (rowIdx, colIdx, val) => {
    const next = rows.map((r) => [...r]);
    next[rowIdx][colIdx] = val;
    setRows(next);
  };

  const applyPreset = (preset) => {
    setHeaders([...preset.headers]);
    setAlignments([...preset.alignments]);
    setRows(preset.rows.map((r) => [...r]));
  };

  const generateMarkdownTable = () => {
    const cleanHeaders = headers.map((h) => (h || ' ').replace(/\|/g, '/').trim() || ' ');
    const sepCells = alignments.map((align) => {
      if (align === 'center') return ':---:';
      if (align === 'right') return '---:';
      return ':---';
    });

    const headerLine = `| ${cleanHeaders.join(' | ')} |`;
    const sepLine = `| ${sepCells.join(' | ')} |`;
    const bodyLines = rows.map((row) => {
      const cells = headers.map((_, cIdx) => {
        const val = (row[cIdx] || '').replace(/\|/g, '/').replace(/\n/g, ' ').trim();
        return val || '—';
      });
      return `| ${cells.join(' | ')} |`;
    });

    return `\n${[headerLine, sepLine, ...bodyLines].join('\n')}\n`;
  };

  const handleInsert = () => {
    const md = generateMarkdownTable();
    onInsert(md);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-black via-zinc-900 to-red-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
              <TableIcon className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-['Marcellus'] text-xl font-bold tracking-wide">
                Interactive Table Builder
              </h3>
              <p className="text-xs text-white/70">
                Design responsive data & comparison tables visually — no Markdown syntax required
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-zinc-50/60">
          {/* Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                1-Click Agency Table Templates
              </span>
              <span className="text-[11px] text-zinc-400">
                Tip: Use <code className="bg-zinc-200/70 px-1 py-0.5 rounded text-zinc-700">**text**</code> for bold inside cells
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_TEMPLATES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-zinc-200/90 hover:border-red-600 hover:bg-red-50/40 text-xs font-semibold text-zinc-700 hover:text-red-700 transition-all shadow-2xs"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Spreadsheet Grid */}
          <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-200/80 flex flex-wrap items-center justify-between gap-3">
              {/* Left: Dimensions & Visual Grid Selector */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Visual Hover Grid Picker Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setHoverGrid({ r: rows.length, c: headers.length });
                      setShowGridPicker((v) => !v);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-red-600 text-xs font-bold text-zinc-800 shadow-2xs transition-all"
                  >
                    <Grid className="w-3.5 h-3.5 text-red-600" />
                    <span>
                      Size: {rows.length} × {headers.length}
                    </span>
                  </button>

                  {showGridPicker && (
                    <div className="absolute left-0 top-full mt-2 z-30 bg-white rounded-2xl p-3.5 shadow-xl border border-zinc-200 w-56">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                          Select Grid Size
                        </span>
                        <span className="text-xs font-bold text-red-600">
                          {hoverGrid.r || rows.length} Rows × {hoverGrid.c || headers.length} Cols
                        </span>
                      </div>
                      <div
                        className="grid grid-cols-8 gap-1 p-1 bg-zinc-50 rounded-xl border border-zinc-200/70"
                        onMouseLeave={() => setHoverGrid({ r: rows.length, c: headers.length })}
                      >
                        {Array.from({ length: 8 }).map((_, rIdx) =>
                          Array.from({ length: 8 }).map((__, cIdx) => {
                            const rNum = rIdx + 1;
                            const cNum = Math.max(2, cIdx + 1);
                            const isHighlighted =
                              rIdx < (hoverGrid.r || rows.length) &&
                              cIdx < (hoverGrid.c || headers.length);
                            return (
                              <button
                                key={`${rIdx}-${cIdx}`}
                                type="button"
                                onMouseEnter={() => setHoverGrid({ r: rNum, c: cNum })}
                                onClick={() => {
                                  resizeTableDimensions(rNum, cNum);
                                  setShowGridPicker(false);
                                }}
                                className={`w-5 h-5 rounded-[4px] border transition-all ${
                                  isHighlighted
                                    ? 'bg-red-600 border-red-600 scale-105'
                                    : 'bg-white border-zinc-300 hover:border-red-500'
                                }`}
                                title={`${rNum} Rows × ${cNum} Columns`}
                              />
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Number Steppers for Rows & Columns */}
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-zinc-200 text-xs">
                  <Rows className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-zinc-500 font-medium">Rows:</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={rows.length}
                    onChange={(e) => resizeTableDimensions(e.target.value, headers.length)}
                    className="w-11 text-center font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 rounded px-1 py-0.5 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-zinc-200 text-xs">
                  <Columns className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-zinc-500 font-medium">Columns:</span>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={headers.length}
                    onChange={(e) => resizeTableDimensions(rows.length, e.target.value)}
                    className="w-11 text-center font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 rounded px-1 py-0.5 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Right: Quick + Row / + Column buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addRow}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" /> + Row
                </button>
                <button
                  type="button"
                  onClick={addColumn}
                  disabled={headers.length >= 10}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-700 text-xs font-semibold hover:bg-zinc-100 disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> + Column
                </button>
              </div>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="w-10 p-2 text-center text-[11px] font-bold text-zinc-400 uppercase">
                      #
                    </th>
                    {headers.map((header, colIdx) => (
                      <th key={colIdx} className="p-2 align-top min-w-[170px]">
                        <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/90 space-y-2">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                              Column {colIdx + 1}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {[
                                { id: 'left', icon: AlignLeft, title: 'Align Left' },
                                { id: 'center', icon: AlignCenter, title: 'Align Center' },
                                { id: 'right', icon: AlignRight, title: 'Align Right' },
                              ].map((al) => {
                                const Icon = al.icon;
                                const active = alignments[colIdx] === al.id;
                                return (
                                  <button
                                    key={al.id}
                                    type="button"
                                    onClick={() => updateAlignment(colIdx, al.id)}
                                    title={al.title}
                                    className={`p-1 rounded transition-colors ${
                                      active
                                        ? 'bg-red-600 text-white'
                                        : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60'
                                    }`}
                                  >
                                    <Icon className="w-3 h-3" />
                                  </button>
                                );
                              })}
                              {headers.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeColumn(colIdx)}
                                  title="Delete Column"
                                  className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 ml-1 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                          <input
                            type="text"
                            value={header}
                            onChange={(e) => updateHeader(colIdx, e.target.value)}
                            placeholder="Column Header..."
                            className="w-full px-2.5 py-1.5 text-xs font-bold text-zinc-900 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                          />
                        </div>
                      </th>
                    ))}
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="group hover:bg-zinc-50/50">
                      <td className="p-2 text-center text-xs font-bold text-zinc-400">
                        {rowIdx + 1}
                      </td>
                      {headers.map((_, colIdx) => (
                        <td key={colIdx} className="p-1.5">
                          <input
                            type="text"
                            value={row[colIdx] || ''}
                            onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                            onKeyDown={(e) => {
                              // Press Enter on the last row to automatically add a new row
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (rowIdx === rows.length - 1) {
                                  addRow();
                                }
                              }
                              // Press Tab on the very last cell of the table to automatically add a new row
                              if (
                                e.key === 'Tab' &&
                                !e.shiftKey &&
                                rowIdx === rows.length - 1 &&
                                colIdx === headers.length - 1
                              ) {
                                addRow();
                              }
                            }}
                            placeholder={colIdx === 0 ? 'e.g. **Feature**' : 'Value...'}
                            className={`w-full px-3 py-2 text-xs text-zinc-800 bg-white border border-zinc-200/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 ${
                              alignments[colIdx] === 'center'
                                ? 'text-center'
                                : alignments[colIdx] === 'right'
                                ? 'text-right'
                                : 'text-left'
                            } ${colIdx === 0 ? 'font-semibold' : ''}`}
                          />
                        </td>
                      ))}
                      <td className="p-1.5 text-center">
                        {rows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRow(rowIdx)}
                            title="Delete Row"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Article Design Preview */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Live Article Preview
            </p>
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 shadow-sm bg-white">
              <table className="w-full border-collapse min-w-[500px]">
                <thead className="bg-gradient-to-r from-black via-zinc-900 to-red-950 text-white">
                  <tr>
                    {headers.map((h, i) => (
                      <th
                        key={i}
                        className={`px-4 py-3 text-[12px] font-bold uppercase tracking-wider ${
                          alignments[i] === 'center'
                            ? 'text-center'
                            : alignments[i] === 'right'
                            ? 'text-right'
                            : 'text-left'
                        }`}
                      >
                        {h.replace(/\*\*/g, '') || `Column ${i + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/80">
                  {rows.map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-zinc-50/70' : 'bg-white'}>
                      {headers.map((_, cIdx) => {
                        const raw = row[cIdx] || '—';
                        const isBold = raw.startsWith('**') && raw.endsWith('**');
                        const clean = raw.replace(/\*\*/g, '');
                        return (
                          <td
                            key={cIdx}
                            className={`px-4 py-3 text-xs ${
                              alignments[cIdx] === 'center'
                                ? 'text-center'
                                : alignments[cIdx] === 'right'
                                ? 'text-right'
                                : 'text-left'
                            } ${
                              cIdx === 0 || isBold
                                ? 'font-semibold text-zinc-950'
                                : 'text-zinc-700'
                            }`}
                          >
                            {clean}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-zinc-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInsert}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all"
          >
            <Check className="w-4 h-4" />
            Insert Table into Article
          </button>
        </div>
      </div>
    </div>
  );
}

