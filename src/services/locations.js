import { api } from "./api";

export const locationsApi = api.injectEndpoints({
    reducerPath: "locationsApi",
    endpoints: (builder) => ({
        getLocations: builder.query({
            query: () => ({
                url: `/locations`,
                method: 'GET',
            }),
            transformResponse: (response) => response.data.records,
        }),
    }),
});

export const { useGetLocationsQuery } = locationsApi;
