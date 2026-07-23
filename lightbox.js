document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay hidden';

    const overlayFigure = document.createElement('figure');
    const overlayImg = document.createElement('img');
    const overlayCaption = document.createElement('figcaption');
    overlayFigure.appendChild(overlayImg);
    overlayFigure.appendChild(overlayCaption);
    overlay.appendChild(overlayFigure);
    document.body.appendChild(overlay);

    document.querySelectorAll('.blog-content img').forEach(image => {
        image.addEventListener('click', () => {
            overlayImg.src = image.src;
            overlayImg.alt = image.alt;

            const sourceCaption = image.closest('figure')?.querySelector('figcaption');
            overlayCaption.textContent = sourceCaption ? sourceCaption.textContent : '';
            overlayCaption.classList.toggle('hidden', !sourceCaption);

            overlay.classList.remove('hidden');
        });
    });

    overlay.addEventListener('click', () => {
        overlay.classList.add('hidden');
    });
});
