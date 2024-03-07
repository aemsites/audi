export default function decorate(block) {
  block.querySelectorAll('p > a').forEach((a) => {
    a.title = a.title || a.textContent;
    if (a.href !== a.textContent) {
      const up = a.parentElement;
      if (up.tagName === 'P' || up.tagName === 'DIV') {
        a.className = 'button'; // default
        up.classList.add('button-container');
      }
    }
  });
}
