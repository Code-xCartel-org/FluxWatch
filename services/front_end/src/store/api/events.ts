import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {API_URL} from "@/config.ts";
import type {EventsQuery, EventsResponse} from "@/models/types/event.ts";

export const events = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["Events", "Event"],
  endpoints: (builder) => ({
    getEvents: builder.query<EventsResponse, EventsQuery>({
      query: (params) => ({
        url: "/events",
        params,
      }),
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map((e) => ({ type: "Event" as const, id: e.eventId })),
              { type: "Events" as const, id: "LIST" },
            ]
          : [{ type: "Events" as const, id: "LIST" }],
    }),

    getEventById: builder.query<Event, string>({
      query: (eventId) => `/events/${eventId}`,
      providesTags: (_res, _err, id) => [{ type: "Event", id }],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
} = events;
