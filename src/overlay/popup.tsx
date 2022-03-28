import { useEffect, useState, ReactNode, FC, ReactElement } from "react";

import Ogma, { Overlay, Size, Point } from "@linkurious/ogma";
import { useOgma } from "../context";
import { getContent, getPosition, getContainerClass } from "./utils";
import { noop } from "../utils";
import { Placement } from "./types";

interface PopupProps {
  content?: string | ReactElement;
  position: Point | ((ogma: Ogma) => Point);
  size?: Size;
  isOpen?: boolean;
  closeButton?: ReactNode;
  onClose?: () => void;
  placement?: Placement;
  closeOnEsc?: boolean;

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
  size,
  closeOnEsc = true,
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
      size: size || ({ width: "auto", height: "auto" } as any as Size),
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
    const onKeyDown = ({ code }: { code: number }) => {
      if (code === 27) onClose();
    };
    if (closeOnEsc) ogma.events.on("keyup", onKeyDown);
    popupLayer.element.addEventListener("click", onClick);

    setLayer(popupLayer);
    if (!isOpen) popupLayer.hide();

    return () => {
      // unregister listener
      if (layer) {
        layer.element.removeEventListener("click", onClick);
        ogma.events.off(onKeyDown);
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
