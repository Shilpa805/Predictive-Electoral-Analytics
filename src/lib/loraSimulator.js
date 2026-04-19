import { v4 as uuidv4 } from 'uuid';

export class LoRaSimulator {
  constructor(updateInterval = 2000, nodesCount = 3) {
    this.updateInterval = updateInterval;
    this.nodes = this.initializeNodes(nodesCount);
    this.timerId = null;
    this.onData = null; // Callback
  }

  initializeNodes(count) {
    const nodes = [];
    // Start somewhere around a central point, e.g., an urban area (New Delhi coords roughly)
    const baseLat = 28.6139;
    const baseLng = 77.2090;

    for (let i = 0; i < count; i++) {
        nodes.push({
            id: `NODE-${uuidv4().substring(0, 5).toUpperCase()}`,
            lat: baseLat + (Math.random() - 0.5) * 0.05,
            lng: baseLng + (Math.random() - 0.5) * 0.05,
            velocityLat: (Math.random() - 0.5) * 0.001,
            velocityLng: (Math.random() - 0.5) * 0.001,
        });
    }
    return nodes;
  }

  start(onDataCallback) {
    this.onData = onDataCallback;
    this.timerId = setInterval(() => this.tick(), this.updateInterval);
  }

  stop() {
    if (this.timerId) clearInterval(this.timerId);
  }

  tick() {
    this.nodes.forEach((node) => {
      // Small random walk added to velocity
      node.velocityLat += (Math.random() - 0.5) * 0.0002;
      node.velocityLng += (Math.random() - 0.5) * 0.0002;

      // Speed limit
      node.velocityLat = Math.max(-0.0015, Math.min(0.0015, node.velocityLat));
      node.velocityLng = Math.max(-0.0015, Math.min(0.0015, node.velocityLng));

      node.lat += node.velocityLat;
      node.lng += node.velocityLng;

      // Generate exact perfect packet
      const packet = {
        nodeId: node.id,
        timestamp: new Date().toISOString(),
        payload: {
          lat: node.lat,
          lng: node.lng,
          status: 'OK',
          battery: Math.floor(Math.random() * 20 + 80)
        }
      };

      let jsonString = JSON.stringify(packet);

      // Simulate packet fragmentation (30% chance for broken transmission)
      const isFragmented = Math.random() < 0.3;
      
      if (isFragmented) {
          // Chop off the end of the JSON string to make it unparsable
          const chopIndex = Math.floor(jsonString.length * (0.5 + Math.random() * 0.3));
          jsonString = jsonString.substring(0, chopIndex);
      }

      if (this.onData) {
          this.onData({ rawString: jsonString, isFragmented });
      }
    });
  }
}
