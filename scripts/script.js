// KIN prototype interactions

// Utility: show only the requested screen
function showScreen(id) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => {
    if (screen.id === id) {
      screen.classList.add("is-active");
    } else {
      screen.classList.remove("is-active");
    }
  });

  // Sync active state on bottom nav
  const navButtons = document.querySelectorAll(".bottom-nav-item");
  navButtons.forEach((btn) => {
    const target = btn.getAttribute("data-screen-target");
    if (target === id) {
      btn.classList.add("is-active");
    } else {
      btn.classList.remove("is-active");
    }
  });
}

// Global state for capture format and prompts
const kinState = {
  captureFormat: "photo",
  promptCategory: "childhood",
  promptIndex: 0,
};

const PROMPTS = {
  childhood: [
    "What is one of your earliest happy memories?",
    "Who were the people you spent the most time with as a child?",
    "What did a perfect day look like when you were little?",
    "What was your favorite place to play?",
    "What is a childhood smell that you still remember?",
  ],
  traditions: [
    "What family tradition makes you feel most connected?",
    "Describe a holiday that felt especially meaningful.",
    "What weekly or daily rituals did your family have?",
    "What tradition would you like future generations to keep?",
    "Was there a tradition that changed over time?",
  ],
  funny: [
    "What is a time your family could not stop laughing?",
    "Tell the story of a harmless prank or mix‑up.",
    "What is the silliest thing you remember doing as a kid?",
    "Who in the family is most likely to make everyone laugh?",
    "Describe a photo that always makes you smile.",
  ],
  lessons: [
    "What is a lesson you learned the hard way?",
    "Who taught you something you still use every day?",
    "What advice would you give your younger self?",
    "What is a small habit that changed your life?",
    "What is a moment when you realized you had grown?",
  ],
  culture: [
    "What meal feels like home to you?",
    "What songs or sounds remind you of your culture?",
    "How did your family talk about your heritage?",
    "What language or phrases feel special to you?",
    "What is a place that represents your culture?",
  ],
  random: [
    "What is a small joy from this week?",
    "If you could replay one ordinary day, which would it be?",
    "What is an object in your home that holds a story?",
    "What is something you are grateful for right now?",
    "What tiny detail about today might you forget later?",
  ],
};

function updateCapturePlaceholder() {
  const placeholder = document.getElementById("capture-placeholder");
  const subtitle = document.getElementById("capture-subtitle");
  if (!placeholder || !subtitle) return;

  let content = "";
  let description = "";

  switch (kinState.captureFormat) {
    case "audio":
      content =
        "[ Audio recording placeholder ]\n\nImagine a simple record button and timer here.";
      description =
        "Simulated audio recording area. No microphone or real audio is used.";
      break;
    case "text":
      content =
        "[ Text input area ]\n\nImagine a rich text field for writing your story here.";
      description =
        "Simulated text area for writing. Anything you type here is not saved.";
      break;
    case "photo":
    default:
      content =
        "[ Photo / Video placeholder ]\n\nImagine a live camera preview or upload box here.";
      description =
        "Simulated photo or video capture area. No camera or real files are used.";
      break;
  }

  placeholder.textContent = content;
  subtitle.textContent = description;
}

function updatePromptViewer() {
  const textEl = document.getElementById("prompt-text");
  const labelEl = document.getElementById("prompt-category-label");
  if (!textEl || !labelEl) return;

  const prompts = PROMPTS[kinState.promptCategory] || PROMPTS.childhood;
  const safeIndex = ((kinState.promptIndex % prompts.length) + prompts.length) % prompts.length;
  kinState.promptIndex = safeIndex;

  textEl.textContent = prompts[safeIndex];

  const nameMap = {
    childhood: "Childhood",
    traditions: "Traditions",
    funny: "Funny Stories",
    lessons: "Life Lessons",
    culture: "Culture",
    random: "Random Fun",
  };

  const label = nameMap[kinState.promptCategory] || "Prompts";
  labelEl.textContent = "Category: " + label;
}

function handleNavigationClicks() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const button = target.closest("[data-screen-target]");
    if (!button) return;

    const screenId = button.getAttribute("data-screen-target");
    if (!screenId) return;

    // If we clicked a format card, update capture format
    const format = button.getAttribute("data-format");
    if (format) {
      kinState.captureFormat = format;
    }

    // If we clicked a prompt category card, set category and reset index
    const category = button.getAttribute("data-category");
    if (category) {
      kinState.promptCategory = category;
      kinState.promptIndex = 0;
    }

    // Show the screen
    showScreen(screenId);

    // Update context-specific UI after screen switches
    if (screenId === "share-memory-capture") {
      updateCapturePlaceholder();
    } else if (screenId === "prompts-viewer") {
      updatePromptViewer();
    }
  });
}

function handlePromptControls() {
  const nextBtn = document.getElementById("next-prompt");
  const prevBtn = document.getElementById("prev-prompt");
  if (!nextBtn || !prevBtn) return;

  nextBtn.addEventListener("click", () => {
    kinState.promptIndex += 1;
    updatePromptViewer();
  });

  prevBtn.addEventListener("click", () => {
    kinState.promptIndex -= 1;
    updatePromptViewer();
  });
}

function initKinApp() {
  // Show the home screen initially
  showScreen("home-screen");

  // Wire global navigation handlers
  handleNavigationClicks();

  // Wire prompt next/previous buttons
  handlePromptControls();

  // Initialize first prompt view (if user lands via navigation)
  updatePromptViewer();

  // Initialize capture placeholder (for when user first opens that screen)
  updateCapturePlaceholder();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initKinApp);
} else {
  initKinApp();
}


