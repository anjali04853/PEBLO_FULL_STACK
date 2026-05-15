import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import Markdown from '../components/Markdown.jsx';
import Icon from '../components/Icon.jsx';
import { BrandLogo, EmptySearchArt } from '../components/Illustration.jsx';

/**
 * Public, unauthenticated page for a shared note.
 * Reached at /share/:shareId — works without login.
 */
export default function SharedNote() {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getSharedNote(shareId)
      .then((res) => setNote(res.note))
      .catch((err) => setError(err.message));
  }, [shareId]);

  if (error) {
    return (
      <div className="share-page">
        <div className="share-wrap empty">
          <div className="empty-art">
            <EmptySearchArt />
          </div>
          <h3>Note unavailable</h3>
          <p>{error}</p>
          <Link to="/" className="btn" style={{ marginTop: 12 }}>
            Go to Peblo Notes
          </Link>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="center-screen">
        <span className="spinner" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div className="share-page">
      <div className="share-topbar">
        <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
          <BrandLogo size={24} />
          Peblo Notes
        </Link>
        <span className="tag">
          <Icon name="eye" size={12} /> Public note
        </span>
      </div>

      <div className="share-wrap">
        <div className="card share-card fade-in">
          <div className="share-header">
            <h1>{note.title}</h1>
            <p className="muted" style={{ marginTop: 8 }}>
              By {note.author} · Updated{' '}
              {new Date(note.updatedAt).toLocaleDateString()}
            </p>
            <div className="row wrap" style={{ marginTop: 12 }}>
              <span className="tag">
                <Icon name="folder" size={12} /> {note.category}
              </span>
              {note.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {note.summary && (
            <div className="ai-callout">
              <div
                className="row"
                style={{ gap: 6, color: 'var(--accent-ink)', marginBottom: 6 }}
              >
                <Icon name="sparkle" size={15} />
                <span
                  style={{
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    fontWeight: 700,
                  }}
                >
                  AI Summary
                </span>
              </div>
              <p style={{ fontSize: 14.5, color: 'var(--accent-ink)' }}>
                {note.summary}
              </p>
              {note.actionItems?.length > 0 && (
                <ul
                  style={{
                    paddingLeft: 20,
                    marginTop: 8,
                    fontSize: 14,
                    color: 'var(--accent-ink)',
                  }}
                >
                  {note.actionItems.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <Markdown source={note.content} className="share-content" />
        </div>

        <p className="muted" style={{ marginTop: 32, fontSize: 13, textAlign: 'center' }}>
          Created with <Link to="/">Peblo Notes</Link> — an AI notes workspace.
        </p>
      </div>
    </div>
  );
}
