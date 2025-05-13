// src/lib/mux.js
import { Mux } from '@mux/mux-node';

if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
  throw new Error('Mux credentials not configured');
}

const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

// Optional sanity check
if (!muxClient?.video?.assets?.create) {
  throw new Error('Mux client failed to initialize properly');
}
console.log('MUX_TOKEN_ID:', process.env.MUX_TOKEN_ID);
console.log('MUX_TOKEN_SECRET:', process.env.MUX_TOKEN_SECRET);

console.log('Mux client successfully initialized');

export default muxClient;
