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

const budgetText = document.getElementById("budget");
const cells = document.querySelectorAll(".cell");
const messageBox = document.querySelector(".message-box p");
const actionButton = document.querySelector(".action-button");
const nextStepButton = document.querySelector(".next-step");
const tools = document.querySelectorAll(".tool");
const items = document.querySelectorAll(".shop");

const hoe = document.getElementById("hoe");
const wateringCan = document.getElementById("watering_can");
const scythe = document.getElementById("scythe");
const hands = document.getElementById("hands");

const fertilizer = document.getElementById("fertilizer");
const fertilizerPrice = 20;
const tomato = document.getElementById("tomato");
const tomatoPrice = 30;
const eggplant = document.getElementById("eggplant");
const eggplantPrice = 90;
const pineapple = document.getElementById("pineapple");
const pineapplePrice = 250;

// steps = clear, fertilize, sow, irrigate, grow, irrigate1, grow1, irrigate2, grow2, irrigate3, harvest

let step = "clear";

let cellsToClear = 0;
let cellsFertilized = 0;
let cellsSown = 0;
let cellsIrrigated = 0;
let cellsHarvested = 0;

let selectedTool = null;
let selectedItem = null;
let seedPlanted = null;

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
nextStepButton.classList.add("disabled");

const clearCell = (cell) => {
  if (!cell.classList.contains("rock") && !cell.classList.contains("weed"))
    return;

  cell.classList.remove("rock", "weed");
  cell.textContent = "";
};

const onAllCellsIsCleared = () => {
  if (cellsToClear !== 0) return;

  step = "fertilize";
  selectedTool = null;
  hoe.classList.add("disabled");
  hoe.classList.remove("selected");
  hands.classList.remove("disabled");
  messageBox.textContent =
    "Parabéns! Você limpou todo o terreno, agora voce precisa preparar o solo para o plantio, compre o adubo na loja e clique sobre os terrenos para aplicar.";
};

const fertilizeCell = (cell) => {
  if (cell.classList.contains("fertilizer")) return;
  cell.classList.add("fertilizer");
};

const onAllCellsIsFertilized = () => {
  if (cellsFertilized < 144) return;

  messageBox.textContent =
    "Parabéns! Você fertilizou todo o terreno, agora você pode plantar novas culturas. selecione uma semente na loja e clique sobre os terrenos para plantar.";
  selectedItem = false;
  fertilizer.classList.remove("selected");
  fertilizer.classList.add("disabled");
  selectedTool = null;
  step = "sow";
  hands.classList.remove("selected");

  budget -= 20;
  budgetText.textContent = `$ ${budget}`;
};

const sownCell = (cell) => {
  if (!cell.classList.contains("fertilizer") || cell.classList.contains("sown"))
    return;

  cell.classList.remove("fertilizer");
  cell.classList.add("sown");
};

const onAllCellsIsSown = () => {
  const selectedSeed = document.getElementById(selectedItem);
  selectedSeed.classList.remove("selected");
  selectedSeed.classList.add("disabled");
  wateringCan.classList.remove("disabled");

  messageBox.textContent =
    "Parabéns! Você plantou todas as sementes com sucesso. Regue-as para garantir um bom crescimento e ao final pule para a próxima fase.";

  switch (selectedSeed.id) {
    case "tomato":
      budget -= 30;
      break;
    case "eggplant":
      budget -= 90;
      break;
    case "pineapple":
      budget -= 250;
      break;
  }

  seedPlanted = selectedSeed.id;
  budgetText.textContent = `$ ${budget}`;
  step = "irrigate";
};

const irrigateCell = (cell) => {
  if (cell.classList.contains("wet")) return;
  cell.classList.add("wet");
};

const onAllCellsIsIrrigated = () => {
  if (cellsIrrigated < 144) return;

  messageBox.textContent =
    "Parabéns! Você regou todas as plantas com sucesso. Clique no botão amarelo para avançar no tempo da colheita.";
  selectedTool = null;
  wateringCan.classList.remove("selected");
  wateringCan.classList.add("disabled");

  nextStepButton.classList.remove("disabled");
};

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    console.log({ step, selectedTool });

    if (step === "irrigate" && selectedTool === "watering_can") {
      if (cell.classList.contains("wet")) return;

      irrigateCell(cell);

      cellsIrrigated++;

      messageBox.textContent = `Bom trabalho! Continue regando as plantas. ${cellsIrrigated}/144 regadas.`;

      onAllCellsIsIrrigated();
    }

    if (
      ["tomato", "eggplant", "pineapple"].includes(selectedItem) &&
      step === "sow"
    ) {
      if (
        !cell.classList.contains("fertilizer") ||
        cell.classList.contains("sown")
      )
        return;

      cellsSown++;
      messageBox.textContent = `Bom trabalho! Continue plantando novas culturas. ${cellSown}/144 plantadas.`;
    }

    if (selectedItem === "fertilizer" && step === "fertilize") {
      if (cell.classList.contains("fertilizer")) return;

      fertilizeCell(cell);
      cellsFertilized++;

      messageBox.textContent = `Bom trabalho! Continue fertilizando o terreno. ${cellsFertilized}/144 fertilizados.`;

      onAllCellsIsFertilized();
    }

    if (selectedTool === "hoe" && step === "clear") {
      if (!cell.classList.contains("rock") && !cell.classList.contains("weed"))
        return;

      clearCell(cell);
      cellsToClear--;
      messageBox.textContent = `Bom trabalho! Continue limpando o terreno. ${cellsToClear}/144 limpos.`;

      onAllCellsIsCleared();
    }
  });
});

actionButton.addEventListener("click", () => {
  if (
    selectedTool === "watering_can" &&
    ["irrigate", "irrigate1"].includes(step)
  ) {
    cells.forEach((cell) => irrigateCell(cell));
    cellsIrrigated = 144;

    onAllCellsIsIrrigated();
  }

  if (
    ["tomato", "eggplant", "pineapple"].includes(selectedItem) &&
    step === "sow"
  ) {
    cells.forEach((cell) => sownCell(cell));
    cellsSown = 144;

    onAllCellsIsSown();
  }

  if (selectedItem === "fertilizer" && step === "fertilize") {
    cells.forEach((cell) => fertilizeCell(cell));

    cellsFertilized = 144;

    onAllCellsIsFertilized();
  }

  if (selectedTool === "hoe" && step === "clear") {
    cells.forEach((cell) => clearCell(cell));
    cellsToClear = 0;

    onAllCellsIsCleared();
  }
});

tools.forEach((tool) => {
  tool.addEventListener("click", () => {
    if (tool.id === selectedTool) {
      tools.forEach((i) => i.classList.remove("selected"));
      selectedTool = "null";
      return;
    } else tool.classList.add("selected");

    if (tool.id === "hands") {
      if (step == "fertilize")
        items.forEach(
          (item) =>
            item.id === "fertilizer" && item.classList.remove("disabled")
        );
      else
        items.forEach((item) => {
          if (item.id !== "fertilizer")
            switch (item.id) {
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

const blockSeedsOnSelect = (selected) => {
  hands.classList.add("disabled");

  items.forEach((i) => {
    if (i.id !== selected && !i.classList.contains("disabled")) {
      i.classList.add("disabled");
    }
  });
};

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
        blockSeedsOnSelect("tomato");
        break;
      case "eggplant":
        selectedItem = "eggplant";
        blockSeedsOnSelect("eggplant");
        break;
      case "pineapple":
        selectedItem = "pineapple";
        blockSeedsOnSelect("pineapple");
        break;
    }

    items.forEach((i) => {
      if (i.id !== selectedItem) {
        i.classList.add("disabled");
      }
    });
  });
});

nextStepButton.addEventListener("click", () => {
  switch (seedPlanted) {
    case "tomato":
      switch (step) {
        case "irrigate":
          step = "harvest";
          updateStepPlants("grow");
          messageBox.textContent =
            "Tomates crescendo, quase prontos para serem colhidos! Irrigue-os novamente e avance para a próxima fase.";
          cells.forEach((cell) => cell.classList.remove("wet"));
          wateringCan.classList.remove("selected");
          wateringCan.classList.remove("disabled");
          break;
        case "harvest":
          step = "harvest";
          updateStepPlants("harvest");
          messageBox.textContent =
            "Tomates prontos para serem colhidos! Clique na ferramenta de colheita.";
          cells.forEach((cell) => cell.classList.remove("wet"));
          scythe.classList.remove("disabled");
          break;
      }
      break;
    case "eggplant":
      switch (step) {
        case "irrigate":
          step = "grow";
          updateStepPlants("grow");
          break;
        case "grow":
          step = "irrigate1";
        case "irrigate1":
          step = "grow1";
          updateStepPlants("grow1");
          break;
        case "irrigate2":
          step = "harvest";
          break;
      }
      break;
    case "pineapple":
      switch (step) {
        case "irrigate":
          step = "grow";
          updateStepPlants("grow");
          textContent;
          break;
        case "grow":
          step = "irrigate1";
        case "irrigate1":
          step = "grow1";
          updateStepPlants("grow1");
          break;
        case "irrigate2":
          step = "grow2";
          updateStepPlants("grow2");
          break;
        case "grow2":
          step = "harvest";
          break;
      }
      break;
  }
});

const updateStepPlants = (step) => {
  cells.forEach((cell) => {
    cell.classList.remove("sown");
    switch (step) {
      case "grow":
        cell.textContent = "🌱";
        break;
      case "grow1":
        cell.textContent = "🌾";
        break;
      case "grow2":
        cell.textContent = "🌴";
        break;
    }
  });
};
