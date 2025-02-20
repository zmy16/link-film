const filterBtns = document.querySelectorAll('.filter-btn');
const movieCards = document.querySelectorAll('.movie-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');

        movieCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});
