// Decoupled bridge between Phaser scenes and React
// Scenes call these callbacks — React sets them up
// This avoids the stale closure / scene restart timing bugs

export const BRIDGE = {
  onMainMenuStart: () => {},
  onStrangerTalk:  () => {},
  onExitAttempt:   () => {},
}
