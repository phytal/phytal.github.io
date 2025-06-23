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
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }
}); 