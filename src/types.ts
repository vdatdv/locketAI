import type { AspectRatioOption, FreeAiModel } from './utils/locketConfig';

export type AppTab = 'mitm' | 'logs' | 'deploy';

export interface GeneratedPhotoItem {
  id: string;
  prompt: string;
  enhancedPrompt: string;
  styleId: string;
  filterId?: string;
  img2img?: boolean;
  imageUrl?: string;
  aspectRatio: AspectRatioOption;
  model: FreeAiModel;
  provider: string;
  imageDataUrl: string;
  width: number;
  height: number;
  latencyMs: number;
  createdAt: string;
  notice?: string;
}

export interface ServerLogEntry {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  status: number;
  latencyMs: number;
  provider: string;
  detail: string;
}
