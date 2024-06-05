const currentDate = document.querySelector('.current-date');
const daysTag = document.querySelector('.days');
const prevNextIcon = document.querySelectorAll('.icons i');
const emojiPicker = document.getElementById('emoji-picker');

let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// // Load selected emojis from localStorage
// let selectedEmojis = JSON.parse(localStorage.getItem('selectedEmojis')) || {};

const renderCalendar = () => {
  let liTag = "";

  let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay(), 
  lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(), 
  lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate(); 

  for (let i = firstDayOfMonth; i > 0; i--) {
    liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
  }

  // Adding current month's days
  for (let i = 1; i <= lastDateOfMonth; i++) {
    let isToday = i === date.getDate() && currMonth === date.getMonth() && currYear === date.getFullYear() ? "active" : "";

    // let currentDateKey = `${currYear}-${currMonth + 1}-${i}`;
    // let storedEmoji = selectedEmojis[currentDateKey] || '';

    liTag += `<li class='${isToday} daysCurrentMonth'>${i}<span class="emoji"></span></li>`;
  }

    // Adding next month's first days
    let nextDays = 42 - (firstDayOfMonth + lastDateOfMonth); // total cells are 42 (6 weeks * 7 days)
    for (let i = 1; i <= nextDays; i++) {
      liTag += `<li class="inactive">${i}</li>`;
    }

  currentDate.textContent = `${months[currMonth]} ${currYear}`;
  daysTag.innerHTML = liTag;

  function dayClickEvent (event) {
      let rect = event.target.getBoundingClientRect();
      console.log(event);
      emojiPicker.style.display = 'flex';
      emojiPicker.style.top = `${rect.top + window.scrollY + 30}px`;
      emojiPicker.style.left = `${rect.left + window.scrollX}px`;
      selectedDayElement = event.target.closest('.daysCurrentMonth'); 

      let emojis = emojiPicker.querySelectorAll('span');

      emojis.forEach(emoji => {
        emoji.addEventListener('click', () => {
          if (selectedDayElement) {
            let selectedDate = `${currYear}-${currMonth + 1}-${event.target.innerText}`;

          // // Store the selected emoji
          // if (selectedDayElement[selectedDate]) {
          //   localStorage.removeItem(selectedDayElement[selectedDate]);

          // } 
          // selectedEmojis[selectedDate] = emoji.textContent;
          // localStorage.setItem('selectedEmojis', JSON.stringify(selectedEmojis));
        

            let existingEmoji = selectedDayElement.querySelector('.emoji');
            if (existingEmoji) {
              existingEmoji.textContent = emoji.textContent;
            } 

            selectedDayElement.classList.add("emojiD");
          }


          emojiPicker.style.display = 'none';

        });
      });

      let closeBtn = document.getElementById('close');

      closeBtn.addEventListener('click', () => {
        emojiPicker.style.display = 'none';
      })
  }

  // clicking func for days
  const daysLi = document.querySelectorAll('.daysCurrentMonth');
  daysLi.forEach(day => {
    day.addEventListener('click', (event) => dayClickEvent(event));
  });


}

renderCalendar();

prevNextIcon.forEach(icon => {
  icon.addEventListener('click', () => {
    currMonth = icon.id === 'prev' ? currMonth - 1 : currMonth + 1;

    if (currMonth < 0) {
      currYear--;
      currMonth = 11;
    } else if (currMonth > 11) {
      currYear++;
      currMonth = 0;
    }

    renderCalendar();
  });
});


