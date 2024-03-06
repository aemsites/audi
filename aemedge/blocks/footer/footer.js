import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * built and return the footer element
 * @param {object} footerJson the audi footer json object
 */
function buildFooter(footerJson) {
  const footerContainer = document.createElement('div');

  // Create ToTopLabel
  const toTopLabel = document.createElement('div');
  toTopLabel.textContent = footerJson.ToTopLabel;

  // Create Categories
  const categoriesUL = document.createElement('ul');
  footerJson.Categories.forEach((category) => {
    const li = document.createElement('li');
    const categoryLink = document.createElement('a');
    categoryLink.href = category.Link.Url;
    categoryLink.textContent = category.Link.Text;
    li.appendChild(categoryLink);

    if (category.SubLinks && category.SubLinks.length > 0) {
      const subUl = document.createElement('ul');
      category.SubLinks.forEach((subLink) => {
        const subLi = document.createElement('li');
        const subLinkAnchor = document.createElement('a');
        subLinkAnchor.href = subLink.Url;
        subLinkAnchor.textContent = subLink.Text;
        subLi.appendChild(subLinkAnchor);
        subUl.appendChild(subLi);
      });
      li.appendChild(subUl);
    }

    categoriesUL.appendChild(li);
  });

  // Create the div for social media icons
  const socialMediaDiv = document.createElement('div');
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

  // Create Copyright
  const copyrightDiv = document.createElement('div');
  copyrightDiv.textContent = footerJson.Copyright;

  // Create Legal Links
  const legalLinksDiv = document.createElement('div');
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

  footerContainer.append(toTopLabel, categoriesUL, socialMediaDiv, copyrightDiv, legalLinksDiv);
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
