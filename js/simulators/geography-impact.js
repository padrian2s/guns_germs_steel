/**
 * Geography Impact Simulator
 * Shows how geography affects technology diffusion
 */

class GeographySimulator {
    constructor() {
        this.canvas = document.getElementById('simulatorCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = false;
        this.timeStep = 0;
        this.regions = [];

        this.initControls();
        this.drawInitialState();
    }

    initControls() {
        document.getElementById('axisSelect').addEventListener('change', (e) => {
            this.axis = e.target.value;
        });

        document.getElementById('barrierSlider').addEventListener('input', (e) => {
            this.barriers = parseInt(e.target.value);
            document.getElementById('barrierValue').textContent = `${this.barriers}%`;
        });

        document.getElementById('climateSlider').addEventListener('input', (e) => {
            this.climate = parseInt(e.target.value);
            document.getElementById('climateValue').textContent = `${this.climate}%`;
        });

        document.getElementById('startBtn').addEventListener('click', () => this.startSimulation());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());

        this.axis = 'ew';
        this.barriers = 50;
        this.climate = 50;
    }

    startSimulation() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timeStep = 0;
            this.setupRegions();

            document.getElementById('startBtn').disabled = true;
            this.addTrace('🚀 Starting technology diffusion simulation', 'success');

            if (this.axis === 'ew') {
                this.addTrace('✓ East-West axis: Similar latitudes favor diffusion', 'success');
            } else if (this.axis === 'ns') {
                this.addTrace('⚠️  North-South axis: Different climates slow diffusion', 'warning');
            } else {
                this.addTrace('⚠️  Fragmented geography: Isolated regions develop separately', 'warning');
            }

            this.animate();
        }
    }

    setupRegions() {
        this.regions = [];

        if (this.axis === 'ew') {
            // East-West: 5 regions in a row
            for (let i = 0; i < 5; i++) {
                this.regions.push({
                    x: 100 + i * 80,
                    y: 250,
                    tech: i === 0 ? 1 : 0,
                    connected: true,
                    color: '#87CEEB'
                });
            }
        } else if (this.axis === 'ns') {
            // North-South: vertical arrangement
            for (let i = 0; i < 5; i++) {
                this.regions.push({
                    x: 250,
                    y: 80 + i * 80,
                    tech: i === 0 ? 1 : 0,
                    connected: true,
                    color: '#87CEEB'
                });
            }
        } else {
            // Fragmented: scattered islands
            const positions = [
                { x: 150, y: 100 },
                { x: 350, y: 120 },
                { x: 200, y: 300 },
                { x: 380, y: 320 },
                { x: 280, y: 420 }
            ];
            positions.forEach((pos, i) => {
                this.regions.push({
                    ...pos,
                    tech: i === 0 ? 1 : 0,
                    connected: false,
                    color: '#87CEEB'
                });
            });
        }
    }

    animate() {
        if (!this.isRunning || this.timeStep > 300) {
            this.isRunning = false;
            document.getElementById('startBtn').disabled = false;
            if (this.timeStep > 300) {
                const allAdopted = this.regions.every(r => r.tech > 0.8);
                if (allAdopted) {
                    this.addTrace('✅ Technology diffused to all regions!', 'success');
                } else {
                    this.addTrace('⏸️  Simulation complete. Some regions isolated.', 'info');
                }
            }
            return;
        }

        this.timeStep++;
        this.updateDiffusion();
        this.updateStats();
        this.drawSimulation();

        requestAnimationFrame(() => this.animate());
    }

    updateDiffusion() {
        // Calculate diffusion based on geography
        const baseRate = 0.05 * (1 - this.barriers / 100);
        const climateImpact = 1 - (this.climate / 100) * 0.3;

        for (let i = 0; i < this.regions.length; i++) {
            const region = this.regions[i];

            // If tech level is high, try to spread
            if (region.tech > 0.3) {
                for (let j = 0; j < this.regions.length; j++) {
                    if (i !== j && this.regions[j].tech < 0.95) {
                        // Calculate distance
                        const dx = region.x - this.regions[j].x;
                        const dy = region.y - this.regions[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        // Closer regions have better chance
                        const distanceFactor = Math.max(0, 1 - dist / 400);

                        // Same climate helps
                        const latitudeDiff = Math.abs(
                            (this.axis === 'ns' ? region.y - this.regions[j].y : 0)
                        );
                        const climateFactor = 1 - (latitudeDiff / 400) * 0.5;

                        // Combine factors
                        let diffusionChance = baseRate * distanceFactor * climateFactor * climateImpact;

                        if (this.regions[j].tech > 0) {
                            diffusionChance *= 1.5; // Faster if already adopted
                        }

                        this.regions[j].tech += diffusionChance * region.tech;
                        this.regions[j].tech = Math.min(1, this.regions[j].tech);
                    }
                }
            }
        }
    }

    updateStats() {
        const avgTech = this.regions.reduce((sum, r) => sum + r.tech, 0) / this.regions.length;
        const variation = this.calculateVariation();
        const tradeNetwork = this.calculateTradeNetwork();

        document.getElementById('spreadFill').style.width = `${avgTech * 100}%`;
        document.getElementById('spreadValue').textContent = `${Math.round(avgTech * 100)}%`;

        document.getElementById('variationFill').style.width = `${variation * 100}%`;
        document.getElementById('variationValue').textContent = `${Math.round(variation * 100)}%`;

        document.getElementById('tradeFill').style.width = `${tradeNetwork * 100}%`;
        document.getElementById('tradeValue').textContent = `${Math.round(tradeNetwork * 100)}%`;

        const speed = (avgTech / (this.timeStep + 1) * 100).toFixed(2);
        document.getElementById('speedValue').textContent = `${speed} per timestep`;
    }

    calculateVariation() {
        const techLevels = this.regions.map(r => r.tech);
        const mean = techLevels.reduce((a, b) => a + b) / techLevels.length;
        const variance = techLevels.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / techLevels.length;
        return Math.sqrt(variance);
    }

    calculateTradeNetwork() {
        // How connected regions are
        let connections = 0;
        for (let i = 0; i < this.regions.length - 1; i++) {
            const dx = this.regions[i].x - this.regions[i + 1].x;
            const dy = this.regions[i].y - this.regions[i + 1].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) connections++;
        }
        return connections / (this.regions.length - 1);
    }

    drawInitialState() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.fillStyle = '#f9f7f4';
        this.ctx.fillRect(0, 0, w, h);

        this.ctx.fillStyle = '#8B4513';
        this.ctx.font = 'bold 20px Georgia';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Choose geography and press Start', w / 2, h / 2 - 20);
        this.ctx.font = '14px Georgia';
        this.ctx.fillText('Watch technology spread through regions', w / 2, h / 2 + 20);
    }

    drawSimulation() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.fillStyle = '#f9f7f4';
        this.ctx.fillRect(0, 0, w, h);

        // Draw connections
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.regions.length - 1; i++) {
            const r1 = this.regions[i];
            const r2 = this.regions[i + 1];
            this.ctx.beginPath();
            this.ctx.moveTo(r1.x, r1.y);
            this.ctx.lineTo(r2.x, r2.y);
            this.ctx.stroke();
        }

        // Draw regions with tech adoption
        this.regions.forEach((region, idx) => {
            const radius = 30;

            // Background
            this.ctx.fillStyle = `rgba(135, 206, 235, ${region.tech * 0.5 + 0.2})`;
            this.ctx.beginPath();
            this.ctx.arc(region.x, region.y, radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Tech level indicator
            this.ctx.fillStyle = `rgba(65, 105, 225, ${region.tech})`;
            this.ctx.beginPath();
            this.ctx.arc(region.x, region.y, radius * region.tech, 0, Math.PI * 2);
            this.ctx.fill();

            // Border
            this.ctx.strokeStyle = '#8B4513';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(region.x, region.y, radius, 0, Math.PI * 2);
            this.ctx.stroke();

            // Label
            this.ctx.fillStyle = '#2c3e50';
            this.ctx.font = 'bold 12px system-ui';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(`R${idx + 1}`, region.x, region.y - 45);
        });

        // Info
        this.ctx.font = '12px Georgia';
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Time: ${this.timeStep} years`, 10, 30);
    }

    reset() {
        this.isRunning = false;
        this.timeStep = 0;
        this.regions = [];
        document.getElementById('startBtn').disabled = false;
        this.updateStats();
        this.drawInitialState();
        document.getElementById('traceLog').innerHTML = '<p class="trace-item trace-info">Reset. Ready to simulate.</p>';
    }

    addTrace(message, type = 'info') {
        const log = document.getElementById('traceLog');
        const item = document.createElement('p');
        item.className = `trace-item trace-${type}`;
        item.textContent = message;
        log.appendChild(item);
        log.scrollTop = log.scrollHeight;

        while (log.children.length > 15) {
            log.removeChild(log.firstChild);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GeographySimulator();
});
