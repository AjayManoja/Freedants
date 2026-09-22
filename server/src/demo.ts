// Demo entry point: runs the API entirely in memory.
//
//   npm run demo
//
// Nothing is written to a real database — the data lives only as long as this
// process does, and the app resets it to the seeded state on every launch.
process.env.DEMO_MODE = 'true';

// Imported after the flag is set so config picks it up
require('./index');
