import {
  getMetadata,
} from '../../scripts/aem.js';

/**
 * Modifies the DOM as necessary to display the block.
 * @param {HTMLElement} block Default DOM structure for the block.
 */
export default async function decorate(block) {
  const subnav = getMetadata('subnav');
  const currentURL = window.location.href;
  if (subnav) {
    const resp = await fetch('/query-index.json');
    if (resp.ok) {
      const json = await resp.json();
      const filteredEntries = json.data.filter((entry) => entry.path.startsWith('/uk/web/en/used-cars'));
      const subnavWrapper = document.createElement('div');
      subnavWrapper.classList.add('subnav-wrapper');

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
      subnavTitle.textContent = 'Audi Used Cars';

      subnavTitle.addEventListener('click', () => {
        ul.classList.toggle('subnav-expand');
        subnavTitle.classList.toggle('subnav-title-expand');
      });

      subnavWrapper.append(subnavTitle, ul);
      block.appendChild(subnavWrapper);
    }
  }
}
