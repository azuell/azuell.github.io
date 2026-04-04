console.log("links.js running");
document.querySelectorAll('.link').forEach(link => {
    // Restore visited colour on page load
    if (sessionStorage.getItem('visited-' + link.href)) {
        link.classList.add('visited');
    }

    // Save when clicked
    link.addEventListener('click', () => {
        sessionStorage.setItem('visited-' + link.href, 'true');
        link.classList.add('visited');
    });
});