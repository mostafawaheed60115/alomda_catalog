import { Component } from 'react';
import { CONTACT, telLink } from '../config/store';

/** Last line of defence: a render error shows a message instead of a blank page. */
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('Catalog render error:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="grid min-h-screen place-items-center bg-paper p-6 text-center text-ink">
        <div className="max-w-md rounded-2xl bg-white p-8 shadow-float">
          <h1 className="text-2xl font-bold">حدث خطأ غير متوقع</h1>
          <p className="mt-2 text-ink/70">حدّث الصفحة، أو تواصل معنا مباشرة.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => location.reload()}
              className="rounded-xl bg-royal px-5 py-3 font-bold text-paper shadow-edge-royal">تحديث الصفحة</button>
            <a href={telLink} dir="ltr" className="rounded-xl bg-ink px-5 py-3 font-bold text-paper shadow-edge-ink">{CONTACT.phone}</a>
          </div>
        </div>
      </main>
    );
  }
}
