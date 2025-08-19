const farmGrid = document.querySelector(".farm-grid");
const cellTypes = ["empty", "rock", "weed"];

for (let i = 0; i < 144; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");

  const randomType = Math.random();

  if (randomType < 0.25) {
    cell.classList.add("rock");
    cell.textContent = "🪨";
  } else if (randomType < 0.5) {
    cell.classList.add("weed");
    cell.textContent = "🌿";
  }

  farmGrid.appendChild(cell);
}

const cells = document.querySelectorAll(".cell");
const messageBox = document.querySelector(".message-box p");
const tools = document.querySelectorAll(".tool");
const items = document.querySelectorAll(".shop");

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    if (cell.classList.contains("rock") || cell.classList.contains("weed")) {
      cell.classList.remove("rock", "weed");
      cell.textContent = "";
      messageBox.textContent =
        "Bom trabalho! Continue limpando o terreno. 50/144 limpos.";
    }
  });
});

tools.forEach((tool) => {
  tool.addEventListener("click", () => {
    tools.forEach((t) => t.classList.remove("selected"));
    tool.classList.add("selected");
  });
});

items.forEach((item) => {
  item.addEventListener("click", () => {
    items.forEach((i) => i.classList.remove("selected"));
    item.classList.add("selected");
  });
});
