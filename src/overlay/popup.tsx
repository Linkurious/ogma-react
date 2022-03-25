import { useEffect, useState, ReactNode, FC, ReactElement } from "react";
import { useOgma } from "../context";
import Ogma, { Overlay, Size, Point } from "@linkurious/ogma";

import { getContent, getPosition } from "./utils";
import { noop } from "../utils";

type Placement = "top" | "bottom" | "left" | "right" | "center";

interface PopupProps {
  content?: string | ReactElement;
  position: Point | ((ogma: Ogma) => Point);
  size?: Size;
  isOpen?: boolean;
  closeButton?: ReactNode;
  onClose?: () => void;
  placement?: Placement;

  popupClass?: string;
  contentClass?: string;
  popupBodyClass?: string;
  closeButtonClass?: string;
}

const offScreenPos: Point = { x: -9999, y: -9999 };

// TODO: use props for these classes
const POPUP_CONTENT_CLASS = "ogma-popup--content";
const POPUP_CLOSE_BUTTON_CLASS = "ogma-popup--close";
const POPUP_BODY_CLASS = "ogma-popup--body";
const POPUP_CLASS = "ogma-popup";

const getContainerClass = (popupClass: string, placement: Placement) =>
  `${popupClass} ${popupClass}--${placement}`;

export const Popup: FC<PopupProps> = ({
  content,
  position,
  children,
  isOpen = true,
  onClose = noop,
  placement = "top",
  popupClass = POPUP_CLASS,
  closeButtonClass = POPUP_CLOSE_BUTTON_CLASS,
  contentClass = POPUP_CONTENT_CLASS,
  popupBodyClass = POPUP_BODY_CLASS,
}) => {
  const ogma = useOgma();
  const [layer, setLayer] = useState<Overlay | null>(null);

  useEffect(() => {
    // register listener
    const pos = getPosition(position, ogma) || offScreenPos;
    const html = getContent(ogma, pos, content, children);
    const popupLayer = ogma.layers.addOverlay({
      position: pos || offScreenPos,
      element: `<div class="${getContainerClass(popupClass, placement)}"/>
          <div class="${popupBodyClass}">
            <div class="${closeButtonClass}">&times;</div>
            <div class="${contentClass} ">${html}</div>
          </div>
        </div>`,
      size: { width: "auto", height: "auto" } as any as Size,
      scaled: false,
    });

    const onClick = (evt: MouseEvent) => {
      const closeButton = popupLayer.element.querySelector(
        `.${POPUP_CLOSE_BUTTON_CLASS}`
      ) as Element;
      if (evt.target && closeButton.contains(evt.target as Node)) {
        evt.stopPropagation();
        evt.preventDefault();
        onClose();
      }
    };
    popupLayer.element.addEventListener("click", onClick);
    setLayer(popupLayer);
    if (!isOpen) popupLayer.hide();

    return () => {
      // unregister listener
      if (layer) {
        layer.element.removeEventListener("click", onClick);
        layer.destroy();
        setLayer(null);
      }
    };
  }, []);

  useEffect(() => {
    if (layer) {
      const pos = getPosition(position, ogma) || offScreenPos;
      const html = getContent(ogma, pos, content, children);
      const { element } = layer;
      element.className = getContainerClass(popupClass, placement);
      element.querySelector(`.${POPUP_CONTENT_CLASS}`)!.innerHTML = html;

      layer.setPosition(pos);

      if (isOpen) layer.show();
      else layer.hide();
    }
  }, [content, position, isOpen, placement]);

  return null;
};
