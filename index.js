/**
 * index.js — Application entry point for AirHaven.
 *
 * Registers the root App component via Expo's registerRootComponent,
 * which handles both Expo Go and native build environments.
 *
 * @module index
 */

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
