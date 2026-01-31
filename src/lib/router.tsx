import { createBrowserRouter, Navigate } from "react-router-dom";
import HubLanding from "../pages/HubLanding";
import GamesLanding from "../pages/GamesLanding";
import ToolsLanding from "../pages/ToolsLanding";
import VideoLibraryHome from "../sections/workbench-core-video-library-v1/VideoLibraryHome";
import EditorHome from "../sections/editor/EditorHome";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/hub" replace /> },

  { path: "/hub", element: <HubLanding /> },
  { path: "/videolibrary", element: <VideoLibraryHome /> },
  { path: "/games", element: <GamesLanding /> },
  { path: "/tools", element: <ToolsLanding /> },

  { path: "/editor", element: <EditorHome /> },

  // fallback for 404
  { path: "*", element: <Navigate to="/hub" replace /> }
]);
