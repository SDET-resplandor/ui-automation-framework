export const PASSWORD =
  (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env?.SAUCE_PASSWORD ?? 'secret_sauce';

export interface Credentials {
  username: string;
  password: string;
}

export const USERS = {
  standard:    { username: 'standard_user', password: PASSWORD },
  locked:      { username: 'locked_out_user', password: PASSWORD },
  problem:     { username: 'problem_user', password: PASSWORD },
  performance: { username: 'performance_glitch_user', password: PASSWORD },
} satisfies Record<string, Credentials>;