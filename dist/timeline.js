(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target, key, result);
    return result;
  };

  // src/timeline.tsx
  var import_components2 = __toModule(__require("@ijstech/components"));

  // src/timeline.css.ts
  var import_components = __toModule(__require("@ijstech/components"));
  var Theme = import_components.Styles.Theme.ThemeVars;
  import_components.Styles.cssRule("i-section-timeline", {
    $nest: {
      "#timelineElm": {},
      ".date-stack": {
        $nest: {
          "i-vstack": {
            borderLeft: "3px solid #0090da"
          }
        }
      },
      ".timelineImg": {
        background: "url(./modules/assets/img/milestone.svg) right / cover no-repeat, #F5F5F5"
      }
    }
  });

  // src/timeline.tsx
  var Theme2 = import_components2.Styles.Theme.ThemeVars;
  var TimelineBlock = class extends import_components2.Module {
    constructor() {
      super(...arguments);
      this.tag = {
        quaterData: ""
      };
      this.quaterData = {};
    }
    async init() {
      super.init();
      this.onRenderQuater();
    }
    async getData() {
    }
    async setData() {
    }
    async edit() {
    }
    getTag() {
      return this.tag;
    }
    async setTag(value) {
      if (value)
        this.tag = value;
      if (this.tag && this.tag.quaterData) {
        const quaterData = JSON.parse(this.tag.quaterData);
        for (const [key, value2] of Object.entries(quaterData)) {
          let anyValue = value2;
          this.quaterData[key] = {
            title: anyValue.title,
            content: anyValue.content
          };
        }
      } else {
        this.quaterData["0"] = { title: "", content: "" };
        this.quaterData["1"] = { title: "", content: "" };
      }
      console.log("----- quarter", this.quaterData);
      this.onRenderQuater();
      this.onRenderDateStack();
    }
    async confirm() {
    }
    async discard() {
    }
    async config() {
      this.mdConfig.visible = true;
    }
    async onConfigCancel() {
      this.mdConfig.visible = false;
    }
    async onConfigSave() {
      const titleData = Array.from(this.quaterElm.querySelectorAll(".quater-title"));
      const contentData = Array.from(this.quaterElm.querySelectorAll(".quater-content"));
      titleData.map((field) => {
        const id = field.id.split("-")[1];
        this.quaterData[id] = { title: field.value, content: "" };
      });
      contentData.map((field) => {
        const id = field.id.split("-")[1];
        this.quaterData[id] = __spreadProps(__spreadValues({}, this.quaterData[id]), { content: field.value });
      });
      this.tag.quaterData = JSON.stringify(this.quaterData);
      this.onRenderDateStack();
      this.mdConfig.visible = false;
    }
    addMoreQuarter() {
      const keys = Object.keys(this.quaterData);
      const lastKey = keys[keys.length - 1];
      const nextKey = (parseInt(lastKey) + 1).toString();
      this.quaterData[nextKey] = { title: "", content: "" };
      const currentLength = Object.keys(this.quaterData).length;
      currentLength === 8 ? this.onRenderQuater(false) : this.onRenderQuater();
    }
    removeQuarter(key) {
      Reflect.deleteProperty(this.quaterData, key);
      this.onRenderQuater();
    }
    onRenderQuater(showAddBtn = true) {
      this.quaterElm.innerHTML = "";
      let hStackElm = /* @__PURE__ */ this.$render("i-hstack", {
        justifyContent: "start",
        alignItems: "center",
        wrap: "wrap"
      });
      let renderElm = [];
      for (const [key, value] of Object.entries(this.quaterData)) {
        renderElm.push(/* @__PURE__ */ this.$render("i-panel", {
          width: "50%",
          padding: { top: 5, bottom: 5, left: 5, right: 5 }
        }, /* @__PURE__ */ this.$render("i-button", {
          caption: "-",
          onClick: () => this.removeQuarter(key),
          padding: { top: 0, bottom: 0, left: 10, right: 10 },
          position: "absolute",
          right: 0
        }), /* @__PURE__ */ this.$render("i-input", {
          class: "quater-title",
          id: `title-${key}`,
          caption: "Quater Data",
          width: "100%",
          captionWidth: "90px",
          placeholder: "Quarter Title",
          value: value.title
        }), /* @__PURE__ */ this.$render("i-input", {
          inputType: "textarea",
          rows: 4,
          multiline: true,
          class: "quater-content",
          placeholder: "Quarter Content",
          id: `content-${key}`,
          width: "100%",
          height: "auto",
          value: value.content
        })));
      }
      hStackElm.append(...renderElm);
      if (showAddBtn)
        hStackElm.append(/* @__PURE__ */ this.$render("i-button", {
          class: "add-more-btn",
          caption: "Add more",
          onClick: () => this.addMoreQuarter()
        }));
      this.quaterElm.append(hStackElm);
    }
    onRenderDateStack() {
      this.timelineElm.templateColumns = [
        "7.5%",
        `repeat(${Object.keys(this.quaterData).length}, 1fr)`,
        "7.5%"
      ];
      this.timelineElm.innerHTML = "";
      const vStack = /* @__PURE__ */ this.$render("i-vstack", {
        class: "date-stack",
        grid: { area: "contentOne / contentOne / contentOne / contentOne" },
        justifyContent: "end"
      }, /* @__PURE__ */ this.$render("i-vstack", {
        padding: { left: "1.5rem" },
        gap: "10px"
      }, this.quaterData["0"].content.split("\n").map((item) => /* @__PURE__ */ this.$render("i-label", {
        caption: item
      }))));
      this.timelineElm.append(vStack);
      this.timelineImg = /* @__PURE__ */ this.$render("i-grid-layout", {
        class: "timelineImg",
        minHeight: "352px",
        padding: { top: "10px", bottom: "10px", left: "7.5%", right: "7.5%" },
        grid: { area: "dateWrapper / dateWrapper / dateWrapper / dateWrapper" },
        templateColumns: ["repeat(6, 1fr)"]
      });
      const vStackImg = /* @__PURE__ */ this.$render("i-vstack", {
        class: "date-stack",
        justifyContent: "start"
      }, /* @__PURE__ */ this.$render("i-hstack", null, /* @__PURE__ */ this.$render("i-image", {
        url: "./modules/assets/img/union.svg",
        class: "union-icon"
      }), /* @__PURE__ */ this.$render("i-label", {
        caption: this.quaterData["0"].title,
        class: "date-lb",
        font: {
          size: "clamp(1.125rem, -0.458rem + 3.299vw, 3.5rem)",
          bold: true,
          color: "#fff"
        },
        lineHeight: "1.2"
      })));
      this.timelineImg.append(vStackImg);
      this.timelineElm.append(this.timelineImg);
    }
    render() {
      return /* @__PURE__ */ this.$render("i-panel", null, /* @__PURE__ */ this.$render("i-modal", {
        id: "mdConfig",
        showBackdrop: true,
        background: { color: "#FFF" },
        maxWidth: "500px",
        popupPlacement: "center",
        closeIcon: { name: "times", fill: "#aaa" }
      }, /* @__PURE__ */ this.$render("i-panel", {
        id: "quaterElm"
      }), /* @__PURE__ */ this.$render("i-hstack", {
        justifyContent: "end",
        alignItems: "center",
        padding: { top: 5, bottom: 5 }
      }, /* @__PURE__ */ this.$render("i-button", {
        caption: "Cancel",
        padding: { top: 5, bottom: 5, left: 10, right: 10 },
        font: { color: "white" },
        background: { color: "#B2554D" },
        icon: { name: "times", fill: "#FFF" },
        onClick: this.onConfigCancel
      }), /* @__PURE__ */ this.$render("i-button", {
        caption: "Save",
        padding: { top: 5, bottom: 5, left: 10, right: 10 },
        icon: { name: "save", fill: "#FFF" },
        onClick: this.onConfigSave,
        margin: { left: 5 },
        font: { color: "white" },
        background: { color: "#77B24D" }
      }))), /* @__PURE__ */ this.$render("i-panel", {
        width: "100%"
      }, /* @__PURE__ */ this.$render("i-grid-layout", {
        id: "timelineElm",
        height: "100%",
        padding: { bottom: "5rem" },
        gap: { row: "1.438rem", column: "10px" },
        templateColumns: ["7.5%", "repeat(6, 1fr)", "7.5%"],
        templateRows: ["auto", "352px", "auto"],
        templateAreas: [
          [
            "... contentOne contentOne contentThree contentThree contentFive contentFive ..."
          ],
          [
            "dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper"
          ],
          [
            "... ... contentTwo contentTwo contentFour contentFour contentSix contentSix"
          ]
        ]
      }, /* @__PURE__ */ this.$render("i-grid-layout", {
        class: "timelineImg",
        minHeight: "352px",
        padding: {
          top: "10px",
          bottom: "10px",
          left: "7.5%",
          right: "7.5%"
        },
        grid: {
          area: "dateWrapper / dateWrapper / dateWrapper / dateWrapper"
        },
        templateColumns: ["repeat(6, 1fr)"]
      }))));
    }
  };
  TimelineBlock = __decorateClass([
    import_components2.customModule,
    (0, import_components2.customElements)("i-section-timeline")
  ], TimelineBlock);
})();
