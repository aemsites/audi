import {
  getMetadata,
} from '../../scripts/aem.js';

/**
 * Modifies the DOM as necessary to display the block.
 * @param {HTMLElement} block Default DOM structure for the block.
 */
export default async function decorate(block) {
  const pageTitle = getMetadata('page-title');
  const subnav = getMetadata('subnav');
  const subnavRoot = getMetadata('subnav-root');
  const currentURL = window.location.href;
  if (subnav && subnavRoot && subnavRoot.trim()) {
    const resp = await fetch('/query-index.json');
    if (resp.ok) {
      const json = await resp.json();
      const filteredEntries = json.data.filter((entry) => entry.path.startsWith(subnavRoot));
      const ul = document.createElement('ul');
      ul.classList.add('subnav-ul');
      filteredEntries.forEach((entry) => {
        const li = document.createElement('li');
        li.classList.add('subnav-li');
        const a = document.createElement('a');
        a.setAttribute('href', `${entry.path}`);
        a.setAttribute('title', entry['page-title']);
        if (currentURL === a.href) {
          a.classList.add('focus');
        }
        const span = document.createElement('span');
        span.textContent = entry['page-title'];
        a.appendChild(span);
        li.appendChild(a);
        ul.appendChild(li);
      });

      const subnavTitle = document.createElement('span');
      subnavTitle.classList.add('subnav-title');
      subnavTitle.textContent = pageTitle;

      subnavTitle.addEventListener('click', () => {
        ul.classList.toggle('subnav-expand');
        subnavTitle.classList.toggle('subnav-title-expand');

        if (ul.classList.contains('subnav-expand')) {
          subnavTitle.textContent = 'Audi Used Cars';
        } else {
          subnavTitle.textContent = pageTitle;
        }
      });

      block.append(subnavTitle, ul);
    }
  }
}
