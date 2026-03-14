import {useGetEventsQuery} from "@/store/api/events";

const Events = () => {
    const {data, isLoading, isError} = useGetEventsQuery({
        pageSize: 20,
        page: 1,
    });

    if (isLoading) return <div className="p-4">Loading…</div>;
    if (isError) return <div className="p-4">Error loading events</div>;

    return (
        <>
            <div className="p-4">
                <h1 className="text-xl font-semibold mb-4">Events</h1>

                <div className="space-y-2">
                    {data?.results?.map((e) => (
                        <div
                            key={e.eventId}
                            className="rounded-xl border p-3 text-sm flex flex-col gap-1"
                        >
                            <div className="font-medium">{e.eventType}</div>
                            <div className="text-muted-foreground">
                                {e.entity.type} / {e.entity.id} • producer: {e.producer}
                            </div>
                            <div className="text-xs text-muted-foreground">{e.occurredAt}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Events;
