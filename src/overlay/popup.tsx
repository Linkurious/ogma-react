import {
  useEffect,
  useState,
  ReactNode,
  ReactElement,
  Ref,
  forwardRef,
  useImperativeHandle,
} from "react";

import OgmaLib, {
  Overlay as OverlayLayer,
  Size,
  Point,
} from "@linkurious/ogma";
import { useOgma } from "../context";
import {
  getContent,
  getPosition,
  getContainerClass,
  getCloseButton,
} from "./utils";
import { noop } from "../utils";
import { Placement } from "./types";
import { createPortal } from "react-dom";

interface PopupProps {
  /** Overlay content */
  content?: string | ReactElement;
  /** Overlay position */
  position: Point | ((ogma: OgmaLib) => Point | null);
  /** Overlay size */
  size?: Size;
  /** Open state, whether or not the overlay should be shown  */
  isOpen?: boolean;

  /** Close button */
  closeButton?: ReactNode | null;
  /** Close callback */
  onClose?: () => void;
  /** Overlay placement relative to the position */
  placement?: Placement;
  /** Close on Escape key */
  closeOnEsc?: boolean;
  /** Overlay container className */
  popupClass?: string;
  /** Overlay content className */
  contentClass?: string;
  /** Overlay body className */
  popupBodyClass?: string;
  /** Close button className */
  closeButtonClass?: string;

  children?: ReactNode;
}

const offScreenPos: Point = { x: -9999, y: -9999 };

// TODO: use props for these classes
const POPUP_CONTENT_CLASS = "ogma-popup--content";
const POPUP_CLOSE_BUTTON_CLASS = "ogma-popup--close";
const POPUP_BODY_CLASS = "ogma-popup--body";
const POPUP_CLASS = "ogma-popup";

const PopupComponent = (
  {
    content,
    position,
    children,
    isOpen = true,
    closeButton,
    onClose = noop,
    placement = "top",
    popupClass = POPUP_CLASS,
    closeButtonClass = POPUP_CLOSE_BUTTON_CLASS,
    contentClass = POPUP_CONTENT_CLASS,
    popupBodyClass = POPUP_BODY_CLASS,
    size,
    closeOnEsc = true,
  }: PopupProps,
  ref?: Ref<OverlayLayer>
) => {
  const ogma = useOgma();
  const [layer, setLayer] = useState<OverlayLayer | null>(null);

  useImperativeHandle(ref, () => layer as OverlayLayer, [layer]);

  useEffect(() => {
    // register listener
    const pos = getPosition(position, ogma) || offScreenPos;
    const html = getContent(ogma, pos, content, children);

    const popupLayer = ogma.layers.addOverlay({
      position: pos || offScreenPos,
      element: `<div class="${getContainerClass(popupClass, placement)}"/>
          <div class="${popupBodyClass}">
            ${getCloseButton(closeButton, closeButtonClass)}
            <div class="${contentClass} ">${html}</div>
          </div>
        </div>`,
      size: size || ({ width: "auto", height: "auto" } as any as Size),
      scaled: false,
    });

    const onClick = (evt: MouseEvent) => {
      const closeButton = popupLayer.element.querySelector(
        `.${closeButtonClass}`
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
      const html = getContent(ogma, pos, content);
      const { element } = layer;
      element.className = getContainerClass(popupClass, placement);
      element.querySelector(`.${popupBodyClass}`)!.innerHTML = `
      ${getCloseButton(closeButton, closeButtonClass)}
      <div class="${contentClass} ">${html}</div>`;

      layer.setPosition(pos);

      if (isOpen) layer.show();
      else layer.hide();
    }
  }, [content, position, isOpen, placement]);

  if (!layer || !children) return null;

  return createPortal(
    children,
    layer!.element.querySelector(`.${popupBodyClass}`)!
  );
};

/**
 * A popup component.
 * Use it to display information statically on top of your visualisation
 * or to display a modal dialog.
 */
export const Popup = forwardRef(PopupComponent);
