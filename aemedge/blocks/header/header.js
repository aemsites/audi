import { getMetadata, decorateIcons, toClassName } from '../../scripts/aem.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1200px)');

// Search constants
const SEARCH_AUTOCOMPLETE_ENDPOINT = 'https://search-service.audi.com/auto-complete';
// const SEARCH_COUNT_ENDPOINT = 'https://search-service.audi.com/search/count';
// const SEARCH_ENDPOINT = 'https://search-service.audi.com/search/pages';

async function getAutocompleteResults(query, clientId, queryParam) {
  const autoCompleteResults = await fetch(`${SEARCH_AUTOCOMPLETE_ENDPOINT}?${queryParam}=${query}&client=${clientId}`);
  const data = await autoCompleteResults.json();
  const autoCompleteContainer = document.querySelector('.nav-search-container .autocomplete');
  if (data && data.length > 0) {
    autoCompleteContainer.setAttribute('aria-expanded', 'true');
    autoCompleteContainer.innerHTML = '';
    const acList = document.createElement('ul');
    data.forEach((item) => {
      const a = document.createElement('a');
      a.textContent = item;
      const acItem = document.createElement('li');
      acItem.append(a);
      acList.append(acItem);
    });
    autoCompleteContainer.append(acList);
  } else {
    autoCompleteContainer.setAttribute('aria-expanded', 'false');
  }
}

async function showAutocomplete(query, clientId, queryParam) {
  const searchContainer = document.querySelector('.nav-search-container');
  const autoCompleteContainerExists = searchContainer.querySelector('.autocomplete');
  if (!autoCompleteContainerExists) {
    const tempAutoCompleteContainer = document.createElement('div');
    tempAutoCompleteContainer.classList.add('autocomplete');
    searchContainer.append(tempAutoCompleteContainer);
  }
  const resultsContainerExists = searchContainer.querySelector('.results');
  if (!resultsContainerExists) {
    const tempResultsContainer = document.createElement('div');
    tempResultsContainer.classList.add('results');
    searchContainer.append(tempResultsContainer);
  }
  if (query.length >= 2) {
    await getAutocompleteResults(query, clientId, queryParam);
  } else {
    const autoCompleteContainer = searchContainer.querySelector('.autocomplete');
    autoCompleteContainer.setAttribute('aria-expanded', 'false');
    autoCompleteContainer.innerHTML = '';
  }
}

/**
 * Add an event listener to open/close the search flyout
 * @param {*} event handler for search button click
 */
function toggleSearchContainer() {
  const searchSection = document.querySelector('.nav-tools .nav-search-container');
  const expanded = searchSection.getAttribute('aria-expanded') === 'true';
  searchSection.setAttribute('aria-expanded', !expanded);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the sections should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-section-flyout').forEach((sectionFlyout) => {
    sectionFlyout.setAttribute('aria-expanded', expanded);
  });
}

function closeOnEscape(nav, navSections) {
  const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
  const menuExpanded = nav.getAttribute('aria-expanded') === 'true';
  const searchExpanded = nav.querySelector('.nav-tools .nav-search-container[aria-expanded="true"]');
  if (navSectionExpanded) {
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(navSections);
    navSectionExpanded.focus();
  } else if (!isDesktop.matches && menuExpanded) {
    // eslint-disable-next-line no-use-before-define
    toggleMenu(nav, navSections);
    nav.querySelector('button').focus();
  }
  if (searchExpanded) toggleSearchContainer();
}

function headerKeyPress(event, nav, navSections) {
  if (event.code === 'Escape') {
    closeOnEscape(nav, navSections);
  } else if (event.code === 'Space' || event.code === 'Enter') {
    const focused = document.activeElement;
    if (focused.classList.contains('nav-section-toggle-button') || focused.classList.contains('nav-flyout-close-button')) {
      event.preventDefault();
      const flyout = document.getElementById(focused.getAttribute('aria-controls'));
      if (flyout) {
        const expanded = flyout.getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(navSections);
        flyout.setAttribute('aria-expanded', !expanded);
        flyout.addEventListener('transitionend', () => {
          if (focused.classList.contains('nav-section-toggle-button')) {
            flyout.querySelector('.nav-flyout-close-button').focus();
          } else {
            flyout.closest('.nav-section').querySelector('.nav-section-toggle-button').focus();
          }
        }, { once: true });
      }
    }
  }
}

/**
 * toggle the menu open state
 * @param {Element} nav the nav
 * @param {Element} navList the nav list (ul)
 * @param {boolean} forceExpanded if menu should be forced open instead of toggled
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button.setAttribute('aria-label', `${expanded ? 'Open' : 'Close'} ${button.querySelector('.nav-hamburger-label').textContent}`);
  // close all nav section
  toggleAllNavSections(navSections, false);
}

function linkFromObject(obj) {
  const a = document.createElement('a');
  a.className = toClassName(`link-${obj.Type}`);
  a.href = obj.Url;
  a.target = obj.Target;
  a.title = obj.Text;
  const text = document.createElement('span');
  text.className = 'link-text';
  text.textContent = obj.Text;
  a.append(text);
  return a;
}

function createNavSection(navSectionJson, sectionCount) {
  const li = document.createElement('li');
  li.classList.add('nav-section');
  const sectionLink = linkFromObject(navSectionJson.Link);
  sectionLink.setAttribute('role', 'button');
  sectionLink.classList.add('nav-section-toggle-button');
  li.append(sectionLink);
  const sectionId = toClassName(`nav-section-${sectionLink.textContent}-${sectionCount}`);
  sectionLink.setAttribute('aria-controls', sectionId);

  const flyout = document.createElement('div');
  flyout.classList.add('nav-section-flyout');
  flyout.setAttribute('aria-expanded', false);
  flyout.id = sectionId;
  li.append(flyout);

  const flyoutCloseButton = document.createElement('button');
  flyoutCloseButton.setAttribute('type', 'button');
  flyoutCloseButton.setAttribute('aria-controls', sectionId);
  flyoutCloseButton.className = 'nav-flyout-close-button';
  flyoutCloseButton.innerHTML = sectionLink.innerHTML;
  flyout.append(flyoutCloseButton);

  const lister = document.createElement('div');
  lister.className = 'for-desktop-columns';
  flyout.append(lister);
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
  lister.append(ul);

  const teaser = document.createElement('div');
  teaser.classList.add('nav-section-teaser');
  const teaserImg = document.createElement('img');
  teaserImg.src = navSectionJson.Teaser.Image.Src;
  teaserImg.alt = navSectionJson.Teaser.Image.Alt;
  teaserImg.width = navSectionJson.Teaser.Image.Width;
  teaserImg.height = navSectionJson.Teaser.Image.Height;
  teaserImg.setAttribute('loading', 'lazy');
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
  const navList = document.createElement('ul');
  navList.classList.add('nav-list');
  navList.append(...navJson.MainNavigation.map(createNavSection));
  navList.querySelectorAll('.nav-section-toggle-button, .nav-flyout-close-button').forEach((sectionButton) => {
    sectionButton.addEventListener('click', (e) => {
      e.preventDefault();
      const flyout = document.getElementById(sectionButton.getAttribute('aria-controls'));
      if (flyout) {
        const expanded = flyout.getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(sections, false);
        flyout.setAttribute('aria-expanded', !expanded);
        // if (!expanded) {
        //   flyout.addEventListener('transitionend', () => {
        //     addOutsideClickListener(flyout, () => {
        //       flyout.setAttribute('aria-expanded', false);
        //     });
        //   });
        // }
      }
    });
  });
  sections.append(navList);

  // tools and search functionality
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
  // Create the search section
  const searchContainer = document.createElement('div');
  searchContainer.classList.add('nav-search-container');
  searchContainer.setAttribute('aria-expanded', 'false');
  const closeSearchIcon = document.createElement('span');
  closeSearchIcon.classList.add('icon', 'icon-forward');
  searchContainer.append(closeSearchIcon);
  const searchSection = document.createElement('div');
  searchSection.classList.add('nav-search-bar');
  const searchInputIcon = document.createElement('span');
  searchInputIcon.classList.add('icon', 'icon-search');
  searchSection.append(searchInputIcon);
  // Create the search input field
  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'search');
  searchInput.setAttribute('name', 'q');
  searchInput.setAttribute('placeholder', 'Models / Dealers / Audi Code');
  searchInput.setAttribute('aria-label', 'Search');
  searchSection.append(searchInput);
  searchContainer.append(searchSection);
  // Open the search container
  searchButton.addEventListener('click', () => {
    if (isDesktop.matches) toggleAllNavSections(sections, false);
    toggleSearchContainer();
    searchInput.focus();
  });
  // Close the search container
  closeSearchIcon.addEventListener('click', () => {
    toggleSearchContainer();
  });
  // Search functionality
  const searchClient = navJson.Search.OneHeaderSearchClientId;
  const queryParam = navJson.Search.QueryParam;
  // Autocomplete
  // eslint-disable-next-line no-unused-vars
  searchInput.addEventListener('input', (e) => {
    showAutocomplete(e.target.value, searchClient, queryParam);
  });

  tools.append(searchButton);
  tools.append(searchContainer);

  nav.append(brand, sections, tools);

  // hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  const hamburgerButton = document.createElement('button');
  hamburgerButton.setAttribute('type', 'button');
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.setAttribute('aria-label', `Open ${navJson.MenuLabel}`);
  const hamburgerButtonIcon = document.createElement('div');
  hamburgerButtonIcon.className = 'nav-hamburger-icon';
  hamburgerButton.append(hamburgerButtonIcon);
  hamburgerButtonIcon.innerHTML = `
    <span class="line top"></span>
    <span class="line middle"></span>
    <span class="line bottom"></span> 
  `;
  const hamburgerButtonText = document.createElement('span');
  hamburgerButtonText.textContent = navJson.MenuLabel;
  hamburgerButtonText.classList.add('nav-hamburger-label');
  hamburgerButton.append(hamburgerButtonText);
  hamburger.append(hamburgerButton);

  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  nav.id = 'nav';

  hamburgerButton.addEventListener('click', () => toggleMenu(nav, sections));

  // prevent mobile nav behavior on window resize
  toggleMenu(nav, sections, isDesktop.matches);

  const closeNavOnClickOutsideNav = (evt) => {
    const openFlyout = nav.querySelector('.nav-section-flyout[aria-expanded="true"]');
    if (openFlyout && !openFlyout.contains(evt.target) && !nav.contains(evt.target)) {
      toggleAllNavSections(sections, false);
    }
    const openSearch = nav.querySelector('.nav-search-container[aria-expanded="true"]');
    if (openSearch && !openSearch.contains(evt.target) && !nav.contains(evt.target)) {
      toggleSearchContainer();
    }
  };

  if (isDesktop.matches) {
    window.addEventListener('click', closeNavOnClickOutsideNav);
  }

  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, sections, isDesktop.matches);
    if (isDesktop.matches) {
      window.addEventListener('click', closeNavOnClickOutsideNav);
    } else {
      window.removeEventListener('click', closeNavOnClickOutsideNav);
    }
  });

  // keyboard nav accessibility
  window.addEventListener('keydown', (e) => {
    headerKeyPress(e, nav, sections);
  });

  decorateIcons(nav);
  return nav;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  let navJson;
  try {
    const navPath = navMeta ? new URL(navMeta).pathname : '/uk/web/en/tools/nemo/navigation/oneheader/_jcr_content.json';
    const resp = await fetch(`https://www.audi.co.uk${navPath}`);
    if (resp.ok) {
      navJson = await resp.json();
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch audi nav json (likely due to CORS). Falling back to local.', e);
  }

  if (!navJson) {
    const resp = await fetch(`${window.hlx.codeBasePath}/blocks/header/nav-fallback.json`);
    if (resp.ok) {
      navJson = await resp.json();
    }
  }

  if (navJson) {
    const nav = buildNav(navJson);

    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);

    block.replaceChildren(navWrapper);

    const navShadow = document.createElement('div');
    navShadow.className = 'nav-shadow';

    block.append(navShadow);
  }
}
