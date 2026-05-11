'use client';

import { useState } from 'react';
import { submitCommission } from '@/app/actions/commissions';

export function CommissionSection() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const result = await submitCommission(formData);

    if (result.success) {
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus('error');
    }
  }

  return (
    <section id="commission">
      <div className="commission-split">
        <div className="comm-left reveal">
          <div className="sec-label">Special Request</div>
          <h2 className="comm-heading">
            Custom <em>Commissions.</em>
          </h2>
          <p className="comm-left-body">
            From personal portraits to large-scale editorial murals, I love
            bringing your unique visions to life with ink and soul.
          </p>

          <div className="comm-steps">
            <div className="comm-step">
              <div className="step-num">1</div>
              <div>
                <div className="step-title">The Brief</div>
                <div className="step-desc">
                  Share your idea, size requirements and any reference images
                  you might have.
                </div>
              </div>
            </div>
            <div className="comm-step">
              <div className="step-num">2</div>
              <div>
                <div className="step-title">The Sketch</div>
                <div className="step-desc">
                  I'll provide a rough layout and colour palette for your
                  approval before starting.
                </div>
              </div>
            </div>
            <div className="comm-step">
              <div className="step-num">3</div>
              <div>
                <div className="step-title">The Artwork</div>
                <div className="step-desc">
                  I create the piece in my studio, sending you progress updates
                  along the way.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="comm-right reveal">
          <div className="comm-right-bg"></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 className="comm-right-heading">
              Start a <em>Project.</em>
            </h3>
            <p className="comm-right-body">
              Fill out the form below and I'll get back to you within 24 hours
              with a custom quote.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                className="form-field"
                type="text"
                name="name"
                placeholder="Full Name"
                required
              />
              <input
                className="form-field"
                type="email"
                name="email"
                placeholder="Email Address"
                required
              />
              <select className="form-field" name="projectType">
                <option>Select Project Type</option>
                <option>Original Painting</option>
                <option>Digital Illustration</option>
                <option>Mural / Large Scale</option>
                <option>Other</option>
              </select>
              <textarea
                className="form-field"
                name="instructions"
                placeholder="Tell me about your vision..."
                rows={4}
                required
              ></textarea>

              <button
                className="btn-linen"
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending...' : 'Send Request'}
              </button>

              {status === 'success' && (
                <p
                  style={{
                    color: 'var(--te)',
                    marginTop: '14px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  ✓ Commission request sent!
                </p>
              )}
              {status === 'error' && (
                <p
                  style={{
                    color: '#ff6b6b',
                    marginTop: '14px',
                    fontSize: '12px',
                  }}
                >
                  × Something went wrong. Try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
