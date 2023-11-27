document.addEventListener("DOMContentLoaded", function () {
  const contributionGraph = document.getElementById("contribution-graph");
  const apiUrl = "https://dpg.gg/test/calendar.json";
  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
      renderContributionGraph(contributionGraph, data);
  })
  .catch(error => console.error("Error fetching data:", error));
});
function renderContributionGraph(container, data) {
  const monthContainer = document.getElementById("monthContainer");
  const months = ["Январь", "Февраль", "Март", "Апр", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const colors = ["color-0", "color-1", "color-2", "color-3", "color-4"];
  const weeks = 51;
  const daysPerWeek = 7;
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - weeks * daysPerWeek + 1);
  let currentDate = new Date(startDate);
  let html = "";
  for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < daysPerWeek; day++) {
          const dateString = formatDate(currentDate);
          const contributions = data[dateString] || 0;
          const colorIndex = getColorIndex(contributions);
          html +=
          `<div class="cell ${colors[colorIndex]}">
              <div class="hover-info">
                  <span class="contributions">${contributions > 0 ? contributions + ' contributions' : "No contributions"}</span>
                  ${formatDateInfo(currentDate)}
              </div>
          </div>`;
          currentDate.setDate(currentDate.getDate() + 1);
      }
  }
  container.innerHTML = html;

// месяцы
  const currentMonthNumber = startDate.getMonth();
  for (let i = 0; i < months.length; i++) {
      const monthElement = document.createElement("div");
      monthElement.classList.add("m");
      const displayMonthIndex = (currentMonthNumber + i) % months.length;
      monthElement.textContent = months[displayMonthIndex];
      monthContainer.appendChild(monthElement);
  }
}
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function formatDateInfo(date) {
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  return new Intl.DateTimeFormat('ru-RU', options).format(date);
}
function getColorIndex(contributions) {
  if (contributions === 0) return 0;
  else if (contributions >= 1 && contributions <= 9) return 1;
  else if (contributions >= 10 && contributions <= 19) return 2;
  else if (contributions >= 20 && contributions <= 29) return 3;
  else return 4;
}