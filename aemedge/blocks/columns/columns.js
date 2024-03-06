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
          const hoverWrapper = document.createElement('div');
          hoverWrapper.classList.add('hover-wrapper');

          const contentWrapper = document.createElement('div');
          contentWrapper.classList.add('content-wrapper');

          // append picture to first child div
          const pictureElement = col.querySelector('p > picture');
          hoverWrapper.appendChild(pictureElement.parentElement);

          // append content elements to second child div
          const contentElements = Array.from(col.querySelectorAll('p'))
            .filter((p) => !p.querySelector('picture'));
          contentElements.forEach((element) => {
            contentWrapper.appendChild(element);
          });

          col.appendChild(hoverWrapper);
          col.appendChild(contentWrapper);
        }
      }
    });
  });
}
