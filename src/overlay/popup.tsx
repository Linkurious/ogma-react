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
    let currentLayer: OverlayLayer | null = null;
    let onKeyDown: ((event: { code: number }) => void) | null = null;
    let onClick: ((event: MouseEvent) => void) | null = null;

    if (isOpen) {
      // register listener
      const pos = getPosition(position, ogma) || offScreenPos;
      // Create initial empty content container
      currentLayer = ogma.layers.addOverlay({
        position: pos || offScreenPos,
        element: `<div class="${getContainerClass(popupClass, placement)}"/>
          <div class="${popupBodyClass}">
            ${getCloseButton(closeButton, closeButtonClass)}
            <div class="${contentClass} "></div>
          </div>
        </div>`,
        size: size || { width: "auto", height: "auto" },
        scaled: false,
      });

      onClick = (evt: MouseEvent) => {
        const closeButton = currentLayer?.element.querySelector(
          `.${closeButtonClass}`
        ) as Element;
        if (evt.target && closeButton.contains(evt.target as Node)) {
          evt.stopPropagation();
          evt.preventDefault();
          onClose();
        }
      };
      onKeyDown = ({ code }: { code: number }) => {
        if (code === 27) onClose();
      };

      if (closeOnEsc) ogma.events.on("keyup", onKeyDown);
      currentLayer.element.addEventListener("click", onClick);

      setLayer(currentLayer);
      // Update content if static content is provided
      if (content && !children) {
        const contentElement = currentLayer.element.querySelector(
          `.${contentClass}`
        );
        const html = getContent(ogma, pos, content, children);
        if (contentElement) contentElement.innerHTML = html;
      }
      setLayer(currentLayer);
    }

    return () => {
      // unregister listener
      if (currentLayer) {
        if (onClick) currentLayer.element.removeEventListener("click", onClick);
        if (onKeyDown) ogma.events.off(onKeyDown);
        currentLayer.destroy();
        setLayer(null);
      }
    };
  }, [isOpen, ogma]);

  useEffect(() => {
    if (layer && layer.element) {
      const pos = getPosition(position, ogma) || offScreenPos;
      layer.setPosition(pos);

      // Update container classes
      layer.element.className = getContainerClass(popupClass, placement);

      // Only update static content if provided
      if (content && !children) {
        const contentElement = layer.element.querySelector(`.${contentClass}`);
        if (contentElement) {
          contentElement.innerHTML = typeof content === "string" ? content : "";
        }
      }

      if (isOpen) layer.show();
      else layer.hide();
    }
  }, [layer, position, isOpen, placement, popupClass, content, children]);

  // Render children through portal if they exist, otherwise render nothing
  if (!layer || !isOpen) return null;

  const contentElement = layer.element.querySelector(`.${contentClass}`);
  if (!contentElement) return null;

  return children ? createPortal(children, contentElement) : null;
};

/**
 * A popup component.
 * Use it to display information statically on top of your visualisation
 * or to display a modal dialog.
 */
export const Popup = forwardRef(PopupComponent);
