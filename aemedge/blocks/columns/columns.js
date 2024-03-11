export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  /**
   * Transforms the position of an image on the Y-axis based on its position
   * relative to the viewport.
   *
   * @param {HTMLElement} img - The image element to be transformed.
   */
  function transformImage(img) {
    const viewportHeight = window.innerHeight;
    const elementPosition = img.getBoundingClientRect().top + img.clientHeight / 2;
    const shiftAmount = (elementPosition - viewportHeight / 2) * 0.2;

    img.style.transform = `translate3d(0px, ${-shiftAmount}px, 0px)`;
  }

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      // setup image columns
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }

        // setup hover variation
        if (block.classList.contains('hover')) {
          const anchor = document.createElement('a');

          const hoverWrapper = document.createElement('div');
          hoverWrapper.classList.add('hover-wrapper');

          const contentWrapper = document.createElement('div');
          contentWrapper.classList.add('content-wrapper');

          // append picture to first child div
          const pictureElement = col.querySelector('p > picture');
          hoverWrapper.appendChild(pictureElement.parentElement);

          // append content elements to second child div
          const contentElements = Array.from(col.children)
            .filter((p) => !p.querySelector('picture'));
          contentElements.forEach((element) => {
            contentWrapper.appendChild(element);
            const foundLink = element.querySelector('a');
            if (foundLink) {
              anchor.setAttribute('href', foundLink.href);
            }
          });

          anchor.appendChild(hoverWrapper);
          anchor.appendChild(contentWrapper);
          col.appendChild(anchor);
        }
      }
    });
  });

  // Setup parallax variation
  if (block.classList.contains('parallax') && block.classList.contains('columns-2-cols')) {
    const wrapper = block.firstElementChild;
    if (wrapper) {
      wrapper.classList.add('parallax-wrapper');
    }

    // Setup Text Content
    const textColumn = block.querySelector('.parallax-wrapper > div:not(.columns-img-col)');
    textColumn?.classList.add('parallax-text');

    // Setup image transform based on scroll direction.
    const parallaxImages = block.querySelectorAll('picture > img');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', () => transformImage(entry.target));
        } else {
          window.removeEventListener('scroll', () => transformImage(entry.target));
        }
      });
    });

    parallaxImages.forEach((parallaxImg) => {
      observer.observe(parallaxImg);
    });
  }
}
