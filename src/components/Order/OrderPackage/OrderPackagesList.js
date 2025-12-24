import React from 'react';
import { OrderPackage } from './OrderPackage';

export const OrderPackagesList = ({ packages }) => (
  <>
    {packages.map((orderPackage, index) => (
      <OrderPackage key={`${orderPackage.id} ${index}`} box={orderPackage} index={index} />
    ))}
  </>
);
