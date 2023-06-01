module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-rational-order',
    'stylelint-config-prettier',
    'stylelint-config-html',
  ],
  plugins: ['stylelint-order', 'stylelint-prettier'],
  overrides: [
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
    },
  ],
  rules: {
    'prettier/prettier': true,
    'selector-pseudo-class-no-unknown': null,
    'no-empty-source': null,
    'no-descending-specificity': null,
    'at-rule-no-unknown': null,
    'font-family-no-missing-generic-family-keyword': null,
    'selector-type-no-unknown': null,
    'declaration-colon-newline-after': null,
    'value-list-comma-newline-after': null,
    'color-function-notation': null,
    'declaration-block-trailing-semicolon': null,
    'selector-class-pattern': null,
    'value-no-vendor-prefix': null,
    'keyframes-name-pattern': null,
    'property-no-vendor-prefix': null,
  },
};
