/**
 * Agricultural Advantage Simulator
 * Demonstrates how early agriculture accelerates civilization development
 */

class AgriculturalSimulator {
    constructor() {
        this.canvas = document.getElementById('simulatorCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = false;
        this.year = 0;
        this.maxYears = 5000;

        this.initControls();
        this.drawInitialState();
    }

    initControls() {
        // Sliders
        document.getElementById('cropSlider').addEventListener('input', (e) => {
            this.cropValue = parseInt(e.target.value);
            document.getElementById('cropValue').textContent = `${this.cropValue}%`;
        });

        document.getElementById('animalSlider').addEventListener('input', (e) => {
            this.animalValue = parseInt(e.target.value);
            document.getElementById('animalValue').textContent = `${this.animalValue}%`;
        });

        document.getElementById('geoSlider').addEventListener('input', (e) => {
            this.geoValue = parseInt(e.target.value);
            document.getElementById('geoValue').textContent = `${this.geoValue}%`;
        });

        // Buttons
        document.getElementById('startBtn').addEventListener('click', () => this.startSimulation());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());

        // Presets
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.applyPreset(e.target.dataset.preset));
        });

        // Initialize values
        this.cropValue = 50;
        this.animalValue = 50;
        this.geoValue = 50;
    }

    applyPreset(preset) {
        const presets = {
            eurasia: { crop: 90, animal: 85, geo: 80 },
            americas: { crop: 60, animal: 50, geo: 55 },
            africa: { crop: 40, animal: 45, geo: 50 }
        };

        if (presets[preset]) {
            const p = presets[preset];
            document.getElementById('cropSlider').value = p.crop;
            document.getElementById('animalSlider').value = p.animal;
            document.getElementById('geoSlider').value = p.geo;

            this.cropValue = p.crop;
            this.animalValue = p.animal;
            this.geoValue = p.geo;

            document.getElementById('cropValue').textContent = `${p.crop}%`;
            document.getElementById('animalValue').textContent = `${p.animal}%`;
            document.getElementById('geoValue').textContent = `${p.geo}%`;
        }
    }

    startSimulation() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.year = 0;
            this.population = 1000;
            this.technology = 0;
            this.specialization = 0;
            document.getElementById('startBtn').disabled = true;

            this.addTrace('🌱 Simulation started', 'success');
            this.addTrace(`Conditions: Crop=${this.cropValue}%, Animal=${this.animalValue}%, Geography=${this.geoValue}%`, 'info');

            this.animate();
        }
    }

    reset() {
        this.isRunning = false;
        this.year = 0;
        this.population = 0;
        this.technology = 0;
        this.specialization = 0;
        document.getElementById('startBtn').disabled = false;
        this.updateStats();
        this.drawInitialState();
        document.getElementById('traceLog').innerHTML = '<p class="trace-item trace-info">Simulation reset. Ready to start again.</p>';
    }

    animate() {
        if (!this.isRunning || this.year > this.maxYears) {
            this.isRunning = false;
            document.getElementById('startBtn').disabled = false;
            if (this.year > this.maxYears) {
                this.addTrace('✅ Simulation complete', 'success');
            }
            return;
        }

        // Advance year
        this.year += 50;

        // Calculate growth rates based on parameters
        const agriculturalBonus = (this.cropValue + this.animalValue) / 2;
        const geoBonus = this.geoValue;

        // Population growth (affected by agricultural success)
        const popGrowthRate = 0.001 + (agriculturalBonus / 100) * 0.003;
        this.population *= (1 + popGrowthRate);

        // Technology advancement (depends on population and agriculture)
        const techRate = Math.log(this.population) * 0.01 * (agriculturalBonus / 100);
        this.technology = Math.min(100, this.technology + techRate);

        // Specialization (high pop + tech enables specialization)
        const specRate = (Math.log(this.population) / 10) * (this.technology / 100) * (geoBonus / 100);
        this.specialization = Math.min(100, this.specialization + specRate);

        this.updateStats();
        this.drawSimulation();

        // Log milestones
        if (this.population > 10000 && !this.milestone1) {
            this.milestone1 = true;
            this.addTrace(`📈 Year ${this.year}: Population reached 10,000`, 'success');
        }

        if (this.technology > 30 && !this.milestone2) {
            this.milestone2 = true;
            this.addTrace(`⚙️  Year ${this.year}: Technology level 30%`, 'success');
        }

        if (this.specialization > 50 && !this.milestone3) {
            this.milestone3 = true;
            this.addTrace(`🏗️  Year ${this.year}: Complex society forming`, 'success');
        }

        requestAnimationFrame(() => this.animate());
    }

    updateStats() {
        const popPercent = Math.min(100, (Math.log(this.population) / Math.log(100000)) * 100);
        document.getElementById('populationFill').style.width = `${popPercent}%`;
        document.getElementById('populationValue').textContent = `${Math.round(popPercent)}%`;

        document.getElementById('techFill').style.width = `${this.technology}%`;
        document.getElementById('techValue').textContent = `${Math.round(this.technology)}%`;

        document.getElementById('specFill').style.width = `${this.specialization}%`;
        document.getElementById('specValue').textContent = `${Math.round(this.specialization)}%`;

        const years = this.year === 0 ? '-' : this.year;
        document.getElementById('timeValue').textContent = `${years} years`;
    }

    drawInitialState() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.fillStyle = '#f9f7f4';
        this.ctx.fillRect(0, 0, w, h);

        this.ctx.fillStyle = '#8B4513';
        this.ctx.font = 'bold 20px Georgia';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Adjust parameters and press Start', w / 2, h / 2 - 20);
        this.ctx.font = '14px Georgia';
        this.ctx.fillText('Watch civilization develop over time', w / 2, h / 2 + 20);
    }

    drawSimulation() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const centerX = w / 2;
        const centerY = h / 2;

        // Background
        this.ctx.fillStyle = '#f9f7f4';
        this.ctx.fillRect(0, 0, w, h);

        // Grid
        this.ctx.strokeStyle = '#eee';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo((w / 5) * i, 0);
            this.ctx.lineTo((w / 5) * i, h);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, (h / 5) * i);
            this.ctx.lineTo(w, (h / 5) * i);
            this.ctx.stroke();
        }

        // Population representation (circles)
        const popScale = Math.log(this.population) / 10;
        this.ctx.fillStyle = 'rgba(65, 105, 225, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 80, centerY - 80, Math.min(80, popScale), 0, Math.PI * 2);
        this.ctx.fill();

        // Technology representation (bars)
        const techWidth = (this.technology / 100) * 150;
        this.ctx.fillStyle = 'rgba(34, 139, 34, 0.3)';
        this.ctx.fillRect(centerX + 30, centerY - 80, techWidth, 40);

        // Specialization representation (star growth)
        this.drawSpecializationStar(centerX, centerY + 60, this.specialization);

        // Labels
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = 'bold 14px system-ui';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Year ${this.year}`, centerX, 30);

        this.ctx.font = '12px Georgia';
        this.ctx.fillText(`Population: ${Math.round(this.population).toLocaleString()}`, centerX - 80, centerY - 150);
        this.ctx.fillText(`Tech: ${Math.round(this.technology)}%`, centerX + 80, centerY - 150);
        this.ctx.fillText(`Specialization: ${Math.round(this.specialization)}%`, centerX, centerY + 140);
    }

    drawSpecializationStar(cx, cy, level) {
        const points = 5;
        const radius = 30 * (level / 100 + 0.3);

        this.ctx.fillStyle = `rgba(218, 165, 32, ${0.2 + (level / 100) * 0.3})`;
        this.ctx.beginPath();

        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points;
            const r = i % 2 === 0 ? radius : radius * 0.5;
            const x = cx + r * Math.sin(angle);
            const y = cy - r * Math.cos(angle);

            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }

        this.ctx.closePath();
        this.ctx.fill();
    }

    addTrace(message, type = 'info') {
        const log = document.getElementById('traceLog');
        const item = document.createElement('p');
        item.className = `trace-item trace-${type}`;
        item.textContent = message;
        log.appendChild(item);
        log.scrollTop = log.scrollHeight;

        // Keep only last 20 items
        while (log.children.length > 20) {
            log.removeChild(log.firstChild);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AgriculturalSimulator();
});
