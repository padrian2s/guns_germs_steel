/**
 * Disease Transmission Simulator
 * Shows how domestication + population density enable epidemics
 */

class DiseaseSimulator {
    constructor() {
        this.canvas = document.getElementById('simulatorCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = false;
        this.timeStep = 0;

        // Population grid
        this.gridSize = 10;
        this.individuals = [];
        this.initGrid();
        this.initControls();
        this.drawInitialState();
    }

    initGrid() {
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            this.individuals.push({
                status: 'healthy', // healthy, infected, immune, dead
                timeInfected: 0
            });
        }
    }

    initControls() {
        document.getElementById('densitySlider').addEventListener('input', (e) => {
            this.density = parseInt(e.target.value);
            document.getElementById('densityValue').textContent = `${this.density}%`;
        });

        document.getElementById('domesticSlider').addEventListener('input', (e) => {
            this.domestic = parseInt(e.target.value);
            document.getElementById('domesticValue').textContent = `${this.domestic}%`;
        });

        document.getElementById('virulenceSlider').addEventListener('input', (e) => {
            this.virulence = parseInt(e.target.value);
            document.getElementById('virulenceValue').textContent = `${this.virulence}%`;
        });

        document.getElementById('startBtn').addEventListener('click', () => this.startSimulation());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());

        this.density = 50;
        this.domestic = 50;
        this.virulence = 60;
        this.totalInfected = 0;
    }

    startSimulation() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timeStep = 0;
            this.totalInfected = 0;

            // Infect first individual
            this.individuals[0].status = 'infected';
            this.totalInfected = 1;

            document.getElementById('startBtn').disabled = true;
            this.addTrace('🦠 Disease outbreak started in animal population', 'success');
            this.addTrace(`Conditions: Density=${this.density}%, Domestication=${this.domestic}%, Virulence=${this.virulence}%`, 'info');

            if (this.domestic > 70) {
                this.addTrace('⚠️  High domestication: Animal-to-human spillover risk!', 'warning');
            }

            this.animate();
        }
    }

    reset() {
        this.isRunning = false;
        this.timeStep = 0;
        this.totalInfected = 0;
        this.initGrid();
        document.getElementById('startBtn').disabled = false;
        this.updateStats();
        this.drawInitialState();
        document.getElementById('traceLog').innerHTML = '<p class="trace-item trace-info">Simulation reset.</p>';
    }

    animate() {
        if (!this.isRunning || this.timeStep > 500) {
            this.isRunning = false;
            document.getElementById('startBtn').disabled = false;
            if (this.timeStep > 500) {
                const surviving = this.individuals.filter(p => p.status !== 'dead').length;
                this.addTrace(`✅ Simulation complete. ${surviving} survivors remaining.`, 'success');
            }
            return;
        }

        this.timeStep++;
        this.updateDiseaseState();
        this.updateStats();
        this.drawSimulation();

        // Log major events
        const currentInfected = this.individuals.filter(p => p.status === 'infected').length;
        const currentImmune = this.individuals.filter(p => p.status === 'immune').length;
        const currentDead = this.individuals.filter(p => p.status === 'dead').length;

        if (currentInfected === 0 && currentImmune > 10 && !this.milestoneEnd) {
            this.milestoneEnd = true;
            this.addTrace(`🏥 Epidemic ended at step ${this.timeStep}. Population developed immunity.`, 'success');
        }

        if (currentDead > (this.gridSize * this.gridSize) * 0.1 && !this.milestoneDeath) {
            this.milestoneDeath = true;
            this.addTrace(`⚠️  High mortality: 10% of population dead`, 'warning');
        }

        requestAnimationFrame(() => this.animate());
    }

    updateDiseaseState() {
        const transmissionRate = (this.density / 100) * (this.domestic / 100) * 0.1;
        const mortalityRate = (this.virulence / 100) * 0.05;
        const recoveryRate = 0.05;

        this.individuals.forEach((person, idx) => {
            if (person.status === 'infected') {
                person.timeInfected++;

                // Check mortality
                if (Math.random() < mortalityRate) {
                    person.status = 'dead';
                    return;
                }

                // Check recovery
                if (Math.random() < recoveryRate) {
                    person.status = 'immune';
                    return;
                }

                // Try to infect neighbors
                const neighbors = this.getNeighbors(idx);
                neighbors.forEach(nIdx => {
                    if (this.individuals[nIdx].status === 'healthy') {
                        if (Math.random() < transmissionRate) {
                            this.individuals[nIdx].status = 'infected';
                            this.totalInfected++;
                        }
                    }
                });
            }
        });
    }

    getNeighbors(idx) {
        const neighbors = [];
        const row = Math.floor(idx / this.gridSize);
        const col = idx % this.gridSize;

        for (let r = Math.max(0, row - 1); r <= Math.min(this.gridSize - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(this.gridSize - 1, col + 1); c++) {
                if (r !== row || c !== col) {
                    neighbors.push(r * this.gridSize + c);
                }
            }
        }

        return neighbors;
    }

    updateStats() {
        const infected = this.individuals.filter(p => p.status === 'infected').length;
        const immune = this.individuals.filter(p => p.status === 'immune').length;
        const dead = this.individuals.filter(p => p.status === 'dead').length;
        const healthy = this.individuals.filter(p => p.status === 'healthy').length;

        const total = this.gridSize * this.gridSize;
        const infectionPct = (infected / total) * 100;
        const mortalityPct = (dead / total) * 100;
        const immunityPct = (immune / total) * 100;

        document.getElementById('infectionFill').style.width = `${infectionPct}%`;
        document.getElementById('infectionValue').textContent = `${infectionPct.toFixed(1)}%`;

        document.getElementById('mortalityFill').style.width = `${mortalityPct}%`;
        document.getElementById('mortalityValue').textContent = `${mortalityPct.toFixed(1)}%`;

        document.getElementById('immunityFill').style.width = `${immunityPct}%`;
        document.getElementById('immunityValue').textContent = `${immunityPct.toFixed(1)}%`;

        document.getElementById('totalInfected').textContent = `${this.totalInfected} / ${total}`;
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
        this.ctx.fillText('Watch disease spread through the population', w / 2, h / 2 + 20);
    }

    drawSimulation() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cellSize = w / this.gridSize;

        this.ctx.fillStyle = '#f9f7f4';
        this.ctx.fillRect(0, 0, w, h);

        // Draw individuals
        for (let i = 0; i < this.individuals.length; i++) {
            const row = Math.floor(i / this.gridSize);
            const col = i % this.gridSize;
            const x = col * cellSize;
            const y = row * cellSize;

            const person = this.individuals[i];
            let color;

            switch (person.status) {
                case 'healthy':
                    color = '#87CEEB';
                    break;
                case 'infected':
                    color = '#DC143C';
                    break;
                case 'immune':
                    color = '#228B22';
                    break;
                case 'dead':
                    color = '#999';
                    break;
            }

            this.ctx.fillStyle = color;
            this.ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        }

        // Draw borders
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.gridSize; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * cellSize, 0);
            this.ctx.lineTo(i * cellSize, h);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, i * cellSize);
            this.ctx.lineTo(w, i * cellSize);
            this.ctx.stroke();
        }

        // Legend
        this.ctx.font = '12px Georgia';
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Step: ' + this.timeStep, 10, h + 20);
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(150, h + 5, 12, 12);
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillText('Healthy', 165, h + 14);

        this.ctx.fillStyle = '#DC143C';
        this.ctx.fillRect(280, h + 5, 12, 12);
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillText('Infected', 295, h + 14);

        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(390, h + 5, 12, 12);
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillText('Immune', 405, h + 14);
    }

    addTrace(message, type = 'info') {
        const log = document.getElementById('traceLog');
        const item = document.createElement('p');
        item.className = `trace-item trace-${type}`;
        item.textContent = message;
        log.appendChild(item);
        log.scrollTop = log.scrollHeight;

        while (log.children.length > 20) {
            log.removeChild(log.firstChild);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DiseaseSimulator();
});
