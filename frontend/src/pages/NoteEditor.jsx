import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useToast } from '../components/Toast.jsx';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback.js';
import AIPanel from '../components/AIPanel.jsx';
import ShareModal from '../components/ShareModal.jsx';
import Markdown from '../components/Markdown.jsx';
import Icon from '../components/Icon.jsx';

/**
 * Full note editor with:
 *  - debounced auto-save (title, content, tags, category)
 *  - optimistic local state, save-status indicator
 *  - markdown preview toggle
 *  - tag editing, archive, delete, public sharing
 *  - keyboard shortcuts: Ctrl/Cmd+S save now, Ctrl/Cmd+E toggle preview
 */
export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [note, setNote] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error
  const [showPreview, setShowPreview] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const dirtyRef = useRef(false);

  useEffect(() => {
    api
      .getNote(id)
      .then((res) => setNote(res.note))
      .catch((err) => {
        toast(err.message);
        navigate('/app');
      });
  }, [id, navigate, toast]);

  const persist = useCallback(
    async (patch) => {
      setStatus('saving');
      try {
        const res = await api.updateNote(id, patch);
        setNote((n) => ({ ...n, ...res.note }));
        dirtyRef.current = false;
        setStatus('saved');
      } catch (err) {
        setStatus('error');
        toast(err.message);
      }
    },
    [id, toast]
  );

  const debouncedSave = useDebouncedCallback(persist, 900);

  function edit(patch) {
    setNote((n) => ({ ...n, ...patch }));
    dirtyRef.current = true;
    setStatus('saving');
    debouncedSave(patch);
  }

  useEffect(() => {
    function onKey(e) {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (note) persist({ title: note.title, content: note.content });
      }
      if (mod && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setShowPreview((p) => !p);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [note, persist]);

  useEffect(() => {
    function beforeUnload(e) {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    }
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, []);

  if (!note) {
    return (
      <div className="empty">
        <span className="spinner" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  function addTag(e) {
    e.preventDefault();
    const t = tagInput.trim().toLowerCase();
    if (t && !note.tags.includes(t)) edit({ tags: [...note.tags, t] });
    setTagInput('');
  }

  function removeTag(t) {
    edit({ tags: note.tags.filter((x) => x !== t) });
  }

  async function toggleArchive() {
    await persist({ isArchived: !note.isArchived });
    toast(note.isArchived ? 'Note restored' : 'Note archived');
    navigate(note.isArchived ? '/app' : '/app/archived');
  }

  async function remove() {
    if (!confirm('Delete this note permanently?')) return;
    try {
      await api.deleteNote(id);
      toast('Note deleted');
      navigate('/app');
    } catch (err) {
      toast(err.message);
    }
  }

  const statusContent = {
    idle: null,
    saving: <><span className="spinner" style={{ width: 11, height: 11 }} /> Saving…</>,
    saved: <><Icon name="check" size={13} /> Saved</>,
    error: <>Save failed</>,
  }[status];

  return (
    <div>
      <div className="editor-bar">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          <Icon name="back" size={16} /> Back
        </button>
        <div className="row wrap">
          <span className={`save-status ${status}`}>{statusContent}</span>
          <button className="btn btn-sm" onClick={() => setShowPreview((p) => !p)} title="Ctrl/Cmd + E">
            <Icon name={showPreview ? 'edit' : 'eye'} size={15} />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button className="btn btn-sm" onClick={() => setShowShare(true)}>
            <Icon name={note.isPublic ? 'link' : 'share'} size={15} />
            {note.isPublic ? 'Shared' : 'Share'}
          </button>
          <button className="btn btn-sm" onClick={toggleArchive}>
            <Icon name="archive" size={15} />
            {note.isArchived ? 'Restore' : 'Archive'}
          </button>
          <button className="btn btn-danger btn-sm" onClick={remove}>
            <Icon name="trash" size={15} /> Delete
          </button>
        </div>
      </div>

      <div className="editor-grid">
        <div className="card editor-paper">
          <input
            className="title-input"
            value={note.title}
            onChange={(e) => edit({ title: e.target.value })}
            placeholder="Note title"
          />

          <div className="meta-row">
            <div className="input-icon" style={{ width: 170 }}>
              <Icon name="folder" size={15} />
              <input
                className="input"
                value={note.category}
                onChange={(e) => edit({ category: e.target.value })}
                placeholder="Category"
              />
            </div>
            {note.tags.map((t) => (
              <span key={t} className="tag tag-accent">
                {t}
                <button onClick={() => removeTag(t)} title="Remove tag">
                  <Icon name="close" size={11} />
                </button>
              </span>
            ))}
            <form onSubmit={addTag}>
              <input
                className="input"
                style={{ width: 116 }}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="+ add tag"
              />
            </form>
          </div>

          {showPreview ? (
            <Markdown source={note.content} className="md-preview" />
          ) : (
            <textarea
              className="editor-textarea"
              value={note.content}
              onChange={(e) => edit({ content: e.target.value })}
              placeholder="Start writing… Markdown supported. Press Ctrl/Cmd+E to preview."
            />
          )}
        </div>

        <AIPanel
          note={note}
          onApplyTitle={(title) => {
            edit({ title });
            toast('Title updated');
          }}
        />
      </div>

      {showShare && (
        <ShareModal
          note={note}
          onClose={() => setShowShare(false)}
          onChange={(patch) => setNote((n) => ({ ...n, ...patch }))}
        />
      )}
    </div>
  );
}
