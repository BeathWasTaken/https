'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

const GrowtopiaLogin: React.FC = () => {
  const searchParams = useSearchParams();
  const [growId, setGrowId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const guestFormRef = useRef<HTMLFormElement | null>(null);

  // Get data from URL parameters
  const serverName = searchParams.get('server_name') || 'WipePs Private Server';
  const token = searchParams.get('data') || '';

  useEffect(() => {
    // Set document title
    document.title = 'Growtopia Player Support';

    // Set favicon
    const faviconUrl =
      'https://s3.eu-west-1.amazonaws.com/cdn.growtopiagame.com/website/resources/assets/images/growtopia.ico';

    const setLink = (rel: string, type?: string) => {
      let link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        if (type) link.type = type;
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    };

    setLink('icon', 'image/png');
    setLink('shortcut icon', 'image/x-icon');

    // Load saved GrowID from localStorage
    const savedGrowId = localStorage.getItem('growId');
    if (savedGrowId) setGrowId(savedGrowId);

    // Prevent dev tools keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Mobile scaling observer
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'DIV') {
            const el = node as HTMLElement;
            if (window.screen.width < 667) {
              el.style.transform = 'scale(0.75)';
              el.style.transformOrigin = '0 0';
              el.style.overflow = 'auto';
            }
          }
        });
      });
    });
    observer.observe(document.body, { childList: true });

    // Anchor single-click guard (mirrors original jQuery behavior)
    const handleAnchorClick = (e: Event) => {
      if (!clicked) {
        setClicked(true);
        return;
      }
      e.preventDefault();
    };
    const anchors = document.querySelectorAll('a');
    anchors.forEach((a) => a.addEventListener('click', handleAnchorClick));

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
      anchors.forEach((a) => a.removeEventListener('click', handleAnchorClick));
    };
  }, [clicked]);

  /* ─── Validate & Submit ─── */
  const validateForm = (): boolean => {
    if (!growId.trim() || !password.trim()) {
      setError('Please enter your Growtopia Name and Password.');
      return false;
    }
    setError('');
    return true;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    localStorage.setItem('growId', growId);
    formRef.current?.submit();
  };

  /* ─── Play as Guest ─── */
  const playAsGuest = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://gtps.my.id/player/growid/login/validate';

    const tokenField = document.createElement('input');
    tokenField.type = 'hidden';
    tokenField.name = '_token';
    tokenField.value = token;

    const emailField = document.createElement('input');
    emailField.type = 'hidden';
    emailField.name = 'email';
    emailField.value = 'guest@gmail.com';

    form.appendChild(tokenField);
    form.appendChild(emailField);
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <>
      {/* ── External stylesheets from original HTML ── */}
      <link
        media="all"
        rel="stylesheet"
        href="https://s3.eu-west-1.amazonaws.com/cdn.growtopiagame.com/website/resources/assets/css/faq-main.css"
      />
      <link
        media="all"
        rel="stylesheet"
        href="https://s3.eu-west-1.amazonaws.com/cdn.growtopiagame.com/website/resources/assets/css/shop-custom.css"
      />
      <link
        media="all"
        rel="stylesheet"
        href="https://s3.eu-west-1.amazonaws.com/cdn.growtopiagame.com/website/resources/assets/css/ingame-custom.css"
      />

      <style>{`
        .modal-backdrop { background-color: rgba(0,0,0,0.1) !important; }
        .modal-backdrop + div { overflow: auto; }
        .modal-body, .content { padding: 0; }
      `}</style>

      {/* ── Main layout mirrors original HTML structure ── */}
      <div
        className="content"
        style={{ backgroundColor: 'rgba(0,0,0,0)', width: '100%', height: '100%' }}
      >
        <section className="common-box">
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <div className="row">
                  {/* Modal */}
                  <div
                    className="modal fade product-list-popup show"
                    id="modalShow"
                    role="dialog"
                    aria-hidden="false"
                    style={{ display: 'block' }}
                  >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                      <div className="modal-content">
                        <div className="modal-body">
                          <div className="content">
                            <section className="common-box">
                              <div className="container">
                                {/* Title */}
                                <div className="section-title center-align">
                                  <h2>{serverName}</h2>
                                </div>

                                <div className="row div-content-center">
                                  <div className="col-md-12 col-sm-12">

                                    {/* ── Login Form ── */}
                                    <form
                                      id="loginForm"
                                      ref={formRef}
                                      method="POST"
                                      action="https://gtps.my.id/player/growid/login/validate"
                                      acceptCharset="UTF-8"
                                      role="form"
                                      onSubmit={handleLoginSubmit}
                                    >
                                      {/* Hidden token */}
                                      <input
                                        id="_token"
                                        name="_token"
                                        type="hidden"
                                        value={token}
                                      />

                                      {/* Username */}
                                      <div className="form-group">
                                        <input
                                          id="login-name"
                                          className="form-control grow-text"
                                          placeholder="Input your username..."
                                          name="growId"
                                          type="text"
                                          required
                                          value={growId}
                                          onChange={(e) => setGrowId(e.target.value)}
                                        />
                                      </div>

                                      {/* Password */}
                                      <div className="form-group" style={{ position: 'relative' }}>
                                        <input
                                          id="password"
                                          className="form-control grow-text"
                                          placeholder="Input your password..."
                                          name="password"
                                          type={showPassword ? 'text' : 'password'}
                                          required
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                        />
                                        {/* Toggle password visibility */}
                                        <button
                                          type="button"
                                          onClick={() => setShowPassword((v) => !v)}
                                          style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0,
                                            color: '#888',
                                          }}
                                          aria-label="Toggle password visibility"
                                        >
                                          {showPassword ? (
                                            /* eye-slash icon */
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                              <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                                              <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                                            </svg>
                                          ) : (
                                            /* eye icon */
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                            </svg>
                                          )}
                                        </button>
                                      </div>

                                      {/* Validation error */}
                                      {error && (
                                        <div className="form-group text-center" style={{ color: 'red', fontSize: '0.875rem' }}>
                                          {error}
                                        </div>
                                      )}

                                      {/* Help link */}
                                      <div className="form-group text-center forgot-password">
                                        <a href="https://discord.gg/ZCQw89gahn" target="_blank" rel="noreferrer">
                                          Need Help? Join our Discord!
                                        </a>
                                      </div>

                                      {/* Login button */}
                                      <div className="form-group text-center">
                                        <input
                                          className="btn btn-lg btn-primary grow-button"
                                          type="submit"
                                          value="Log in"
                                        />
                                      </div>

                                      {/* Guest button */}
                                      <div className="form-group text-center">
                                        <button
                                          type="button"
                                          className="btn btn-lg btn-secondary grow-button"
                                          onClick={playAsGuest}
                                        >
                                          Play as Guest
                                        </button>
                                      </div>
                                    </form>

                                  </div>
                                </div>
                              </div>
                            </section>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Modal */}

                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default GrowtopiaLogin;
