import { createSafeContext } from '@/utils/contexts/createSafeContext';
import { TimelineContext } from './interfaces';

export const [TimelineContextProviderBase, useTimeline] =
  createSafeContext<TimelineContext>('TimelineContext');