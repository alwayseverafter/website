import next from "eslint-config-next";

export default [
  ...next(),
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/[0-9.]+v(h|w)\\b/]",
          message:
            "Viewport units break inside embedded previews (see docs/LESSONS.md B2). Use cqh/cqw or a --token.",
        },
      ],
    },
  },
];
