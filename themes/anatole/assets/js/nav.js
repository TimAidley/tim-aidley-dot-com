document.addEventListener('DOMContentLoaded', () => {
  // Mark the nav link for the current page. Hugo compared each menu URL against
  // .RelPermalink at render time; Timber's build does not expose the page's own URL to
  // templates, so the match is made in the browser instead.
  const here = window.location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('#navMenu a').forEach((link) => {
    const target = new URL(link.href).pathname.replace(/\/+$/, '') || '/';
    if (target === here) link.classList.add('nav__link--active');
  });

  const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  const nav = document.querySelector('nav');
  if (navbarBurgers.length < 1) return;
  navbarBurgers.forEach((navbarBurger) => {
    navbarBurger.addEventListener('click', () => {
      navbarBurger.classList.toggle('nav--active');
      nav.classList.toggle('nav--active');
    });
  });
});
