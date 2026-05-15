import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useToast } from '../components/Toast.jsx';
import Icon from '../components/Icon.jsx';

/** Stat tile for the dashboard. */
function Stat({ value, label, icon }) {
  return (
    <div className="card stat fade-in">
      <span className="stat-icon">
        <Icon name={icon} size={22} />
      </span>
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}

/**
 * Productivity Insights dashboard:
 * total notes, recent notes, most-used tags, AI usage, weekly activity chart.
 */
export default function Insights() {
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .getInsights()
      .then(setData)
      .catch((err) => toast(err.message));
  }, [toast]);

  if (!data) {
    return (
      <div className="empty">
        <span className="spinner" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  const maxBar = Math.max(...data.weeklyActivity.map((d) => d.count), 1);

  return (
    <div>
      <div className="page-head">
        <h2>Productivity Insights</h2>
        <p className="sub">An overview of your notes activity.</p>
      </div>

      <div className="stat-grid">
        <Stat value={data.totalNotes} label="Active notes" icon="note" />
        <Stat value={data.archivedNotes} label="Archived notes" icon="archive" />
        <Stat value={data.ai.totalGenerations} label="AI generations" icon="sparkle" />
        <Stat value={data.ai.notesWithSummary} label="Notes summarised" icon="check" />
        <Stat value={data.weeklyTotal} label="Actions this week" icon="clock" />
      </div>

      <div className="insight-cols">
        {/* Weekly activity chart */}
        <div className="card panel fade-in">
          <h4>Weekly activity</h4>
          <p className="muted" style={{ fontSize: 13, marginBottom: 4 }}>
            Notes created, edited, shared & AI runs over the last 7 days.
          </p>
          <div className="bar-chart">
            {data.weeklyActivity.map((d) => (
              <div key={d.date} className="bar-col" title={`${d.count} actions`}>
                <div
                  className="bar"
                  style={{ height: `${(d.count / maxBar) * 100}%` }}
                />
                <span className="bar-label">
                  {new Date(d.date).toLocaleDateString(undefined, {
                    weekday: 'short',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most-used tags */}
        <div className="card panel fade-in">
          <h4 className="row" style={{ gap: 7 }}>
            <Icon name="tag" size={17} /> Most-used tags
          </h4>
          {data.topTags.length === 0 ? (
            <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
              No tags yet — add tags to your notes to organise them.
            </p>
          ) : (
            <div className="row wrap" style={{ marginTop: 10 }}>
              {data.topTags.map((t) => (
                <span key={t.tag} className="tag tag-accent">
                  {t.tag} · {t.count}
                </span>
              ))}
            </div>
          )}

          <h4 className="row" style={{ gap: 7, marginTop: 20 }}>
            <Icon name="sparkle" size={17} /> AI provider
          </h4>
          <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>
            Currently using <strong style={{ color: 'var(--text)' }}>{data.ai.provider}</strong>
            {data.ai.provider === 'mock'
              ? ' — set LLM_API_KEY to enable Gemini.'
              : '.'}
          </p>
        </div>
      </div>

      {/* Recently edited */}
      <div className="card panel fade-in" style={{ marginTop: 16 }}>
        <h4 className="row" style={{ gap: 7, marginBottom: 6 }}>
          <Icon name="clock" size={17} /> Recently edited
        </h4>
        {data.recentNotes.length === 0 ? (
          <p className="muted" style={{ fontSize: 13 }}>No notes yet.</p>
        ) : (
          data.recentNotes.map((n) => (
            <div
              key={n._id}
              className="recent-row"
              onClick={() => navigate(`/app/notes/${n._id}`)}
            >
              <span className="recent-title">{n.title}</span>
              <span className="muted" style={{ fontSize: 12.5 }}>
                {new Date(n.updatedAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
