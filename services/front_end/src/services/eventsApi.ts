import {baseApi} from "./baseApi";
import type {Event, EventsQuery, EventsResponse} from "@/models/event";
import {API_ENDPOINTS} from "@/constants/api.ts";

export const eventsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getEvents: builder.query<EventsResponse, EventsQuery>({
            query: (params) => ({
                url: API_ENDPOINTS.EVENTS.LIST,
                params,
            }),
        }),

        getEventById: builder.query<Event, string>({
            query: (id) => API_ENDPOINTS.EVENTS.DETAIL(id),
        }),
    }),
});

export const {useGetEventsQuery, useGetEventByIdQuery} = eventsApi;
