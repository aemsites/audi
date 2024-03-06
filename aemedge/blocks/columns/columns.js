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
          // remove p-parent of picture tag
          // const pictureParagraph = pic.parentElement;
          // pictureParagraph.parentNode.replaceChild(pic, pictureParagraph);

          // set image as background of col div

          col.style.backgroundImage = `url(${pic.querySelector('img')?.src})`;
          pic.parentElement.remove();
        }
      }
    });
  });
}
