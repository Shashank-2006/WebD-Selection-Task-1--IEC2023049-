document.addEventListener('DOMContentLoaded', async () => {
  const apiUrl = "https://test-data-gules.vercel.app/data.json";
  let questions = [];
  let markedQuestions = JSON.parse(localStorage.getItem('markedQuestions')) || [];
  let bookmarkedQuestions = JSON.parse(localStorage.getItem('bookmarkedQuestions')) || [];
  let darkMode = localStorage.getItem('darkMode') === 'true';


  const body = document.body;
  const darkModeToggle = document.getElementById('darkModeToggle');
  darkModeToggle.addEventListener('click', () => {
      darkMode = !darkMode;
      body.classList.toggle('dark-mode', darkMode);
      localStorage.setItem('darkMode', darkMode);
  });
  body.classList.toggle('dark-mode', darkMode);

  
  try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      questions = data.data;
      renderAccordion(questions);
  } catch (error) {
      console.error("Error fetching data:", error);
  }


  const searchBar = document.getElementById('searchBar');
  searchBar.addEventListener('input', () => {
      const searchText = searchBar.value.toLowerCase();
      const filteredData = questions.filter(item => {
          return item.title.toLowerCase().includes(searchText) ||
              item.ques.some(q => q.title.toLowerCase().includes(searchText));
      });
      renderAccordion(filteredData);
  });

  
  function renderAccordion(data) {
      const accordion = document.getElementById('accordion');
      accordion.innerHTML = '';

      data.forEach(category => {
          const accordionItem = document.createElement('div');
          accordionItem.classList.add('accordion-item');

          const header = document.createElement('div');
          header.classList.add('accordion-header');
          header.textContent = category.title;
          header.addEventListener('click', () => {
              const content = header.nextElementSibling;
              content.style.display = content.style.display === 'block' ? 'none' : 'block';
          });

          const content = document.createElement('div');
          content.classList.add('accordion-content');
          category.ques.forEach(question => {
              const questionItem = document.createElement('div');
              questionItem.classList.add('question-item');
              
              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.checked = markedQuestions.includes(question.id);
              checkbox.addEventListener('change', () => {
                  handleCheckboxChange(question.id, checkbox.checked, questionItem);
              });

              const label = document.createElement('label');
              label.textContent = question.title;

              const platformLinks = document.createElement('div');
              platformLinks.classList.add('platform-links');
              platformLinks.innerHTML = getPlatformLinks(question);

              const bookmarkBtn = document.createElement('button');
              bookmarkBtn.textContent = 'Bookmark';
              bookmarkBtn.classList.add('bookmark-btn');
              bookmarkBtn.addEventListener('click', () => handleBookmark(question));

              questionItem.appendChild(checkbox);
              questionItem.appendChild(label);
              questionItem.appendChild(platformLinks);
              questionItem.appendChild(bookmarkBtn);

              if (checkbox.checked) {
                  questionItem.classList.add('checked');
              }

              content.appendChild(questionItem);
          });

          accordionItem.appendChild(header);
          accordionItem.appendChild(content);
          accordion.appendChild(accordionItem);
      });

      updateProgressBar();
  }

  // Handle Checkbox Change
  function handleCheckboxChange(id, checked, questionItem) {
      if (checked) {
          markedQuestions.push(id);
          questionItem.classList.add('checked');
      } else {
          markedQuestions = markedQuestions.filter(qId => qId !== id);
          questionItem.classList.remove('checked');
      }
      localStorage.setItem('markedQuestions', JSON.stringify(markedQuestions));
      updateProgressBar();
  }
  function handleBookmark(question) {
      if (!bookmarkedQuestions.find(q => q.id === question.id)) {
          bookmarkedQuestions.push(question);
          localStorage.setItem('bookmarkedQuestions', JSON.stringify(bookmarkedQuestions));
          renderBookmarkedQuestions();
      }
  }


  function renderBookmarkedQuestions() {
      const bookmarkContainer = document.getElementById('bookmarkedQuestions');
      bookmarkContainer.innerHTML = '';

      bookmarkedQuestions.forEach(question => {
          const questionItem = document.createElement('div');
          questionItem.textContent = question.title;
          bookmarkContainer.appendChild(questionItem);
      });
  }

  
  function getPlatformLinks(question) {
      const youtubeLink = question.yt_link ? `<a href="${question.yt_link}" target="_blank"><i class="fab fa-youtube"></i> YouTube</a>` : '';
      

      let p1Link = '';
      if (question.p1_link) {
          if (question.p1_link.includes('leetcode')) {
              p1Link = `<a href="${question.p1_link}" target="_blank"><i class="fas fa-code"></i> LeetCode</a>`;
          } else if (question.p1_link.includes('geeksforgeeks')) {
              p1Link = `<a href="${question.p1_link}" target="_blank"><i class="fas fa-code"></i> Geeks for Geeks</a>`;
          } else {
              p1Link = `<a href="${question.p1_link}" target="_blank"><i class="fas fa-code"></i> Coding Ninjas</a>`;
          }
      }

      let p2Link = '';
      if (question.p2_link) {
          if (question.p2_link.includes('leetcode')) {
              p2Link = `<a href="${question.p2_link}" target="_blank"><i class="fas fa-code"></i> LeetCode</a>`;
          } else if (question.p2_link.includes('geeksforgeeks')) {
              p2Link = `<a href="${question.p2_link}" target="_blank"><i class="fas fa-code"></i> Geeks for Geeks</a>`;
          } else {
              p2Link = `<a href="${question.p2_link}" target="_blank"><i class="fas fa-code"></i> Coding Ninjas</a>`;
          }
      }

      return youtubeLink + p1Link + p2Link;
  }


  function updateProgressBar() {
      const totalQuestions = questions.reduce((acc, category) => acc + category.ques.length, 0);
      const progress = (markedQuestions.length / totalQuestions) * 100;
      document.getElementById('progressBar').value = progress;
  }

  
  renderBookmarkedQuestions();
});
