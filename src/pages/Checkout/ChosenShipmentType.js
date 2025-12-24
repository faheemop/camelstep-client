import React from 'react';

import { Delivery } from './ChosenShipmentType/Delivery';
import { PickupOption } from './ChosenShipmentType/Pickup';

export const ChosenShipmentType = ({ shipmentOption, packages, stores }) => {
  if (shipmentOption === 'pickup') {
    return <PickupOption packages={packages} stores={stores} />;
  }

  // if (shipmentOption === 'delivery') {
  //   return <Delivery packages={packages} />;
  // }

  return null;
};
