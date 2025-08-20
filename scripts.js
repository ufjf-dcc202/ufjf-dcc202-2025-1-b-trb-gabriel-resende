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

const hoe = document.getElementById("hoe");
const wateringCan = document.getElementById("watering_can");
const scythe = document.getElementById("scythe");
const hands = document.getElementById("hands");

const items = document.querySelectorAll(".shop");

const fertilizer = document.getElementById("fertilizer");
const fertilizerPrice = 20;
const tomato = document.getElementById("tomato");
const tomatoPrice = 30;
const eggplant = document.getElementById("eggplant");
const eggplantPrice = 90;
const pineapple = document.getElementById("pineapple");
const pineapplePrice = 250;

let cellsToClear = 0;
let cellsFertilized = 0;
let cellsSown = 0;

let selectedTool = null;
let selectedItem = null;

let budget = 100;

cells.forEach((cell) => {
  if (cell.classList.contains("rock") || cell.classList.contains("weed")) {
    cellsToClear++;
  }
});

tools.forEach((tool) => tool.id != "hoe" && tool.classList.add("disabled"));

const disabledItems = () =>
  items.forEach((item) => item.classList.add("disabled"));

disabledItems();

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    if (
      selectedTool === "hoe" &&
      (cell.classList.contains("rock") || cell.classList.contains("weed"))
    ) {
      cell.classList.remove("rock", "weed");
      cell.textContent = "";
      cellsToClear--;
      if (cellsToClear === 0) {
        messageBox.textContent =
          "Parabéns! Você limpou todo o terreno, agora voce precisa preparar o solo para o plantio, compre o adubo na loja e clique sobre os terrenos para aplicar.";
        selectedTool = null;
        hands.classList.remove("disabled");
        hoe.classList.remove("selected");
        hoe.classList.add("disabled");
      } else {
        messageBox.textContent = `Bom trabalho! Continue limpando o terreno. ${cellsToClear}/144 limpos.`;
      }
    }

    if (selectedItem === "fertilizer" && cellsToClear == 0) {
      cell.classList.add("fertilizer");
      cellsFertilized++;

      if (cellsFertilized === 2) {
        cells.forEach((c) => c.classList.add("fertilizer"));
        cellsFertilized = 144;
      }

      if (cellsFertilized < 144) {
        messageBox.textContent = `Bom trabalho! Continue fertilizando o terreno. ${cellsFertilized}/144 fertilizados.`;
      } else {
        budget -= fertilizerPrice;
        messageBox.textContent =
          "Parabéns! Você fertilizou todo o terreno, agora você pode plantar novas culturas. selecione uma semente na loja e clique sobre os terrenos para plantar.";
        selectedItem = false;
        fertilizer.classList.remove("selected");
        items.forEach((item) => {
          switch (item.id) {
            case "fertilizer":
              item.classList.add("disabled");
              break;
            case "tomato":
              if (budget >= tomatoPrice) item.classList.remove("disabled");
              break;
            case "eggplant":
              if (budget >= eggplantPrice) item.classList.remove("disabled");
              break;
            case "pineapple":
              if (budget >= pineapplePrice) item.classList.remove("disabled");
              break;
          }
        });
        fertilizer.classList.add("disabled");
      }
    } else if (cellsFertilized > 0) {
      if (cellsSown === 2) {
        cells.forEach((c) => {
          c.classList.remove("fertilizer");
          c.classList.add("sown");
        });
        cellsFertilized = 0;
        cellsSown = 144;
      }

      if (
        cell.classList.contains("fertilizer") &&
        !cell.classList.contains("sown")
      ) {
        cell.classList.remove("fertilizer");
        cell.classList.add("sown");
        cellsSown++;
        messageBox.textContent = `Bom trabalho! Continue plantando novas culturas. ${cellSown}/144 plantadas.`;
      }
    }
  });
});

tools.forEach((tool) => {
  tool.addEventListener("click", () => {
    if (tool.id === selectedTool) {
      tools.forEach((i) => i.classList.remove("selected"));
      selectedTool = "null";
      return;
    } else tool.classList.add("selected");

    if (tool.id === "hands") {
      if (cellsFertilized === 0)
        items.forEach(
          (item) =>
            item.id === "fertilizer" && item.classList.remove("disabled")
        );
      else
        items.forEach((item) => {
          if (item.id !== "fertilizer") {
            item.classList.remove("disabled");
          }
        });
    } else disabledItems();

    switch (tool.id) {
      case "hoe":
        selectedTool = "hoe";
        break;
      case "watering_can":
        selectedTool = "watering_can";
        break;
      case "scythe":
        selectedTool = "scythe";
        break;
      case "hands":
        selectedTool = "hands";
        break;
    }
  });
});

items.forEach((item) => {
  item.addEventListener("click", () => {
    if (selectedTool !== "hands") return;

    if (item.id === selectedItem) {
      items.forEach((i) => i.classList.remove("selected"));
      selectedItem = "null";
      return;
    } else item.classList.add("selected");

    switch (item.id) {
      case "fertilizer":
        selectedItem = "fertilizer";
        break;
      case "tomato":
        selectedItem = "tomato";
        break;
      case "eggplant":
        selectedItem = "eggplant";
        break;
      case "pineapple":
        selectedItem = "pineapple";
        break;
    }

    items.forEach((i) => {
      if (i.id !== selectedItem) {
        i.classList.add("disabled");
      }
    });
  });
});
