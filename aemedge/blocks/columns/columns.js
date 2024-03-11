export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

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

        // setup parallax variation
        if (block.classList.contains('parallax')) {

        }
      }
    });
  });
}
