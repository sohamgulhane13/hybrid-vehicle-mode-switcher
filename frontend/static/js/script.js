// Frontend JavaScript
// script.js
class HybridVehicleModeSwitcher {
  constructor() {
    this.currentMode = "electric";
    this.isRunning = false;
    this.simulationInterval = null;
    this.modeHistory = [];
    this.efficiencyData = [];
    this.charts = {};

    this.initializeElements();
    this.setupEventListeners();
    this.initializeCharts();
    this.loadDatabaseRecords();
  }

  initializeElements() {
    this.batterySlider = document.getElementById("batteryLevel");
    this.speedSlider = document.getElementById("speed");
    this.accelerationSlider = document.getElementById("acceleration");
    this.batteryDisplay = document.getElementById("batteryDisplay");
    this.speedDisplay = document.getElementById("speedDisplay");
    this.accelerationDisplay = document.getElementById("accelerationDisplay");
    this.currentModeText = document.getElementById("currentMode");
    this.modeIcon = document.getElementById("modeIcon");
    this.currentModeTextValue = document.getElementById("currentModeText");
    this.powerSource = document.getElementById("powerSource");
    this.efficiency = document.getElementById("efficiency");
    this.co2Emission = document.getElementById("co2Emission");
    this.engineComponent = document.getElementById("engineComponent");
    this.batteryComponent = document.getElementById("batteryComponent");
    this.startButton = document.getElementById("startSimulation");
    this.stopButton = document.getElementById("stopSimulation");
    this.saveButton = document.getElementById("saveData");
    this.refreshButton = document.getElementById("refreshData");
    this.recordsBody = document.getElementById("recordsBody");
  }

  setupEventListeners() {
    this.batterySlider.addEventListener("input", () => {
      this.batteryDisplay.textContent = this.batterySlider.value + "%";
      this.updateMode();
    });

    this.speedSlider.addEventListener("input", () => {
      this.speedDisplay.textContent = this.speedSlider.value + " km/h";
      this.updateMode();
    });

    this.accelerationSlider.addEventListener("input", () => {
      this.accelerationDisplay.textContent =
        this.accelerationSlider.value + "%";
      this.updateMode();
    });

    this.startButton.addEventListener("click", () => this.startSimulation());
    this.stopButton.addEventListener("click", () => this.stopSimulation());
    this.saveButton.addEventListener("click", () => this.saveToDatabase());
    this.refreshButton.addEventListener("click", () =>
      this.loadDatabaseRecords()
    );
  }

  updateMode() {
    const battery = parseInt(this.batterySlider.value);
    const speed = parseInt(this.speedSlider.value);
    const acceleration = parseInt(this.accelerationSlider.value);

    let newMode;
    let efficiency;
    let co2;
    let powerSource;

    // Mode switching logic
    if (battery > 70 && speed < 60 && acceleration < 50) {
      newMode = "electric";
      efficiency = 95;
      co2 = 0;
      powerSource = "Battery";
    } else if (battery > 30 && speed < 100) {
      newMode = "hybrid";
      efficiency = 75;
      co2 = 45;
      powerSource = "Battery + Engine";
    } else {
      newMode = "engine";
      efficiency = 35;
      co2 = 120;
      powerSource = "Engine";
    }

    if (newMode !== this.currentMode) {
      this.currentMode = newMode;
      this.animateModeSwitch();
    }

    this.updateDisplay(newMode, efficiency, co2, powerSource);
    this.updateCharts();
  }

  animateModeSwitch() {
    // Animate car components
    this.engineComponent.classList.remove("active");
    this.batteryComponent.classList.remove("active");

    if (this.currentMode === "electric") {
      this.batteryComponent.classList.add("active");
    } else if (this.currentMode === "hybrid") {
      this.engineComponent.classList.add("active");
      this.batteryComponent.classList.add("active");
    } else if (this.currentMode === "engine") {
      this.engineComponent.classList.add("active");
    }

    // Update mode indicator
    this.modeIcon.className = `mode-icon ${this.currentMode}`;
    this.currentModeText.textContent = `${this.currentMode.toUpperCase()} MODE`;
  }

  updateDisplay(mode, efficiency, co2, powerSource) {
    this.currentModeTextValue.textContent =
      mode.charAt(0).toUpperCase() + mode.slice(1);
    this.powerSource.textContent = powerSource;
    this.efficiency.textContent = efficiency + "%";
    this.co2Emission.textContent = co2 + " g/km";
  }

  initializeCharts() {
    // Mode History Chart
    const modeCtx = document.getElementById("modeChart").getContext("2d");
    this.charts.mode = new Chart(modeCtx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Mode Switching",
            data: [],
            borderColor: "#667eea",
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 3,
          },
        },
      },
    });

    // Efficiency Chart
    const efficiencyCtx = document
      .getElementById("efficiencyChart")
      .getContext("2d");
    this.charts.efficiency = new Chart(efficiencyCtx, {
      type: "bar",
      data: {
        labels: ["Electric", "Hybrid", "Engine"],
        datasets: [
          {
            label: "Efficiency (%)",
            data: [95, 75, 35],
            backgroundColor: ["#2ecc71", "#f39c12", "#e74c3c"],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    });
  }

  updateCharts() {
    const now = new Date().toLocaleTimeString();

    // Update mode history
    this.charts.mode.data.labels.push(now);
    this.charts.mode.data.datasets[0].data.push(
      this.getModeValue(this.currentMode)
    );

    // Keep only last 10 data points
    if (this.charts.mode.data.labels.length > 10) {
      this.charts.mode.data.labels.shift();
      this.charts.mode.data.datasets[0].data.shift();
    }

    this.charts.mode.update();
  }

  getModeValue(mode) {
    switch (mode) {
      case "electric":
        return 1;
      case "hybrid":
        return 2;
      case "engine":
        return 3;
      default:
        return 0;
    }
  }

  startSimulation() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.startButton.disabled = true;
    this.stopButton.disabled = false;

    this.simulationInterval = setInterval(() => {
      // Simulate changing conditions
      const batteryChange = (Math.random() - 0.5) * 5;
      const speedChange = (Math.random() - 0.5) * 10;
      const accelerationChange = (Math.random() - 0.5) * 10;

      let newBattery = parseInt(this.batterySlider.value) + batteryChange;
      let newSpeed = parseInt(this.speedSlider.value) + speedChange;
      let newAcceleration =
        parseInt(this.accelerationSlider.value) + accelerationChange;

      // Keep values in valid ranges
      newBattery = Math.max(0, Math.min(100, newBattery));
      newSpeed = Math.max(0, Math.min(120, newSpeed));
      newAcceleration = Math.max(0, Math.min(100, newAcceleration));

      this.batterySlider.value = newBattery;
      this.speedSlider.value = newSpeed;
      this.accelerationSlider.value = newAcceleration;

      this.batteryDisplay.textContent = Math.round(newBattery) + "%";
      this.speedDisplay.textContent = Math.round(newSpeed) + " km/h";
      this.accelerationDisplay.textContent = Math.round(newAcceleration) + "%";

      this.updateMode();
    }, 2000);
  }

  stopSimulation() {
    this.isRunning = false;
    this.startButton.disabled = false;
    this.stopButton.disabled = true;

    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  saveToDatabase() {
    const data = {
      battery_level: parseInt(this.batterySlider.value),
      speed: parseInt(this.speedSlider.value),
      acceleration: parseInt(this.accelerationSlider.value),
      mode: this.currentMode,
      efficiency: parseInt(this.efficiency.textContent),
      timestamp: new Date().toISOString(),
    };

    fetch("/save_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("Data saved successfully!");
          this.loadDatabaseRecords();
        } else {
          alert("Error saving data: " + result.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error saving data to database");
      });
  }

  loadDatabaseRecords() {
    fetch("/get_records")
      .then((response) => response.json())
      .then((data) => {
        this.displayRecords(data.records);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  displayRecords(records) {
    this.recordsBody.innerHTML = "";

    records.forEach((record) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${record.id}</td>
                <td>${new Date(record.timestamp).toLocaleString()}</td>
                <td>${record.battery_level}%</td>
                <td>${record.speed} km/h</td>
                <td>${record.mode}</td>
                <td>${record.efficiency}%</td>
            `;
      this.recordsBody.appendChild(row);
    });
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new HybridVehicleModeSwitcher();
});
