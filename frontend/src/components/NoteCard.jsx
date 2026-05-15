import { useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';

/** Relative "time ago" formatting for note timestamps. */
function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

/** Compact note preview card used in list views. */
export default function NoteCard({ note }) {
  const navigate = useNavigate();

  return (
    <article
      className="card note-card fade-in"
      onClick={() => navigate(`/app/notes/${note._id}`)}
    >
      <div className="row spread" style={{ alignItems: 'flex-start' }}>
        <h3>{note.title}</h3>
        {note.isPublic && (
          <span className="tag tag-accent">
            <Icon name="link" size={11} /> Shared
          </span>
        )}
      </div>

      <p className="preview">{note.content?.trim() || 'Empty note'}</p>

      {note.tags?.length > 0 && (
        <div className="row wrap" style={{ gap: 5 }}>
          {note.tags.slice(0, 3).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="tag">+{note.tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="row spread">
        <span className="note-meta">
          <Icon name="folder" size={13} /> {note.category}
        </span>
        <span className="note-meta">
          <Icon name="clock" size={13} /> {timeAgo(note.updatedAt)}
        </span>
      </div>
    </article>
  );
}
