(() => {
  const initialHash = location.hash;
  let ready = false;

  window.courseDeckChanged = (slides, index) => {
    const active = slides[index];
    const moveFocus = Array.from(slides).some(slide => slide !== active && slide.contains(document.activeElement));
    slides.forEach(slide => {
      slide.inert = slide !== active;
      slide.setAttribute('aria-hidden', String(slide !== active));
    });
    if (moveFocus) active.focus({ preventScroll: true });
    if (ready) history.replaceState(null, '', `#${active.id}`);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const slides = Array.from(document.querySelectorAll('.slide'));
    if (slides.length) {
      const openHash = hash => {
        const id = hash.slice(1);
        const target = document.getElementById(id);
        const index = target ? slides.indexOf(target.closest('.slide')) : /^\d+$/.test(id) ? Number(id) - 1 : -1;
        if (index >= 0 && index < slides.length) window.show(index);
        else window.show(slides.findIndex(slide => slide.classList.contains('active')));
      };
      const counter = document.getElementById('counter');
      counter.setAttribute('role', 'status');
      counter.setAttribute('aria-label', 'Slide');
      ready = true;
      openHash(initialHash);
      window.addEventListener('hashchange', () => openHash(location.hash));
    }

    const input = document.getElementById('course-search');
    if (!input) return;
    const sessions = Array.from(document.querySelectorAll('.session-entry'));
    const count = document.getElementById('session-count');
    const totalLabel = count.textContent;
    const empty = document.getElementById('search-empty');
    const clear = document.getElementById('search-clear');
    const filter = () => {
      const terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
      let visible = 0;
      sessions.forEach(session => {
        const content = session.textContent.toLocaleLowerCase();
        session.hidden = !terms.every(term => content.includes(term));
        if (!session.hidden) visible += 1;
      });
      count.textContent = terms.length ? `${visible} of ${sessions.length} results` : totalLabel;
      empty.hidden = visible !== 0;
      clear.hidden = input.value.length === 0;
    };
    document.getElementById('search-tools').hidden = false;
    input.addEventListener('input', filter);
    clear.addEventListener('click', () => {
      input.value = '';
      filter();
      input.focus();
    });
    filter();
  });
})();
