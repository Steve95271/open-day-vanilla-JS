"use strict";

let topicNames = new Array();
let topicMap = new Map();
const select = document.getElementById("topic-select");
const topicContainer = document.querySelector(".topic-container");

function formatTime(time) {
  return new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderPrograms(programs) {
  return programs
    .map(
      (program) => `
        <div class="program">
            <section class="program-title-type">
                <div class="program-type" style="background: ${
                  program.programType.type_colour
                }">
                    ${program.programType.type}
                </div>
                <h3>${program.title}</h3>
                <p class="description">
                    ${program.description}
                </p>
            </section>
            
            
            <section>
                <div class="school">
                    <strong>School:</strong> ${program.school.name}
                </div>
                <div class="campus">
                    <strong>Campus:</strong> ${program.location.campus.title}
                </div>
                <div class="location">
                    <strong>Location: </strong>${program.room}, ${
        program.location.title
      },  ${program.location.address}, ${program.location.postcode}
                </div>
                <div class="date">
                    <strong>Date:</strong> ${formatDate(program.start_time)}
                </div>
                <div class="time">
                    <strong>Time:</strong> ${formatTime(
                      program.start_time
                    )} - ${formatTime(program.end_time)}
                </div>
            </section>
            
            <figure class="building-fig">
                <img src=${program.location.cover_image} alt="building image">
                <figcaption>${program.location.title}</figcaption>
            </figure> 
            
            <section>
                <span>${program.location.accessible === 1 ? "♿️" : ""}</span> 
                <span>${program.location.parking === 1 ? "🅿️" : ""}</span> 
                <span>${program.location.bike_parking === 1 ? "🚲" : ""}</span> 
            </section>
        </div>
    `
    )
    .join("");
}

/**
 * This can render one topic or a Map collection of topics
 * @param topics single topic or a Map collection of topics
 */
function renderTopic(topics) {
  let topicArray;

  if (topics instanceof Map) {
    topicArray = Array.from(topics.values());
  } else if (Array.isArray(topics)) {
    topicArray = topics;
  } else if (typeof topics === "object" && topics !== null) {
    topicArray = [topics];
  } else {
    console.warn("Invalid topics input:", topics);
    return;
  }

  const topicHtml = topicArray
    .map(
      (topic) => `
        <section class="topic">
            <div class="topic-header">
                <div>
                    <h2 class="topic-title">${topic.name}</h2>
                    <p>${topic.description}</p>
                </div>
            </div>
            
            <div class="programs-container">
                ${renderPrograms(topic.programs)}
            </div>
        </section>
    `
    )
    .join("");

  // clean old html and insert new html
  topicContainer.innerHTML = "";
  topicContainer.insertAdjacentHTML("beforeend", topicHtml);
}

function renderMainHeader(data) {
  const htmlElement = `
       <h1>
            ${data.description}
       </h1>
       <h2>
            🕰️ <i>${formatTime(data.start_time)}</i> - <i>${formatTime(
    data.end_time
  )}</i>
       </h2>
    `;
  document
    .querySelector(".main-header")
    .insertAdjacentHTML("beforeend", htmlElement);
}

function addTopicsNamesToSelector() {
  // using fragement store topic options
  const fragment = document.createDocumentFragment();

  topicNames.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    fragment.appendChild(option);
  });

  select.appendChild(fragment);
}

function addDropdownMenuEventListen() {
  select.addEventListener("change", (event) => {
    const selected = event.target.value;
    if (selected === "all") {
      renderTopic(topicMap);
    } else {
      const topic = topicMap.get(selected);
      renderTopic(topic);
    }
  });
}

async function loadData() {
  try {
    const response = await fetch("OpenDay.json");
    if (!response.ok) {
      //TODO leave for future when using HTTP request
      throw new Error("");
    }
    const data = await response.json();
    renderMainHeader(data);
    data.topics.forEach((element) => {
      // Store topic names into list for add to drop menu later
      topicNames.push(element.name);
      // Using Map collection for constant access time
      topicMap.set(element.name, element);
    });
  } catch (error) {
    //TODO leave for future when using HTTP request
    throw new Error(error);
  }
}

async function init() {
  try {
    await loadData();
    renderTopic(topicMap);
    addTopicsNamesToSelector();
    addDropdownMenuEventListen();
  } catch (error) {
    //TODO leave for future when using HTTP request
    console.error(error);
  }
}

init();
