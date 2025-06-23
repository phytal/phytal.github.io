const parser = new DOMParser();

const fetchPage = async (url) => {
  const response = await fetch(url, { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.text();
};

const updatePage = (html) => {
  const doc = parser.parseFromString(html, 'text/html');
  const newMain = doc.querySelector('main');
  const newTitle = doc.querySelector('title');

  if (newMain) {
    document.querySelector('main').innerHTML = newMain.innerHTML;
  }
  if (newTitle) {
    document.title = newTitle.innerText;
  }
};

const handleNavClick = async (event) => {
  const link = event.currentTarget;
  const url = new URL(link.href);

  // Only intercept for internal, non-post links
  if (window.location.origin !== url.origin || url.pathname.includes('post.html')) {
    return;
  }
  
  event.preventDefault();

  try {
    const html = await fetchPage(link.href);
    window.history.pushState({}, '', link.href);
    updatePage(html);
  } catch (error) {
    console.error('Fetch error:', error);
    // Fallback to traditional navigation
    window.location.assign(link.href);
  }
};

const setupNavLinks = () => {
  document.querySelectorAll('header nav a').forEach(link => {
    const url = new URL(link.href, window.location.origin);
    if (window.location.origin === url.origin && !url.pathname.includes('post.html') && !link.href.startsWith('mailto:')) {
      link.addEventListener('click', handleNavClick);
    }
  });
};

window.addEventListener('popstate', async (event) => {
  try {
    const html = await fetchPage(window.location.href);
    updatePage(html);
  } catch (error) {
    console.error('Popstate fetch error:', error);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const headerPlaceholder = document.querySelector('header');
  if (headerPlaceholder) {
    fetch('_includes/header.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        headerPlaceholder.innerHTML = data;
        setupNavLinks(); // Set up nav links after header is loaded
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }
}); 