import {baseApi} from "./baseApi.ts";
import {API_ENDPOINTS, HTTP_METHODS} from "@/constants/api.ts";
import {API_TAGS} from "@/constants/redux.ts";

export interface ApiKeyInfo {
    createdAt: string;
    lastUsedAt: string | null;
    isActive: boolean;
}

export interface ApiKeyGenerated {
    key: string;
}

export const keysApi = baseApi.enhanceEndpoints({addTagTypes: [API_TAGS.API_KEY]}).injectEndpoints({
    endpoints: (builder) => ({
        getApiKey: builder.query<ApiKeyInfo | null, void>({
            query: () => ({
                url: API_ENDPOINTS.KEYS.GET,
                method: HTTP_METHODS.GET,
            }),
            providesTags: [API_TAGS.API_KEY],
        }),

        generateApiKey: builder.mutation<ApiKeyGenerated, void>({
            query: () => ({
                url: API_ENDPOINTS.KEYS.GENERATE,
                method: HTTP_METHODS.GET,
            }),
            invalidatesTags: [API_TAGS.API_KEY],
        }),
    }),
});

export const {useGetApiKeyQuery, useGenerateApiKeyMutation} = keysApi;
