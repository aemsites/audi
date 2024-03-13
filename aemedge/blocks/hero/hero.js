export default function decorate(block) {
  if (block.classList.contains('variation1')) {
    /* Wrap whole block into link tag */
    const aTag = block.querySelector('p > a');
    const linkText = aTag.innerHTML;
    aTag.replaceWith(linkText);
    const divToA = block.querySelector('div div');
    const innerDiv = divToA.innerHTML;
    const newA = document.createElement('a');
    newA.href = aTag.href;
    newA.innerHTML = innerDiv;
    divToA.replaceWith(newA);
  }
}
