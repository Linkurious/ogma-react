import mapboxgl from "mapbox-gl";
import React from "react";
import { renderToString } from "react-dom/server";
import { uuidv4 } from "./uuid";
import { withMap } from "./context";

export interface PopUpProps {
  id?: string;
  lnglat: mapboxgl.LngLat;
  map: mapboxgl.Map;
  closeOnClick: boolean;
  closeButton: boolean;
}

const PopUpComponent: React.FunctionComponent<PopUpProps> = ({
  id = uuidv4(),
  lnglat,
  map,
  closeButton,
  closeOnClick,
  children,
}) => {
  const [popup, setPopup] = React.useState<any>(null);
  const [newLnglat, setNewLnglat] = React.useState<mapboxgl.LngLat | undefined>(
    undefined
  );
  const [newHtml, setNewHtml] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (!popup) {
      const popupNew = new mapboxgl.Popup({
        closeButton: closeButton,
        closeOnClick: closeOnClick,
      });

      const htmlString = renderToString(children as any);
      popupNew.setLngLat(lnglat).setHTML(htmlString).addTo(map);
      setPopup(popupNew);
      setNewLnglat(lnglat);
      setNewHtml(htmlString);
    }

    return () => {
      if (popup) {
        popup.remove();
      }
    };
  }, [popup, setPopup, setNewLnglat, setNewHtml]);

  if (popup) {
    const htmlString = renderToString(children as any);
    if (htmlString !== newHtml) {
      setNewHtml(htmlString);
      popup.setHTML(htmlString);
      // console.log({ htmlString, newHtml });
    } else if (lnglat !== newLnglat) {
      setNewLnglat(lnglat);
      popup.setLngLat(newLnglat);
    }
  }

  return null;
};

export const PopUp = withMap<PopUpProps>(PopUpComponent);
