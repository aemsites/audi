import { getMetadata, decorateIcons, toClassName } from '../../scripts/aem.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function linkFromObject(obj) {
  const a = document.createElement('a');
  a.href = obj.Url;
  a.target = obj.Target;
  a.title = obj.Text;
  const text = document.createElement('span');
  text.textContent = obj.Text;
  a.append(text);
  return a;
}

function createNavSection(navSectionJson, sectionCount) {
  const li = document.createElement('li');
  li.classList.add('nav-section');
  const sectionLink = linkFromObject(navSectionJson.Link);
  sectionLink.setAttribute('role', 'button');
  li.append(sectionLink);
  const sectionId = toClassName(`nav-section-${sectionLink.textContent}-${sectionCount}`);
  sectionLink.setAttribute('aria-controls', sectionId);
  sectionLink.setAttribute('aria-expanded', false);

  const flyout = document.createElement('div');
  flyout.classList.add('nav-section-flyout');
  flyout.id = sectionId;
  li.append(flyout);

  const ul = document.createElement('ul');
  ul.append(...navSectionJson.SubNavigation.map((subNav) => {
    const subLi = document.createElement('li');
    subLi.classList.add('nav-item');
    subLi.append(linkFromObject(subNav));
    if (subNav.IsAudiSport) {
      subLi.classList.add('audi-sport');
    }
    return subLi;
  }));
  flyout.append(ul);

  const teaser = document.createElement('div');
  teaser.classList.add('nav-section-teaser');
  const teaserImg = document.createElement('img');
  teaserImg.src = navSectionJson.Teaser.Image.Src;
  teaserImg.alt = navSectionJson.Teaser.Image.Alt;
  teaserImg.width = navSectionJson.Teaser.Image.Width;
  teaserImg.height = navSectionJson.Teaser.Image.Height;
  teaser.append(teaserImg);
  teaser.append(linkFromObject(navSectionJson.Teaser.Link));
  flyout.append(teaser);

  return li;
}

/**
 * built and return the nav element
 * @param {object} navJson the audi nav json object
 */
function buildNav(navJson) {
  const nav = document.createElement('nav');

  // brand
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const brandLink = linkFromObject(navJson.Logo);
  const brandIcon = document.createElement('span');
  brandIcon.classList.add('icon', 'icon-brand');
  brandLink.append(brandIcon);
  brand.append(brandLink);

  // sections
  const sections = document.createElement('div');
  sections.className = 'nav-sections';
  const ul = document.createElement('ul');
  ul.classList.add('nav-list');
  ul.id = 'nav-list';
  ul.append(...navJson.MainNavigation.map(createNavSection));
  sections.append(ul);

  // tools
  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  const searchButton = document.createElement('button');
  const searchIcon = document.createElement('span');
  searchIcon.classList.add('icon', 'icon-search');
  searchButton.append(searchIcon);
  searchButton.setAttribute('aria-label', navJson.Search.Label);
  searchButton.setAttribute('type', 'button');
  searchButton.dataset.clientId = navJson.Search.OneHeaderSearchClientId;
  searchButton.dataset.queryParam = navJson.Search.QueryParam;
  tools.append(searchButton);

  nav.append(brand, sections, tools);

  // hamburger
  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('nav-hamburger');
  hamburgerButton.setAttribute('type', 'button');
  hamburgerButton.setAttribute('aria-controls', 'nav-list');
  hamburgerButton.setAttribute('aria-label', `Open ${navJson.MenuLabel}`);
  hamburgerButton.setAttribute('aria-expanded', 'false');
  const hamburgerButtonIcon = document.createElement('span');
  hamburgerButtonIcon.className = 'nav-hamburger-icon';
  hamburgerButton.append(hamburgerButtonIcon);
  const hamburgerButtonText = document.createElement('span');
  hamburgerButtonText.textContent = navJson.MenuLabel;
  hamburgerButtonText.classList.add('nav-hamburger-label');
  hamburgerButton.append(hamburgerButtonText);

  nav.prepend(hamburgerButton);

  // hamburgerButton.addEventListener('click', () => toggleMenu(nav, sections));

  // // prevent mobile nav behavior on window resize
  // toggleMenu(nav, sections, isDesktop.matches);
  // isDesktop.addEventListener('change', () => toggleMenu(nav, sections, isDesktop.matches));

  decorateIcons(nav);
  return nav;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/uk/web/en/tools/nemo/navigation/oneheader/_jcr_content.json';
  const resp = await fetch(`https://www.audi.co.uk${navPath}`); // todo cors
  if (resp.ok) {
    const navJson = await resp.json();
    const nav = buildNav(navJson);

    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.replaceChildren(navWrapper);
  }
}
