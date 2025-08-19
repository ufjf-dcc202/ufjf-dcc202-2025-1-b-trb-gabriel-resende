const farmGrid = document.querySelector(".farm-grid");
const cellTypes = ["empty", "rock", "weed"];

for (let i = 0; i < 144; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");

  const randomType = Math.random();

  if (randomType < 0.01) {
    cell.classList.add("rock");
    cell.textContent = "🪨";
  } else if (randomType < 0.02) {
    cell.classList.add("weed");
    cell.textContent = "🌿";
  }

  farmGrid.appendChild(cell);
}

const cells = document.querySelectorAll(".cell");
const messageBox = document.querySelector(".message-box p");
const tools = document.querySelectorAll(".tool");
const items = document.querySelectorAll(".shop");

let cellsToClear = 0;
let cellsFertilized = 0;
// let cellsPlanted = 0;

cells.forEach((cell) => {
  if (cell.classList.contains("rock") || cell.classList.contains("weed")) {
    cellsToClear++;
  }
});

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    if (cell.classList.contains("rock") || cell.classList.contains("weed")) {
      cell.classList.remove("rock", "weed");
      cell.textContent = "";
      cellsToClear--;
      if (cellsToClear === 0) {
        messageBox.textContent =
          "Parabéns! Você limpou todo o terreno, agora voce precisa preparar o solo para o plantio, compre o adubo na loja e clique sobre os terrenos para aplicar.";
      } else {
        messageBox.textContent = `Bom trabalho! Continue limpando o terreno. ${cellsToClear}/144 limpos.`;
      }
    }

    if (!cell.classList.contains("fertilizer")) {
      cell.classList.add("fertilizer");
      cellsFertilized++;

      if (cellsFertilized < 144) {
        messageBox.textContent = `Bom trabalho! Continue fertilizando o terreno. ${cellsFertilized}/144 fertilizados.`;
      } else {
        messageBox.textContent =
          "Parabéns! Você fertilizou todo o terreno, agora você pode plantar novas culturas. selecione uma semente na loja e clique sobre os terrenos para plantar.";
      }
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
