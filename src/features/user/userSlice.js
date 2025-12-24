import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../services/api';
import { orderApi } from '../../services/order';
import { userApi } from '../../services/user';

const splitAddressesByPurpose = (addresses) => {
  const splittedAddresses = addresses.reduce((acc, address) => {
    if (acc[address.purpose]) {
      acc[address.purpose].push(address);
    } else {
      acc[address.purpose] = [address];
    }
    return acc;
  }, {});

  return splittedAddresses;
};

const splitProductPreferencesIntoCategories = (productPreferences) => {
  const mapping = {
    brewing_method: 'coffee',
    coffee_type: 'tools',
    country: 'coffee',
    major_note: 'coffee',
    no_of_cups: 'tools',
    place: 'tools',
  };
  const productPreferencesByCategory = {
    coffee: {},
    tools: {},
  };
  Object.keys(productPreferences).forEach((preference) => {
    if (productPreferences[preference] === null) return;
    Object.keys(mapping).forEach((key) => {
      if (preference === key) {
        productPreferencesByCategory[mapping[key]][preference] = productPreferences[preference];
      }
    });
  });

  return productPreferencesByCategory;
};

const initialState = {
  notifications: {
    order_updates_email: false,
    order_updates_whatsapp: false,
    wishlist_email: false,
    wishlist_whatsapp: false,
    discounts_and_promotions_email: false,
    discounts_and_promotions_whatsapp: false,
  },
  addresses: {},
  productPreferences: {
    coffee: {},
    tools: {},
  },
  wishListData: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.getNotificationSettings.matchFulfilled, (state, action) => {
      state.notifications = action.payload;
    });
    builder.addMatcher(orderApi.endpoints.getSavedAddresses.matchFulfilled, (state, action) => {
      const addressessByPurpose = splitAddressesByPurpose(action.payload);
      state.addresses = addressessByPurpose;
    });
    builder.addMatcher(userApi.endpoints.getAddressess.matchFulfilled, (state, action) => {
      const addressessByPurpose = splitAddressesByPurpose(action.payload);
      state.addresses = addressessByPurpose;
    });
    builder.addMatcher(authApi.endpoints.logoutUser.matchFulfilled, (state) => {
      Object.assign(state, initialState);
    });
    builder.addMatcher(userApi.endpoints.getProductPreferences.matchFulfilled, (state, action) => {
      state.productPreferences = splitProductPreferencesIntoCategories(action.payload);
    });
    builder.addMatcher(userApi.endpoints.getWishlistProducts.matchFulfilled, (state, action) => {
      state.wishListData = action.payload;
    });
  },
});

export const userReducer = userSlice.reducer;
