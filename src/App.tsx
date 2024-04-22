import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { Home, ForgotPassword, Login, Register } from "./pages"
import {
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { dataProvider, liveProvider } from "./providers";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { createClient } from "graphql-ws";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./providers/auth";
import Layout from "./components/layout"
import resources from "./config/resources";
import CompanyListPage from "./pages/company/list";
const API_URL = "https://api.nestjs-query.refine.dev/graphql";
const WS_URL = "wss://api.nestjs-query.refine.dev/graphql";





function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <AntdApp>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              liveProvider={liveProvider}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={resources}

              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "WVyLEd-4karEq-tItoeC",
                liveMode: "auto",
              }}
            >
              <Routes>

                <Route path="/forgot-password" element={<ForgotPassword />}
                />

                <Route path="/login" element={<Login />}
                />

                <Route path="/register" element={<Register />}
                />

                <Route
                  element={
                    <Authenticated
                      key="authenticated-layout"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route index element={<Home />} />
                  <Route path= "/companies" element={<CompanyListPage/>}/>
                </Route>

              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
