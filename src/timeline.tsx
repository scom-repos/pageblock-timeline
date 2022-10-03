import {
  Module,
  Panel,
  customElements,
  Styles,
  Modal,
  Input,
  GridLayout,
  customModule,
  Control,
  Upload,
  Image,
} from "@ijstech/components";
import { PageBlock } from "./pageBlock.interface";
import "./timeline.css";

const Theme = Styles.Theme.ThemeVars as any;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-section-timeline"]: TimelineBlock;
    }
  }
}

@customModule
@customElements("i-section-timeline")
export class TimelineBlock extends Module implements PageBlock {
  private data: any;
  public tag: any = {
    quaterData: "",
  };
  private uploader: Upload;
  private mdConfig: Modal;
  private quaterElm: Panel;
  private timelineElm: GridLayout;
  private timelineImg: GridLayout;
  private quaterData: { [x: string]: { title: string; content: string } } = {};

  readonly onConfirm: () => Promise<void>;
  readonly onDiscard: () => Promise<void>;
  readonly onEdit: () => Promise<void>;

  async init() {
    super.init();
    this.onRenderQuater();
  }

  async getData() {
    return this.data;
  }

  async setData(value: any) {
    this.data = value;
  }

  async edit() {}

  getTag() {
    return this.tag;
  }

  async setTag(value: any) {
    if (value) this.tag = value;
    if (this.tag && this.tag.quaterData) {
      const quaterData = JSON.parse(this.tag.quaterData);
      for (const [key, value] of Object.entries(quaterData)) {
        let anyValue: any = value;
        this.quaterData[key] = {
          title: anyValue.title,
          content: anyValue.content,
        };
      }
    } else {
      this.quaterData["0"] = { title: "", content: "" };
      this.quaterData["1"] = { title: "", content: "" };
    }
    const currentLength = Object.keys(this.quaterData).length;
    currentLength === 8 ? this.onRenderQuater(false) : this.onRenderQuater();
    this.onRenderDateStack();
  }

  async confirm() {}

  async discard() {}

  async config() {
    this.mdConfig.visible = true;
  }

  async onConfigCancel() {
    this.mdConfig.visible = false;
  }

  async onConfigSave() {
    const titleData = Array.from(
      this.quaterElm.querySelectorAll(".quater-title")
    ) as Input[];
    const contentData = Array.from(
      this.quaterElm.querySelectorAll(".quater-content")
    ) as Input[];
    titleData.map((field) => {
      const id = field.id.split("-")[1];
      this.quaterData[id] = { title: field.value, content: "" };
    });
    contentData.map((field) => {
      const id = field.id.split("-")[1];
      this.quaterData[id] = { ...this.quaterData[id], content: field.value };
    });
    this.tag.quaterData = JSON.stringify(this.quaterData);

    this.onRenderDateStack();
    this.mdConfig.visible = false;
  }

  onChangeTitle(key: string, e: any) {
    this.quaterData[key] = Object.assign(this.quaterData[key], {
      title: e.target.value,
    });
  }

  onChangeContent(key: string, e: any) {
    this.quaterData[key] = Object.assign(this.quaterData[key], {
      content: e.target.value,
    });
  }

  addMoreQuarter() {
    const keys = Object.keys(this.quaterData);
    const lastKey = keys.length ? keys[keys.length - 1] : "-1";
    const nextKey = (parseInt(lastKey) + 1).toString();
    this.quaterData[nextKey] = { title: "", content: "" };

    const currentLength = Object.keys(this.quaterData).length;
    currentLength === 8 ? this.onRenderQuater(false) : this.onRenderQuater();
  }

  removeQuarter(key: string) {
    Reflect.deleteProperty(this.quaterData, key);
    this.onRenderQuater();
  }

  onRenderQuater(showAddBtn = true) {
    this.quaterElm.innerHTML = "";
    const hStackElm = (
      <i-hstack
        justifyContent={"start"}
        alignItems={"center"}
        wrap={"wrap"}
      ></i-hstack>
    );
    const addBtnElm = (
      <i-button
        class="add-more-btn"
        caption="Add more"
        onClick={() => this.addMoreQuarter()}
      ></i-button>
    );

    const renderElm: any[] = [];
    for (const [key, value] of Object.entries(this.quaterData)) {
      renderElm.push(
        <i-panel
          id={`panel-${key}`}
          width={"50%"}
          padding={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <i-button
            caption="-"
            onClick={() => this.removeQuarter(key)}
            padding={{ top: 0, bottom: 0, left: 10, right: 10 }}
            position={"absolute"}
            right={0}
          ></i-button>
          <i-input
            class="quater-title"
            id={`title-${key}`}
            caption={"Quater Data"}
            width={"100%"}
            captionWidth={"90px"}
            placeholder="Quarter Title"
            value={value.title}
            onChanged={(target, e) => this.onChangeTitle(key, e)}
          ></i-input>
          <i-input
            inputType="textarea"
            rows={4}
            multiline
            class="quater-content"
            placeholder="Quarter Content"
            id={`content-${key}`}
            width={"100%"}
            height="auto"
            value={value.content}
            onChanged={(target, e) => this.onChangeContent(key, e)}
          ></i-input>
        </i-panel>
      );
    }

    hStackElm.append(...renderElm);
    if (showAddBtn) hStackElm.append(addBtnElm);
    this.quaterElm.append(hStackElm);
  }

  onRenderDateStack() {
    const length = Object.keys(this.quaterData).length;
    this.timelineElm.templateColumns = [
      "7.5%",
      `repeat(${length}, 1fr)`,
      "7.5%",
    ];
    this.timelineElm.innerHTML = "";
    let templateAreas: string[][] = [];

    if (length > 0 && length <= 4) {
      templateAreas = [
        ["... contentOne contentOne contentThree contentThree ..."],
        [
          "dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper",
        ],
        ["... ... contentTwo contentTwo contentFour contentFour"],
      ];
    } else if (length > 4 && length <= 6) {
      templateAreas = [
        [
          "... contentOne contentOne contentThree contentThree contentFive contentFive ...",
        ],
        [
          "dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper",
        ],
        [
          "... ... contentTwo contentTwo contentFour contentFour contentSix contentSix",
        ],
      ];
    } else if (length > 6 && length <= 8) {
      templateAreas = [
        [
          "... contentOne contentOne contentThree contentThree contentFive contentFive contentSeven contentSeven ...",
        ],
        [
          "dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper",
        ],
        [
          "... ... contentTwo contentTwo contentFour contentFour contentSix contentSix contentEight contentEight",
        ],
      ];
    }
    this.timelineElm.templateAreas = templateAreas;

    const vStack = [];
    const vStackImg = [];
    for (const [index, [key, value]] of Object.entries(
      Object.entries(this.quaterData)
    )) {
      let gridArea = "";
      switch (index) {
        case "0":
          gridArea = "contentOne / contentOne / contentOne / contentOne";
          break;
        case "1":
          gridArea = "contentTwo / contentTwo / contentTwo / contentTwo";
          break;
        case "2":
          gridArea =
            "contentThree / contentThree / contentThree / contentThree";
          break;
        case "3":
          gridArea = "contentFour / contentFour / contentFour / contentFour";
          break;
        case "4":
          gridArea = "contentFive / contentFive / contentFive / contentFive";
          break;
        case "5":
          gridArea = "contentSix / contentSix / contentSix / contentSix";
          break;
        case "6":
          gridArea =
            "contentSeven / contentSeven / contentSeven / contentSeven";
          break;
        case "7":
          gridArea =
            "contentEight / contentEight / contentEight / contentEight";
          break;
        default:
          gridArea = "contentOne / contentOne / contentOne / contentOne";
      }

      vStack.push(
        <i-vstack
          class="date-stack"
          grid={{ area: gridArea }}
          justifyContent={parseInt(index) % 2 ? "start" : "end"}
        >
          <i-vstack
            padding={{ left: "1.5rem" }}
            gap="10px"
            border={{ left: { width: 3, style: "solid", color: "#0090da" } }}
          >
            {value.content.split("\n").map((item) => (
              <i-label caption={item}></i-label>
            ))}
          </i-vstack>
        </i-vstack>
      );

      vStackImg.push(
        <i-vstack
          class="date-stack"
          justifyContent={parseInt(index) % 2 ? "end" : "start"}
        >
          <i-hstack>
            <i-image
              url="./modules/assets/img/union.svg"
              class="union-icon"
            ></i-image>
            <i-label
              caption={value.title}
              class="date-lb"
              font={{
                size: "clamp(1.125rem, -0.458rem + 3.299vw, 3.5rem)",
                bold: true,
                color: "#fff",
              }}
              lineHeight="1.2"
            ></i-label>
          </i-hstack>
        </i-vstack>
      );
    }
    this.timelineElm.append(...vStack);

    this.timelineImg = (
      <i-grid-layout
        class="timelineImg"
        minHeight={"352px"}
        padding={{ top: "10px", bottom: "10px", left: "7.5%", right: "7.5%" }}
        grid={{ area: "dateWrapper / dateWrapper / dateWrapper / dateWrapper" }}
        templateColumns={[`repeat(${length}, 1fr)`]}
        background={{ image: this.data, color: "#F5F5F5" }}
      ></i-grid-layout>
    );

    this.timelineImg.append(...vStackImg);
    this.timelineElm.append(this.timelineImg);
  }

  async onUploaderOnChange(control: Control, files: any[]) {
    if (files && files[0]) {
      this.data = await this.uploader.toBase64(files[0]);
    }
  }

  render() {
    return (
      <i-panel>
        <i-modal
          id={"mdConfig"}
          showBackdrop={true}
          background={{ color: "#FFF" }}
          maxWidth={"500px"}
          popupPlacement={"center"}
          closeIcon={{ name: "times", fill: "#aaa" }}
        >
          <i-panel id={"pnlImage"}>
            <i-upload
              id={"uploader"}
              onChanged={this.onUploaderOnChange}
              multiple={true}
            ></i-upload>
            {/* <i-image id={"img"} visible={false}></i-image> */}
          </i-panel>
          <i-panel id="quaterElm"></i-panel>
          <i-hstack
            justifyContent={"end"}
            alignItems={"center"}
            padding={{ top: 5, bottom: 5 }}
          >
            <i-button
              caption={"Cancel"}
              padding={{ top: 5, bottom: 5, left: 10, right: 10 }}
              font={{ color: "white" }}
              background={{ color: "#B2554D" }}
              icon={{ name: "times", fill: "#FFF" }}
              onClick={this.onConfigCancel}
            ></i-button>
            <i-button
              caption={"Save"}
              padding={{ top: 5, bottom: 5, left: 10, right: 10 }}
              icon={{ name: "save", fill: "#FFF" }}
              onClick={this.onConfigSave}
              margin={{ left: 5 }}
              font={{ color: "white" }}
              background={{ color: "#77B24D" }}
            ></i-button>
          </i-hstack>
        </i-modal>

        <i-panel width={"100%"}>
          <i-grid-layout
            id="timelineElm"
            height={"100%"}
            padding={{ bottom: "5rem" }}
            gap={{ row: "1.438rem", column: "10px" }}
            templateRows={["auto", "352px", "auto"]}
          ></i-grid-layout>
        </i-panel>
      </i-panel>
    );
  }
}
