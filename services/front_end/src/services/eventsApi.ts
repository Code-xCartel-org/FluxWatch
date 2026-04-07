import {baseApi} from "./baseApi";
import type {Event, EventsQuery, EventsResponse} from "@/models/event";
import {API_ENDPOINTS} from "@/constants/api";
import {API_URL} from "@/config";
import {HEADERS} from "@/constants/headers";
import type {RootState} from "@/store/store";
import {EventSourcePolyfill, type MessageEvent} from "event-source-polyfill";

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

        streamEvents: builder.query<EventsResponse, EventsQuery>({
            query: (params) => ({
                url: API_ENDPOINTS.EVENTS.LIST,
                params,
            }),
            async onCacheEntryAdded(_arg, {updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState}) {
                await cacheDataLoaded;

                const token = (getState() as RootState).auth.token;
                const url = `${API_URL}${API_ENDPOINTS.EVENTS.STREAM}`;

                const es = new EventSourcePolyfill(url, {
                    headers: {
                        [HEADERS.AUTHORIZATION]: `${HEADERS.TOKEN} ${token}`,
                    },
                });

                es.onmessage = (e: MessageEvent) => {
                    try {
                        const incoming: Event[] = JSON.parse(e.data);

                        updateCachedData((draft) => {
                            const existingIds = new Set(draft.results.map((ev) => ev.eventId));
                            const unique = incoming.filter((ev) => !existingIds.has(ev.eventId));

                            if (unique.length > 0) {
                                draft.results.unshift(...unique);
                            }
                        });
                    } catch {
                        // TODO Error Handling is pending
                    }
                };

                await cacheEntryRemoved;
                es.close();
            },
        }),
    }),
});

export const {useGetEventsQuery, useGetEventByIdQuery, useStreamEventsQuery} = eventsApi;
