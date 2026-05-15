import { useState, useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

/**
 * "AI in action" demo — a self-playing animated sequence that shows the
 * product's core loop: a raw note is typed, then the AI generates a
 * summary, action items and a title. Built as a looping React animation
 * (no external video file) so it always plays, on-theme, with no
 * licensing or loading concerns.
 */
const RAW =
  'Team sync on the Q3 launch. We agreed to ship the notes editor first. ' +
  'Priya will prepare the UI mockups. Backend API review is due Friday. ' +
  'Need to finalise the pricing page before the demo.';

const AI = {
  summary:
    'A Q3 launch planning sync — the team prioritised shipping the notes editor and set owners for design and backend work.',
  actions: [
    'Priya to prepare the UI mockups',
    'Complete the backend API review by Friday',
    'Finalise the pricing page before the demo',
  ],
  title: 'Q3 Launch Planning Sync',
};

// Sequence phases, in milliseconds.
const TYPING_MS = 4200;
const THINK_MS = 1100;
const REVEAL_STEP = 850;
const HOLD_MS = 3600;

export default function AIDemoVideo() {
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState('typing'); // typing | thinking | reveal | hold
  const [revealed, setRevealed] = useState(0); // 0..3 (summary, actions, title)
  const timers = useRef([]);

  useEffect(() => {
    function clearAll() {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    }

    function run() {
      clearAll();
      setTyped('');
      setRevealed(0);
      setPhase('typing');

      // 1. type the raw note character by character
      const charDelay = TYPING_MS / RAW.length;
      for (let i = 1; i <= RAW.length; i++) {
        timers.current.push(
          setTimeout(() => setTyped(RAW.slice(0, i)), charDelay * i)
        );
      }

      // 2. thinking
      timers.current.push(
        setTimeout(() => setPhase('thinking'), TYPING_MS)
      );

      // 3. reveal AI blocks one by one
      timers.current.push(
        setTimeout(() => {
          setPhase('reveal');
          setRevealed(1);
        }, TYPING_MS + THINK_MS)
      );
      timers.current.push(
        setTimeout(
          () => setRevealed(2),
          TYPING_MS + THINK_MS + REVEAL_STEP
        )
      );
      timers.current.push(
        setTimeout(
          () => setRevealed(3),
          TYPING_MS + THINK_MS + REVEAL_STEP * 2
        )
      );

      // 4. hold, then loop
      timers.current.push(
        setTimeout(
          () => {
            setPhase('hold');
            timers.current.push(setTimeout(run, HOLD_MS));
          },
          TYPING_MS + THINK_MS + REVEAL_STEP * 2 + 600
        )
      );
    }

    run();
    return clearAll;
  }, []);

  return (
    <div className="card demo-window">
      {/* faux app title bar */}
      <div className="demo-titlebar">
        <span className="demo-dot" />
        <span className="demo-dot" />
        <span className="demo-dot" />
        <span className="demo-titlebar-label">Peblo Notes — live preview</span>
      </div>

      <div className="demo-body">
        {/* left: the note being written */}
        <div className="demo-pane">
          <div className="demo-pane-head">
            <Icon name="edit" size={14} /> Your note
          </div>
          <p className="demo-note-text">
            {typed}
            {phase === 'typing' && <span className="demo-caret" />}
          </p>
        </div>

        {/* right: the AI panel */}
        <div className="demo-pane demo-pane-ai">
          <div className="demo-pane-head">
            <Icon name="sparkle" size={14} /> AI Insights
          </div>

          {phase === 'typing' && (
            <p className="demo-ai-idle">Waiting for your note…</p>
          )}

          {phase === 'thinking' && (
            <div className="demo-thinking">
              <span className="demo-think-dot" />
              <span className="demo-think-dot" />
              <span className="demo-think-dot" />
              <span>Generating insights</span>
            </div>
          )}

          {(phase === 'reveal' || phase === 'hold') && (
            <div className="demo-ai-result">
              {revealed >= 1 && (
                <div className="demo-ai-block fade-in">
                  <div className="demo-ai-label">Summary</div>
                  <p>{AI.summary}</p>
                </div>
              )}
              {revealed >= 2 && (
                <div className="demo-ai-block fade-in">
                  <div className="demo-ai-label">Action items</div>
                  <ul>
                    {AI.actions.map((a) => (
                      <li key={a}>
                        <Icon name="check" size={13} /> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {revealed >= 3 && (
                <div className="demo-ai-block fade-in">
                  <div className="demo-ai-label">Suggested title</div>
                  <p className="demo-ai-title">{AI.title}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="demo-caption">
        <span className="demo-live-dot" /> Watch the AI summarise a note in real time
      </div>
    </div>
  );
}
