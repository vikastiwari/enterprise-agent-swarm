export const pipelineConfigs = {
  stem: {
    stages: [
      { id: 'stage1', title: 'Agentic Scripting (Gemini 2.5 Flash)', duration: 3000 },
      { id: 'stage2', title: 'Programmatic Animation (Manim)', duration: 6000 },
      { id: 'stage3', title: 'Voice Synthesis (GCP Journey TTS)', duration: 4000 },
      { id: 'stage4', title: 'Vector Merge Compilation (FFmpeg)', duration: 3000 }
    ],
    logs: [
      { time: 500, type: 'INFO', text: 'Initializing Bedrock AgentCore for STEM pipeline...' },
      { time: 1000, type: 'INFO', text: 'ResearcherAgent: Extracting linear algebra definitions.' },
      { time: 2000, type: 'INFO', text: 'Gemini 2.5 Flash: LaTeX script generation complete.' },
      { time: 3500, type: 'INFO', text: 'Manim Engine: Compiling Vectorized SVGs (VGroup)' },
      { time: 5000, type: 'WARN', text: 'Manim Engine: Bounding box overlap detected. Adjusting arrange(DOWN, buff=0.5)' },
      { time: 7000, type: 'INFO', text: 'Manim Engine: 1080p SVG render complete.' },
      { time: 9500, type: 'INFO', text: 'GCP TTS: Synthesizing "Journey" voice chunks...' },
      { time: 12000, type: 'INFO', text: 'GCP TTS: 34 audio chunks generated and normalized.' },
      { time: 14000, type: 'INFO', text: 'FFmpeg: Merging H.264 vector video with audio...' },
      { time: 15500, type: 'INFO', text: 'Pipeline Complete. Output saved to /outputs/stem/' }
    ]
  },
  crime: {
    stages: [
      { id: 'stage1', title: 'Suspense Storyboarding (Gemini Pro)', duration: 4000 },
      { id: 'stage2', title: 'Atmospheric B-Roll (Wan 2.5 I2V)', duration: 8000 },
      { id: 'stage3', title: '3D Detective Avatar (Audio2Face+Unity)', duration: 6000 },
      { id: 'stage4', title: 'Audio Engineering (EBU R128)', duration: 2000 }
    ],
    logs: [
      { time: 500, type: 'INFO', text: 'Initializing LangGraph Supervisor for True Crime...' },
      { time: 2000, type: 'INFO', text: 'Gemini Pro: Generating 3-act suspense narrative.' },
      { time: 4500, type: 'INFO', text: 'Wan 2.5 I2V: Queueing 15 dim-lit atmospheric prompts.' },
      { time: 6000, type: 'WARN', text: 'Wan 2.5 I2V: L4 GPU VRAM near threshold. Routing to Q8_0 quant.' },
      { time: 10000, type: 'INFO', text: 'Wan 2.5 I2V: 15 B-roll clips rendered successfully.' },
      { time: 13000, type: 'INFO', text: 'Unity Headless: Booting Xvfb virtual framebuffer.' },
      { time: 15000, type: 'INFO', text: 'Audio2Face: Syncing detective blendshapes to audio.' },
      { time: 18000, type: 'INFO', text: 'EBU R128: Loudnorm applied. Pipeline Complete.' }
    ]
  },
  finance: {
    stages: [
      { id: 'stage1', title: 'Live Web Scraping (LangGraph)', duration: 5000 },
      { id: 'stage2', title: 'Market Analysis (Gemini 3.5 Flash)', duration: 3000 },
      { id: 'stage3', title: '2D Anchor Generation (EchoMimic V3)', duration: 7000 },
      { id: 'stage4', title: 'Dynamic Overlays (React/FFmpeg)', duration: 3000 }
    ],
    logs: [
      { time: 500, type: 'INFO', text: 'Booting Financial Pipeline...' },
      { time: 2000, type: 'INFO', text: 'Scraper Node: Fetching real-time Crypto tick data.' },
      { time: 4000, type: 'INFO', text: 'Scraper Node: Data sanitized.' },
      { time: 6000, type: 'INFO', text: 'Gemini 3.5 Flash: Synthesizing market brief script.' },
      { time: 9000, type: 'INFO', text: 'EchoMimic V3: Loading FP16 weights on L4 GPU.' },
      { time: 12000, type: 'INFO', text: 'EchoMimic V3: Soup-of-Tasks animation rendering...' },
      { time: 14000, type: 'INFO', text: 'EchoMimic V3: Anchor generated at 30 FPS.' },
      { time: 16000, type: 'INFO', text: 'Compositor: Applying React chart overlays via Canvas.' },
      { time: 17500, type: 'INFO', text: 'Pipeline Complete.' }
    ]
  },
  stoic: {
    stages: [
      { id: 'stage1', title: 'Ancient Text Retrieval (RAG)', duration: 3000 },
      { id: 'stage2', title: 'Cinematic Backgrounds (Wan 2.2)', duration: 7000 },
      { id: 'stage3', title: 'Resonant TTS (GCP Studio)', duration: 3000 },
      { id: 'stage4', title: 'Subtitle Syncing (Whisper)', duration: 4000 }
    ],
    logs: [
      { time: 500, type: 'INFO', text: 'Connecting to Qdrant Vector DB for Stoic quotes...' },
      { time: 2000, type: 'INFO', text: 'RAG: Marcus Aurelius context retrieved.' },
      { time: 4000, type: 'INFO', text: 'Wan 2.2: Generating slow-panning marble statue B-roll.' },
      { time: 8000, type: 'WARN', text: 'Wan 2.2: Adjusting CFG scale to 4.5 for cinematic blur.' },
      { time: 10000, type: 'INFO', text: 'Wan 2.2: Looping background generation complete.' },
      { time: 12000, type: 'INFO', text: 'GCP Studio TTS: Deep resonant voice applied.' },
      { time: 15000, type: 'INFO', text: 'Whisper AI: Generating word-level SRT timestamps.' },
      { time: 16500, type: 'INFO', text: 'FFmpeg: Hardcoding subtitles into final MP4.' },
      { time: 17500, type: 'INFO', text: 'Pipeline Complete.' }
    ]
  },
  default: {
    stages: [
      { id: 'stage1', title: 'Agentic Scripting (Gemini 2.5 Flash)', duration: 3000 },
      { id: 'stage2', title: 'B-Roll Generation (Wan 2.5 I2V)', duration: 6000 },
      { id: 'stage3', title: 'Anchor Synthesis (EchoMimic V3)', duration: 5000 },
      { id: 'stage4', title: 'Video Compilation (FFmpeg)', duration: 2000 }
    ],
    logs: [
      { time: 500, type: 'INFO', text: 'Initializing Default ADK Pipeline...' },
      { time: 2000, type: 'INFO', text: 'Gemini 2.5 Flash: Script drafted.' },
      { time: 5000, type: 'INFO', text: 'Wan 2.5: Generating B-Roll.' },
      { time: 10000, type: 'INFO', text: 'EchoMimic V3: Synthesizing human anchor.' },
      { time: 14000, type: 'INFO', text: 'FFmpeg: Merging assets.' },
      { time: 15500, type: 'INFO', text: 'Pipeline Complete.' }
    ]
  }
};
