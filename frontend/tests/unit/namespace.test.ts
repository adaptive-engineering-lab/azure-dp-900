import { describe, it, expect } from 'vitest';
import { NAMESPACE, SCHEMA_VERSION, STATE_KEY, PROBE_KEY } from '../../src/lib/storage/namespace';

describe('Storage namespace contract', () => {
  it('uses the dp900game prefix', () => {
    expect(NAMESPACE).toBe('dp900game');
    expect(STATE_KEY.startsWith(NAMESPACE + '.')).toBe(true);
    expect(PROBE_KEY.startsWith(NAMESPACE + '.')).toBe(true);
  });

  it('pins SCHEMA_VERSION to 1 in the current release', () => {
    expect(SCHEMA_VERSION).toBe(1);
  });

  it('uses a versioned state key', () => {
    expect(STATE_KEY).toBe('dp900game.v1.state');
  });
});
