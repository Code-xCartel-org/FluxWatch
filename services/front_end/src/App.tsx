import {createBrowserRouter} from "react-router";
import {RouterProvider} from "react-router/dom";
import Events from "@/pages/events";

function App() {
    const router = createBrowserRouter([
        {path: "/", Component: Events },
    ])

    return <RouterProvider router={router}/>
}

export default App