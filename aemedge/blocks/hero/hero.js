export default function decorate(block) {

  // manually setup button container and child buttons
  const buttonContainer = block.querySelector('div >div > p:nth-child(2)');
  if (buttonContainer) {
    buttonContainer.classList.add('button-container');
    buttonContainer.firstChild.classList.add('button');
    buttonContainer.firstChild.classList.add('primary');
    buttonContainer.lastChild.classList.add('button');
  }

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
