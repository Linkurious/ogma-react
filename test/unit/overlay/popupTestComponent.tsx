import { Overlay } from "@linkurious/ogma";
import { Ogma, Popup } from "../../../src";
import { createRef } from "react";
import React from "react";

export const ref = createRef<Overlay>();

export const PopupComponent = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const onClose = () => setIsOpen(false);

  return (
    <Ogma>
      <Popup
        ref={ref}
        position={{ x: 0, y: 0 }}
        isOpen={isOpen}
        onClose={onClose}
        closeButton={<span className="custom-close-button">X</span>}
      >
        Popup content
      </Popup>
    </Ogma>
  )
}