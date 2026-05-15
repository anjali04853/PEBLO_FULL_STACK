import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useToast } from '../components/Toast.jsx';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback.js';
import NoteCard from '../components/NoteCard.jsx';
import Icon from '../components/Icon.jsx';
import { EmptyNotesArt, EmptySearchArt } from '../components/Illustration.jsx';

/**
 * Main workspace view: lists active notes with live keyword search,
 * tag filtering and sorting. The `archivedView` prop reuses this page
 * for the Archived screen.
 */
export default function NotesList({ archivedView = false }) {
  const navigate = useNavigate();
  const toast = useToast();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('updated');

  const load = useCallback(
    async (q = search) => {
      setLoading(true);
      try {
        const res = await api.listNotes({
          q,
          tag,
          sort,
          archived: archivedView,
        });
        setNotes(res.notes);
      } catch (err) {
        toast(err.message);
      } finally {
        setLoading(false);
      }
    },
    [search, tag, sort, archivedView, toast]
  );

  const debouncedLoad = useDebouncedCallback((q) => load(q), 350);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag, sort, archivedView]);

  const allTags = useMemo(() => {
    const set = new Set();
    notes.forEach((n) => n.tags?.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [notes]);

  async function createNote() {
    try {
      const res = await api.createNote({ title: 'Untitled note', content: '' });
      navigate(`/app/notes/${res.note._id}`);
    } catch (err) {
      toast(err.message);
    }
  }

  const isFiltering = search || tag;

  return (
    <div>
      <div className="page-head row spread wrap">
        <div>
          <h2>{archivedView ? 'Archived Notes' : 'All Notes'}</h2>
          <p className="sub">
            {archivedView
              ? 'Notes you have set aside.'
              : 'Capture, organise and summarise your thinking.'}
          </p>
        </div>
        {!archivedView && (
          <button className="btn btn-primary" onClick={createNote}>
            <Icon name="plus" size={17} /> New note
          </button>
        )}
      </div>

      <div className="toolbar">
        <div className="input-icon">
          <Icon name="search" size={17} />
          <input
            className="input"
            placeholder="Search notes by keyword…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedLoad(e.target.value);
            }}
          />
        </div>
        <select
          className="select"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          <option value="">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="updated">Recently updated</option>
          <option value="created">Recently created</option>
          <option value="title">Title (A–Z)</option>
        </select>
      </div>

      {loading ? (
        <div className="empty">
          <span className="spinner" style={{ color: 'var(--accent)' }} />
        </div>
      ) : notes.length === 0 ? (
        <div className="empty">
          <div className="empty-art">
            {isFiltering ? <EmptySearchArt /> : <EmptyNotesArt />}
          </div>
          <h3>{isFiltering ? 'No matching notes' : 'Your workspace is empty'}</h3>
          <p>
            {isFiltering
              ? 'Try a different keyword or clear the filters.'
              : archivedView
              ? 'Notes you archive will appear here.'
              : 'Create your first note to start capturing ideas.'}
          </p>
          {!isFiltering && !archivedView && (
            <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={createNote}>
              <Icon name="plus" size={17} /> New note
            </button>
          )}
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((n) => (
            <NoteCard key={n._id} note={n} />
          ))}
        </div>
      )}
    </div>
  );
}
