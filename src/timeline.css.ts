import { Styles } from "@ijstech/components";

const Theme = Styles.Theme.ThemeVars as any;

Styles.cssRule("i-section-timeline", {
  $nest: {
    "#timelineElm": {},

    ".date-stack": {
      $nest: {
        "i-vstack": {
          borderLeft: "3px solid #0090da",
        },
      },
    },

    ".timelineImg": {
      background:
        "url(./modules/assets/img/milestone.svg) right / cover no-repeat, #F5F5F5",
    },
  },
});
