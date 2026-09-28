import { query } from './_generated/server'

export const check = query({
  args: {},
  handler: async () => ({ ready: true }),
})
