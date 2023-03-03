import React from 'react'
import ReactDOM from 'react-dom/client'

import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import { UserServiceClient } from './proto/user.api.client'
import UserPage from './pages/user'
import App from './App'
import { AllTypeTableServiceClient } from './proto/alltypetable.api.client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AllTypeTablePage from './pages/alltypetable'

let transport = new GrpcWebFetchTransport({
  baseUrl: "http://"+ window.location.hostname+ ":9000"
});

let client = new UserServiceClient(transport);
let all = new AllTypeTableServiceClient(transport);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App></App>,
    children: [
      {
        path: "/user",
        element: <UserPage client={client}></UserPage>,
      },
      {
        path: '/all_type_table',
        element: <AllTypeTablePage client={all}></AllTypeTablePage>
      }

    ]
  },

]);



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
