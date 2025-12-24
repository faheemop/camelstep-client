import React from 'react';
import _ from 'lodash';
import { ProductBadges } from '../Product/ProductBadges';
import { SummaryItem } from '../SummaryItem/SummaryItem';
import { useMediaQuery } from '../../hooks/useCurrentScreenWidth';
import { PackageSummaryItem } from '../PackageSummaryItem';

export const OrderItem = ({ item }) => {
  const lessThan575 = useMediaQuery('(max-width: 575px)');

  return (
    <div className="checkout-item">
      {lessThan575 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <ProductBadges badges={item.tags} />
        </div>
      )}
      {!_.isEmpty(item.package_products) ? (
        <PackageSummaryItem
          id={item.package_id}
          name_en={item.name_en}
          name_ar={item.name_ar}
          image_url={item.image_url}
          quantity={item.quantity}
          totalQuantityPrice={item.total_quantity_price}
          vatPrice={item.vat_price}
          package_products={item?.package_products}
        />
      ) : (
        <SummaryItem
          id={item.product_id}
          name={item.name}
          image_url={item.image_url}
          quantity={item.quantity}
          totalQuantityPrice={item.total_quantity_price}
          tags={item.tags}
          variants={item.variants}
          modificators={item.modificators}
          vatPrice={item.vat_price}
          totalQuantityDiscountPrice={item.total_quantity_discounted_price}
          discountPercentageValue={item.discount_percent_value}
        />
      )}
    </div>

  );
};
