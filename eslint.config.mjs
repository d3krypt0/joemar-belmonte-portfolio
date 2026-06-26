import next from 'eslint-config-next'

const eslintConfig = [
  ...next,
  {
    rules: {
      // New, opinionated rule in eslint-config-next 16. It flags legitimate
      // mount-flag / scroll / typewriter effects here. Keep it visible as a
      // warning rather than failing the build.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
]

export default eslintConfig
