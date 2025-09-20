/**
 * Web Vitals Launcher - Handles dynamic loading of web vitals monitoring
 * This is separated to avoid Vite build warnings about mixed static/dynamic imports
 */

import { logger } from './logger';

let webVitalsStarted = false;
let webVitalsInstance: { stopMonitoring: () => void } | null = null;

/**
 * Starts web vitals monitoring dynamically
 */
export async function startWebVitalsMonitoring(): Promise<void> {
  if (webVitalsStarted) return;

  try {
    const { webVitals } = await import('./webVitals');
    webVitalsInstance = webVitals;
    webVitals.startMonitoring();
    webVitalsStarted = true;
    
    logger.info('Web Vitals monitoring started', {
      context: 'WebVitalsLauncher'
    });
  } catch (error) {
    logger.error('Failed to start web vitals monitoring', {
      context: 'WebVitalsLauncher',
      data: { error }
    });
  }
}

/**
 * Stops web vitals monitoring
 */
export async function stopWebVitalsMonitoring(): Promise<void> {
  if (!webVitalsStarted || !webVitalsInstance) return;

  try {
    webVitalsInstance.stopMonitoring();
    webVitalsStarted = false;
    webVitalsInstance = null;
    
    logger.info('Web Vitals monitoring stopped', {
      context: 'WebVitalsLauncher'
    });
  } catch (error) {
    logger.error('Failed to stop web vitals monitoring', {
      context: 'WebVitalsLauncher',
      data: { error }
    });
  }
}

/**
 * Check if web vitals monitoring is active
 */
export function isWebVitalsActive(): boolean {
  return webVitalsStarted;
}
