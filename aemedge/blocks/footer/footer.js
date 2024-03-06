import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * built and return the footer element
 * @param {object} footerJson the audi footer json object
 */
function buildFooter(footerJson) {
  const footerContainer = document.createElement('div');
  footerContainer.classList.add('footer');

  // Create ToTopLabel
  const toTopLabel = document.createElement('div');
  toTopLabel.classList.add('back-to-top');
  toTopLabel.textContent = footerJson.ToTopLabel;

  // Create Categories
  const categoriesDiv = document.createElement('div');
  categoriesDiv.classList.add('categories');
  const categoriesUL = document.createElement('ul');
  footerJson.Categories.forEach((category) => {
    const li = document.createElement('li');
    const categoryMenuDiv = document.createElement('div');
    categoryMenuDiv.classList.add('category-menu');
    const categoryLink = document.createElement('a');
    categoryLink.href = category.Link.Url;
    categoryLink.textContent = category.Link.Text;
    categoryMenuDiv.append(categoryLink);
    li.appendChild(categoryMenuDiv);

    if (category.SubLinks && category.SubLinks.length > 0) {
      const categoryMenuLinks = document.createElement('div');
      categoryMenuLinks.classList.add('category-menu-links');
      const subUl = document.createElement('ul');
      category.SubLinks.forEach((subLink) => {
        const subLi = document.createElement('li');
        const subLinkAnchor = document.createElement('a');
        subLinkAnchor.href = subLink.Url;
        subLinkAnchor.textContent = subLink.Text;
        subLi.appendChild(subLinkAnchor);
        subUl.appendChild(subLi);
      });
      categoryMenuLinks.appendChild(subUl);
      li.appendChild(categoryMenuLinks);
    }
    categoriesUL.appendChild(li);
  });
  categoriesDiv.appendChild(categoriesUL);

  // Create the div for social media icons
  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('social-media');
  const socialMediaList = document.createElement('ul');
  footerJson.SocialMedia.forEach((media) => {
    const listItem = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = media.Link.Url;
    anchor.textContent = media.Link.Text;
    listItem.appendChild(anchor);
    socialMediaList.appendChild(listItem);
  });
  socialMediaDiv.appendChild(socialMediaList);

  // Create Copyright & Legal Links

  const copyrightDiv = document.createElement('div');
  copyrightDiv.classList.add('copyright-wrapper');
  const copyright = document.createElement('div');
  copyright.classList.add('copyright');
  copyright.textContent = footerJson.Copyright;

  // Create Legal Links
  const legalLinksDiv = document.createElement('div');
  legalLinksDiv.classList.add('legal-links');
  const legalLinksList = document.createElement('ul');
  footerJson.LegalLinks.forEach((legalLinks) => {
    const listItem = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = legalLinks.Url;
    anchor.textContent = legalLinks.Text;
    listItem.appendChild(anchor);
    legalLinksList.appendChild(listItem);
  });
  legalLinksDiv.appendChild(legalLinksList);
  copyrightDiv.append(copyright, legalLinksDiv);

  footerContainer.append(toTopLabel, categoriesDiv, socialMediaDiv, copyrightDiv);
  return footerContainer;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');

  let footerJson;
  try {
    const footerPath = footerMeta ? new URL(footerMeta).pathname : '/uk/web/en/tools/nemo/navigation/onefooter/_jcr_content.json';
    const resp = await fetch(`https://www.audi.co.uk${footerPath}`);
    if (resp.ok) {
      footerJson = await resp.json();
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch audi foooter json (likely due to CORS). Falling back to local.', e);
  }

  if (!footerJson) {
    const resp = await fetch(`${window.hlx.codeBasePath}/blocks/header/footer-fallback.json`);
    if (resp.ok) {
      footerJson = await resp.json();
    }
  }

  if (footerJson) {
    const footer = buildFooter(footerJson);
    const footerWrapper = document.createElement('footer');
    footerWrapper.className = 'footer-wrapper';
    footerWrapper.append(footer);
    block.replaceChildren(footerWrapper);
  }

  // load footer fragment
  const footerPath = footerMeta.footer || '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
}
