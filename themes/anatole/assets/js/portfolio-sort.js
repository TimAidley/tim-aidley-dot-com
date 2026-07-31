// Ported from the inline <script> in the Hugo site's layouts/portfolio/list.html.
// Behaviour is unchanged, including the default: on load it applies 'date-desc', which
// flattens the category groupings into a single list ordered newest-first. With JS off
// the page keeps the server-rendered grouping by category.
(function () {
  const sortSelect = document.getElementById('portfolio-sort');
  const container = document.getElementById('portfolio-container');
  if (!sortSelect || !container) return;

  // Store original order
  const originalHTML = container.innerHTML;

  sortSelect.addEventListener('change', function () {
    sortPortfolio(this.value);
  });

  function byDate(sortType) {
    return (a, b) => {
      const dateA = parseInt(a.date) || 0;
      const dateB = parseInt(b.date) || 0;
      return sortType.endsWith('-desc') ? dateB - dateA : dateA - dateB;
    };
  }

  function sortPortfolio(sortType) {
    const categories = Array.from(container.querySelectorAll('.post'));

    if (sortType === 'date-desc' || sortType === 'date-asc') {
      // Flatten all items across categories
      const allItems = [];
      categories.forEach((category) => {
        category.querySelectorAll('.portfolio-item').forEach((item) => {
          allItems.push({ element: item.cloneNode(true), date: item.dataset.date || '0' });
        });
      });

      allItems.sort(byDate(sortType));

      container.innerHTML = '';
      const wrapper = document.createElement('div');
      wrapper.className = 'post';
      allItems.forEach((item) => wrapper.appendChild(item.element));
      container.appendChild(wrapper);
      return;
    }

    if (sortType === 'category-date-desc' || sortType === 'category-date-asc') {
      // Restore the server-rendered grouping, then sort within each category.
      container.innerHTML = originalHTML;
      let freshCategories = Array.from(container.querySelectorAll('.post'));

      if (sortType === 'category-date-asc') {
        freshCategories.reverse();
        container.innerHTML = '';
        freshCategories.forEach((cat) => container.appendChild(cat));
      }

      freshCategories.forEach((category) => {
        const items = Array.from(category.querySelectorAll('.portfolio-item'));
        const sortedItems = items
          .map((item) => ({ element: item, date: item.dataset.date || '0' }))
          .sort(byDate(sortType));

        const titleElement = category.querySelector('.portfolio__title');
        items.forEach((item) => item.remove());
        // Build the sorted run in a fragment and insert it once. The Hugo original
        // re-inserted each item directly after the heading, which pushed the previous
        // one down and left the category listed in reverse of the order chosen.
        const fragment = document.createDocumentFragment();
        sortedItems.forEach((item) => fragment.appendChild(item.element));
        if (titleElement) {
          titleElement.parentNode.insertBefore(fragment, titleElement.nextSibling);
        } else {
          category.appendChild(fragment);
        }
      });
    }
  }

  // Apply default sort on load
  sortPortfolio('date-desc');
})();
