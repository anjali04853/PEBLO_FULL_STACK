import { useState } from 'react';
import { api } from '../api/client.js';
import { useToast } from './Toast.jsx';
import Icon from './Icon.jsx';

/**
 * Modal for managing a note's public share link.
 * Generating a link makes the note readable at /share/:shareId without login.
 */
export default function ShareModal({ note, onClose, onChange }) {
  const toast = useToast();
  const [shareId, setShareId] = useState(note.shareId || null);
  const [isPublic, setIsPublic] = useState(note.isPublic);
  const [busy, setBusy] = useState(false);

  const shareUrl = shareId ? `${window.location.origin}/share/${shareId}` : '';

  async function enable() {
    setBusy(true);
    try {
      const res = await api.shareNote(note._id);
      setShareId(res.shareId);
      setIsPublic(true);
      onChange({ isPublic: true, shareId: res.shareId });
      toast('Public link created');
    } catch (err) {
      toast(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      await api.unshareNote(note._id);
      setIsPublic(false);
      onChange({ isPublic: false });
      toast('Note is private again');
    } catch (err) {
      toast(err.message);
    } finally {
      setBusy(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(shareUrl);
    toast('Link copied to clipboard');
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="card modal" onClick={(e) => e.stopPropagation()}>
        <div className="row spread" style={{ marginBottom: 6 }}>
          <h3 className="row" style={{ gap: 8 }}>
            <Icon name="share" size={19} /> Share this note
          </h3>
          <button className="btn-ghost" style={{ display: 'flex', padding: 5, borderRadius: 7, color: 'var(--text-muted)' }} onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>
        <p className="muted" style={{ fontSize: 13.5, marginBottom: 18 }}>
          Anyone with the link can view this note — no login required.
        </p>

        {isPublic && shareId ? (
          <>
            <div className="field">
              <label>Public link</label>
              <div className="row">
                <input className="input" readOnly value={shareUrl} />
                <button className="btn" onClick={copy}>
                  <Icon name="copy" size={15} /> Copy
                </button>
              </div>
            </div>
            <div className="row spread" style={{ marginTop: 16 }}>
              <a className="btn btn-sm" href={shareUrl} target="_blank" rel="noreferrer">
                <Icon name="eye" size={15} /> Open page
              </a>
              <button className="btn btn-danger btn-sm" onClick={disable} disabled={busy}>
                Stop sharing
              </button>
            </div>
          </>
        ) : (
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={enable}
            disabled={busy}
          >
            {busy ? <span className="spinner" /> : (
              <>
                <Icon name="link" size={16} /> Create public link
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
