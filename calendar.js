const currentDate = document.querySelector(".current-date");
const daysTag = document.querySelector(".days");
const prevNextIcon = document.querySelectorAll(".icons i");
const emojiPicker = document.getElementById("emoji-picker");

let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// // Load selected emojis from localStorage
// let selectedEmojis = JSON.parse(localStorage.getItem('selectedEmojis')) || {};

const renderCalendar = () => {
  let liTag = "";

  let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay(),
    lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(),
    lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();

  for (let i = firstDayOfMonth; i > 0; i--) {
    liTag += `<li class="inactive" id="${currYear}-${currMonth}-${
      lastDateOfLastMonth - i + 1
    }">${lastDateOfLastMonth - i + 1}</li>`;
  }

  // Adding current month's days
  for (let i = 1; i <= lastDateOfMonth; i++) {
    let isToday =
      i === date.getDate() &&
      currMonth === date.getMonth() &&
      currYear === date.getFullYear()
        ? "active"
        : "";

    let myEmojidDay = getMyData(`${currYear}-${currMonth + 1}-${i}`);

    liTag += `<li class='${isToday} daysCurrentMonth  ${
      myEmojidDay !== null ? "emojiD" : ""
    }' id="${currYear}-${currMonth + 1}-${i}">${i}<span class="emoji">${
      myEmojidDay !== null ? myEmojidDay.emoji : ""
    }</span></li>`;
  }

  // Adding next month's first days
  let nextDays = 42 - (firstDayOfMonth + lastDateOfMonth); // total cells are 42 (6 weeks * 7 days)
  for (let i = 1; i <= nextDays; i++) {
    liTag += `<li class="inactive">${i}</li>`;
  }

  currentDate.textContent = `${months[currMonth]} ${currYear}`;
  daysTag.innerHTML = liTag;

  function dayClickEvent(event) {
    let rect = event.target.getBoundingClientRect();
    console.log(event);
    emojiPicker.style.display = "flex";
    emojiPicker.style.top = `${rect.top + window.scrollY + 30}px`;
    emojiPicker.style.left = `${rect.left + window.scrollX}px`;
    selectedDayElement = event.target.closest(".daysCurrentMonth");

    let emojis = emojiPicker.querySelectorAll("span");

    emojis.forEach((emoji) => {
      emoji.addEventListener("click", () => {
        if (selectedDayElement) {
          let selectedDate = `${currYear}-${currMonth + 1}-${
            event.target.innerText
          }`;

          // // Store the selected emoji
          // if (selectedDayElement[selectedDate]) {
          //   localStorage.removeItem(selectedDayElement[selectedDate]);

          // }
          // selectedEmojis[selectedDate] = emoji.textContent;
          // localStorage.setItem('selectedEmojis', JSON.stringify(selectedEmojis));

          let existingEmoji = selectedDayElement.querySelector(".emoji");
          if (existingEmoji) {
            existingEmoji.textContent = emoji.textContent;
          }

          selectedDayElement.classList.add("emojiD");
        }

        emojiPicker.style.display = "none";
      });
    });

    let closeBtn = document.getElementById("close");

    closeBtn.addEventListener("click", () => {
      emojiPicker.style.display = "none";
    });
  }

  // clicking func for days
  const daysLi = document.querySelectorAll(".daysCurrentMonth");
  daysLi.forEach((day) => {
    day.addEventListener("click", (event) => dayClickEvent(event));
  });
};

renderCalendar();

prevNextIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

    if (currMonth < 0) {
      currYear--;
      currMonth = 11;
    } else if (currMonth > 11) {
      currYear++;
      currMonth = 0;
    }

    saveEmojis();
    renderCalendar();
  });
});

function getAllEmojisFromBoundDays() {
  var myEmojeedDays = document.querySelectorAll(".emojiD");
  let myEmojiData = [];
  for (let i = 0; i < myEmojeedDays.length; i++) {
    // {
    //   date: "2024-5-24"
    //   emoji: ":)"
    // }
    let myDataObject = {};
    myDataObject.emoji = myEmojeedDays[i].querySelector("span.emoji").innerText;
    myDataObject.date = myEmojeedDays[i].id;
    myEmojiData.push(myDataObject);
  }
  return myEmojiData;
}

function saveEmojis() {
  let myData = getAllEmojisFromBoundDays();
  if (myData.length > 0) {
    let myDataJson = localStorage.getItem("emojiData");
    let myDataArray = JSON.parse(myDataJson) || [];

    myData.forEach((newEntry) => {
      // Check if the entry already exists in the storage
      let existingEntry = myDataArray.find(
        (entry) => entry.date === newEntry.date
      );

      if (existingEntry) {
        // Update the existing entry
        existingEntry.emoji = newEntry.emoji;
      } else {
        // Add the new entry to the array
        myDataArray.push(newEntry);
      }
    });

    // Store the updated array in localStorage
    localStorage.setItem("emojiData", JSON.stringify(myDataArray));
  }
}
function checkIfExistsInStorage(emojidDayDataObject) {
  var myDataJson = localStorage.getItem("emojiData");
  var myDataObject = JSON.parse(myDataJson);

  return (
    myDataObject &&
    myDataObject.find((dataElement) => {
      return dataElement.date === emojidDayDataObject.date;
    })
  );
}

function getMyData(date) {
  var myDataJson = localStorage.getItem("emojiData");
  var myDataObject = JSON.parse(myDataJson);

  // Use the find method to return the first matching object
  var emojidDay =
    myDataObject && myDataObject.find((emojidDay) => emojidDay.date === date);
  return emojidDay || null; // Return the found object or null if not found
}

// Function to get distinct elements based on the 'date' property
function getDistinctElements(array) {
  array = array.filter((item) => item !== null);

  // Create a Set to store unique date values
  const uniqueDates = new Set();

  // Filter the array to include only elements whose date is not in the Set
  const distinctElements = array.filter((item) => {
    if (uniqueDates.has(item.date)) {
      return false; // Exclude duplicates
    } else {
      uniqueDates.add(item.date);
      return true; // Include unique elements
    }
  });

  return distinctElements;
}
