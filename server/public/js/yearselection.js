document.querySelector('.settings-button').addEventListener('click', function() {
  const yearSelection = document.querySelector('.year-selection');
  if (yearSelection.style.display === 'block') {
    yearSelection.style.display = 'none';
  } else {
    yearSelection.style.display = 'block';
  }
});