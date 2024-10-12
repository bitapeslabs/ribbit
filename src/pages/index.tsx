import * as Pages from "./pages";

import { HashRouter, Routes, Route } from "react-router-dom";

const PageRoutes: Array<{ path: string; component: React.FC<{}> }> = [
  {
    path: "/",
    component: Pages.Home,
  },
];

export const Router = () => {
  return (
    <HashRouter>
      <Routes>
        {PageRoutes.map((Page, index) => {
          return (
            <Route key={index} path={Page.path} element={<Page.component />} />
          );
        })}
      </Routes>
    </HashRouter>
  );
};
