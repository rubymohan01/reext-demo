import { Plugin } from 'vite';

export interface ReextPluginOptions {
  [key: string]: any; // Extend or replace this with real options if applicable
}

export default function reextplugin(options?: ReextPluginOptions): Plugin;