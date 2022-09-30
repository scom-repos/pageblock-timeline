import {
  Module,
  Panel,
  customElements,
  Styles,
  Modal,
  Input,
  GridLayout,
  customModule,
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
  tag: any = {
    quaterData: "",
  };
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

  async getData() {}
  async setData() {}
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
    this.onRenderQuater();
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
    console.log("--", this.tag.quaterData);

    this.onRenderDateStack();
    this.mdConfig.visible = false;
  }

  onRenderQuater() {
    this.quaterElm.innerHTML = "";
    let renderElm: any[] = [];
    for (const [key, value] of Object.entries(this.quaterData)) {
      renderElm.push(
        <i-hstack justifyContent={"start"} alignItems={"center"}>
          <i-panel
            width={"50%"}
            padding={{ top: 5, bottom: 5, left: 5, right: 5 }}
          >
            <i-input
              class="quater-title"
              id={`title-${key}`}
              caption={"Quater Data"}
              width={"100%"}
              captionWidth={"80px"}
              value={value.title}
            ></i-input>
            <i-input
              inputType="textarea"
              rows={4}
              multiline
              class="quater-content"
              id={`content-${key}`}
              width={"100%"}
              height="auto"
              value={value.content}
            ></i-input>
          </i-panel>
        </i-hstack>
      );
    }
    this.quaterElm.append(...renderElm);
  }

  onRenderDateStack() {
    this.timelineElm.templateColumns = [
      "7.5%",
      `repeat(${Object.keys(this.quaterData).length}, 1fr)`,
      "7.5%",
    ];
    this.timelineElm.innerHTML = "";
    const vStack = (
      <i-vstack
        class="date-stack"
        grid={{ area: "contentOne / contentOne / contentOne / contentOne" }}
        justifyContent="end"
      >
        <i-vstack padding={{ left: "1.5rem" }} gap="10px">
          {this.quaterData["0"].content.split("\n").map((item) => (
            <i-label caption={item}></i-label>
          ))}
        </i-vstack>
      </i-vstack>
    );
    this.timelineElm.append(vStack);

    this.timelineImg = (
      <i-grid-layout
        class="timelineImg"
        minHeight={"352px"}
        padding={{ top: "10px", bottom: "10px", left: "7.5%", right: "7.5%" }}
        grid={{ area: "dateWrapper / dateWrapper / dateWrapper / dateWrapper" }}
        templateColumns={["repeat(6, 1fr)"]}
      ></i-grid-layout>
    );

    const vStackImg = (
      <i-vstack class="date-stack" justifyContent="start">
        <i-hstack>
          <i-image
            url="./modules/assets/img/union.svg"
            class="union-icon"
          ></i-image>
          <i-label
            caption={this.quaterData["0"].title}
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
    this.timelineImg.append(vStackImg);
    this.timelineElm.append(this.timelineImg);
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
            templateColumns={["7.5%", "repeat(6, 1fr)", "7.5%"]}
            templateRows={["auto", "352px", "auto"]}
            templateAreas={[
              [
                "... contentOne contentOne contentThree contentThree contentFive contentFive ...",
              ],
              [
                "dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper dateWrapper",
              ],
              [
                "... ... contentTwo contentTwo contentFour contentFour contentSix contentSix",
              ],
            ]}
          >
            {/* <i-vstack
              class="date-stack"
              grid={{
                area: "contentOne / contentOne / contentOne / contentOne",
              }}
              justifyContent="end"
            >
              <i-vstack padding={{ left: "1.5rem" }} gap="10px">
                <i-label caption={this.quaterData["0"].content}></i-label>
              </i-vstack>
            </i-vstack> */}

            {/* <i-vstack
              class="date-stack"
              grid={{
                area: "contentTwo / contentTwo / contentTwo / contentTwo",
              }}
              justifyContent="start"
            >
              <i-vstack padding={{ left: "1.5rem" }} gap="10px">
                <i-label caption="Phase 1 - NFT to Access"></i-label>
                <i-label caption="NFT Whitelisting Event"></i-label>
                <i-label caption="NFT Publish Sales"></i-label>
                <i-label caption="Opensea listing"></i-label>
                <i-label caption="BETPORT Platform v1 launch"></i-label>
              </i-vstack>
            </i-vstack>

            <i-vstack
              class="date-stack"
              grid={{
                area: "contentThree / contentThree / contentThree / contentThree",
              }}
              justifyContent="end"
            >
              <i-vstack padding={{ left: "1.5rem" }} gap="10px">
                <i-label caption="NFT Marketplace"></i-label>
              </i-vstack>
            </i-vstack>

            <i-vstack
              class="date-stack"
              grid={{
                area: "contentFour / contentFour / contentFour / contentFour",
              }}
              justifyContent="start"
            >
              <i-vstack padding={{ left: "1.5rem" }} gap="10px">
                <i-label caption="Phase 2 - Public Access"></i-label>
                <i-label caption="Token Release"></i-label>
                <i-label caption="NFT Holder Airdrop"></i-label>
                <i-label caption="BETPORT Platform v2 Launch"></i-label>
                <i-label caption="Whitepaper update"></i-label>
                <i-label caption="DAO Governance Establish"></i-label>
                <i-label caption="Staking Pool Launched"></i-label>
              </i-vstack>
            </i-vstack>

            <i-vstack
              class="date-stack"
              grid={{
                area: "contentFive / contentFive / contentFive / contentFive",
              }}
              justifyContent="end"
            >
              <i-vstack padding={{ left: "1.5rem" }} gap="10px">
                <i-label caption="Phase 3 - Expansion"></i-label>
                <i-label caption="Launchpad"></i-label>
                <i-label caption="Partnership Reveal"></i-label>
                <i-label caption="Lottery Pool"></i-label>
                <i-label caption="Bonus Pool"></i-label>
              </i-vstack>
            </i-vstack>

            <i-vstack
              class="date-stack"
              grid={{
                area: "contentSix / contentSix / contentSix / contentSix",
              }}
              justifyContent="start"
            >
              <i-vstack padding={{ left: "1.5rem" }} gap="10px">
                <i-label caption="Phase 4 - Future"></i-label>
                <i-label caption="Others Betting Event"></i-label>
                <i-label caption="Burning Token Event"></i-label>
                <i-label caption="Multichain Support"></i-label>
                <i-label caption="2nd NFT Launch"></i-label>
              </i-vstack>
            </i-vstack> */}

            <i-grid-layout
              class="timelineImg"
              minHeight={"352px"}
              padding={{
                top: "10px",
                bottom: "10px",
                left: "7.5%",
                right: "7.5%",
              }}
              grid={{
                area: "dateWrapper / dateWrapper / dateWrapper / dateWrapper",
              }}
              templateColumns={["repeat(6, 1fr)"]}
            >
              {/* <i-vstack class="date-stack" justifyContent="start">
                <i-hstack>
                  <i-image
                    url="./modules/assets/img/union.svg"
                    class="union-icon"
                  ></i-image>
                  <i-label
                    caption={this.quaterData["0"].title}
                    class="date-lb"
                    font={{
                      size: "clamp(1.125rem, -0.458rem + 3.299vw, 3.5rem)",
                      bold: true,
                      color: "#fff",
                    }}
                    lineHeight="1.2"
                  ></i-label>
                </i-hstack>
              </i-vstack> */}

              {/* <i-vstack class="date-stack" justifyContent="end">
                <i-hstack>
                  <i-image
                    url="./modules/assets/img/union.svg"
                    class="union-icon"
                  ></i-image>
                  <i-label
                    caption={`2022<br>Q3`}
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

              <i-vstack class="date-stack" justifyContent="start">
                <i-hstack>
                  <i-image
                    url="./modules/assets/img/union.svg"
                    class="union-icon"
                  ></i-image>
                  <i-label
                    caption={`2022<br>Q4`}
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

              <i-vstack class="date-stack" justifyContent="end">
                <i-hstack>
                  <i-image
                    url="./modules/assets/img/union.svg"
                    class="union-icon"
                  ></i-image>
                  <i-label
                    caption={`2023<br>Q1`}
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

              <i-vstack class="date-stack" justifyContent="start">
                <i-hstack>
                  <i-image
                    url="./modules/assets/img/union.svg"
                    class="union-icon"
                  ></i-image>
                  <i-label
                    caption={`2023<br>Q2`}
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

              <i-vstack class="date-stack" justifyContent="end">
                <i-hstack>
                  <i-image
                    url="./modules/assets/img/union.svg"
                    class="union-icon"
                  ></i-image>
                  <i-label
                    caption={`2023<br>Q3`}
                    class="date-lb"
                    font={{
                      size: "clamp(1.125rem, -0.458rem + 3.299vw, 3.5rem)",
                      bold: true,
                      color: "#fff",
                    }}
                    lineHeight="1.2"
                  ></i-label>
                </i-hstack>
              </i-vstack> */}
            </i-grid-layout>
          </i-grid-layout>
        </i-panel>
      </i-panel>
    );
  }
}
