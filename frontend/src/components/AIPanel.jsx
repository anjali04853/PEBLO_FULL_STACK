import { useState } from 'react';
import { api } from '../api/client.js';
import { useToast } from './Toast.jsx';
import Icon from './Icon.jsx';

/**
 * AI sidebar panel. Runs the /generate-summary endpoint and displays
 * the summary, extracted action items and a suggested title.
 */
export default function AIPanel({ note, onApplyTitle }) {
  const toast = useToast();
  const [result, setResult] = useState(note.ai?.generatedAt ? note.ai : null);
  const [busy, setBusy] = useState(false);

  async function generate() {
    setBusy(true);
    try {
      const res = await api.generateSummary(note._id);
      setResult({
        summary: res.summary,
        actionItems: res.action_items,
        suggestedTitle: res.suggested_title,
        provider: res.provider,
      });
      toast(`AI insights generated · ${res.provider}`);
    } catch (err) {
      toast(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card ai-panel">
      <div className="row spread" style={{ marginBottom: 12 }}>
        <h4>
          <Icon name="sparkle" size={18} /> AI Insights
        </h4>
        {result?.provider && <span className="tag tag-accent">{result.provider}</span>}
      </div>

      <button
        className="btn btn-primary"
        style={{ width: '100%', marginBottom: 14 }}
        onClick={generate}
        disabled={busy}
      >
        {busy ? (
          <>
            <span className="spinner" /> Analysing…
          </>
        ) : result ? (
          <>
            <Icon name="sparkle" size={16} /> Regenerate insights
          </>
        ) : (
          <>
            <Icon name="sparkle" size={16} /> Generate insights
          </>
        )}
      </button>

      {!result && !busy && (
        <p className="ai-empty">
          Generate a concise summary, extract action items, and get a suggested
          title — all from your note content.
        </p>
      )}

      {result && (
        <div className="fade-in">
          <div className="ai-block">
            <div className="ai-label">Summary</div>
            <p>{result.summary || '—'}</p>
          </div>

          <div className="ai-block">
            <div className="ai-label">Action items</div>
            {result.actionItems?.length ? (
              <ul>
                {result.actionItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="ai-empty">No action items detected.</p>
            )}
          </div>

          <div className="ai-block">
            <div className="ai-label">Suggested title</div>
            <p>{result.suggestedTitle || '—'}</p>
            {result.suggestedTitle && (
              <button
                className="btn btn-sm"
                style={{ marginTop: 8 }}
                onClick={() => onApplyTitle(result.suggestedTitle)}
              >
                <Icon name="check" size={14} /> Apply this title
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
