import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log('🤖 AI Studio Mock Server running on ws://localhost:8080');

// Mock data structures
const stagesTemplate = [
  { id: 'script', title: 'Script Generation', duration: 2000 },
  { id: 'audio', title: 'EchoMimic Audio', duration: 4000 },
  { id: 'video', title: 'Wan I2V Video Synthesis', duration: 6000 },
  { id: 'review', title: 'Final Assembly', duration: 2000 }
];

const mockLogs = [
  "Initializing LangGraph compilation...",
  "Loading LoRA adapters...",
  "Synthesizing prompt embeddings...",
  "Allocating 24GB VRAM slice...",
  "Inference pass complete.",
  "Audio waveform aligned.",
  "Writing to out.mp4..."
];

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket.');

  let pipelineInterval;
  let logInterval;
  let telemetryInterval;

  // Function to simulate a pipeline run
  const simulatePipeline = (channelId) => {
    console.log(`Starting pipeline simulation for channel: ${channelId}`);
    
    // Broadcast pipeline start
    ws.send(JSON.stringify({
      type: 'PIPELINE_START',
      payload: { channelId, stages: stagesTemplate }
    }));

    let currentStageIndex = 0;
    let currentProgress = 0;

    // Fast-paced simulated telemetry
    telemetryInterval = setInterval(() => {
      // Spike VRAM during video stage
      const isVideo = stagesTemplate[currentStageIndex]?.id === 'video';
      const baseVram = isVideo ? 85 : 40;
      
      ws.send(JSON.stringify({
        type: 'TELEMETRY_UPDATE',
        payload: {
          channelId,
          vramUsage: baseVram + Math.random() * 10
        }
      }));
    }, 500);

    // Random logs
    logInterval = setInterval(() => {
      const logText = mockLogs[Math.floor(Math.random() * mockLogs.length)];
      ws.send(JSON.stringify({
        type: 'LOG_MESSAGE',
        payload: {
          channelId,
          log: { type: 'INFO', text: logText }
        }
      }));
    }, 1500);

    // Stage progression
    const advanceStage = () => {
      if (currentStageIndex >= stagesTemplate.length) {
        clearInterval(pipelineInterval);
        clearInterval(logInterval);
        clearInterval(telemetryInterval);
        
        ws.send(JSON.stringify({
          type: 'PIPELINE_COMPLETE',
          payload: { channelId }
        }));
        return;
      }

      const stage = stagesTemplate[currentStageIndex];
      const stepTime = stage.duration / 20;

      pipelineInterval = setInterval(() => {
        currentProgress += 5;
        
        ws.send(JSON.stringify({
          type: 'STAGE_UPDATE',
          payload: {
            channelId,
            stageIndex: currentStageIndex,
            progress: Math.min(currentProgress, 100),
            status: currentProgress >= 100 ? 'complete' : 'active'
          }
        }));

        if (currentProgress >= 100) {
          clearInterval(pipelineInterval);
          currentStageIndex++;
          currentProgress = 0;
          advanceStage();
        }
      }, stepTime);
    };

    advanceStage();
  };

  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message);
      if (msg.type === 'START_RENDER') {
        simulatePipeline(msg.payload.channelId);
      }
    } catch (e) {
      console.error('Invalid message received', e);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected.');
    clearInterval(pipelineInterval);
    clearInterval(logInterval);
    clearInterval(telemetryInterval);
  });
});
