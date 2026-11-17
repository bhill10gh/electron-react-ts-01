import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { DownloadHtmlBySelector } from "./DownloadHtmlBySelector";
import { buildHtmlFromSelectors } from "../utilities/getPageHtml";
import { createPdfFromHtml } from "../utilities/pdfUtilities";
import { TailwindButton } from "./TailwindButton";
export function MenuWithScrollingContent() {
  return (
    <div
      id="app-menu"
      className="sticky top-0 z-50 -mx-4 mb-4 flex flex-row flex-wrap items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 shadow-sm"
    >
      <Menu>
        <MenuHandler>
          <TailwindButton variant="default">Menu</TailwindButton>
        </MenuHandler>
        <MenuList
          className="max-h-72"
          placeholder="Menu List"
          title="Menu List"
          onResize={() => {}}
          onResizeCapture={() => {}}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          onClick={() => {}}
          onPointerEnter={() => {}}
          onPointerLeave={() => {}}
        >
          <MenuItem
            placeholder="Menu Item 1"
            title="Menu Item 1"
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            onClick={() => {}}
          >
            <Link className="text-blue-600 hover:underline" to="/">
              Home
            </Link>
          </MenuItem>
          <MenuItem
            placeholder="Menu Item 2"
            title="Menu Item 2"
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            onClick={() => {}}
          >
            <Link className="text-blue-600 hover:underline" to="/about">
              About
            </Link>
          </MenuItem>
          <MenuItem
            placeholder="Menu Item 3"
            title="Menu Item 3"
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            onClick={() => {}}
          >
            <Link className="text-blue-600 hover:underline" to="/weather">
              Weather
            </Link>
          </MenuItem>
          <MenuItem
            placeholder="Menu Item 4"
            title="Menu Item 4"
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            onClick={() => {}}
          >
            <Link
              className="text-blue-600 hover:underline"
              to="/employee-assignment"
            >
              Employee Assignment
            </Link>
          </MenuItem>
          <MenuItem
            placeholder="Menu Item 5"
            title="Menu Item 5"
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            onClick={() => {}}
          >
            <Link className="text-blue-600 hover:underline" to="/find-song">
              SongSearch
            </Link>
          </MenuItem>
          <MenuItem
            placeholder="Menu Item 6"
            title="Menu Item 6"
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            onClick={() => {}}
          >
            <Link className="text-blue-600 hover:underline" to="/file-reader">
              File Reader
            </Link>
          </MenuItem>
          <MenuItem
            placeholder="Menu Item 7"
            title="Menu Item 7"
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            onClick={() => {}}
          >
            <Link className="text-blue-600 hover:underline" to="/audio-player">
              Audio Player
            </Link>
          </MenuItem>
          <MenuItem
            placeholder="Menu Item 8"
            title="Menu Item 8"
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            onClick={() => {}}
          >
            <Link className="text-blue-600 hover:underline" to="/video-player">
              Video Player
            </Link>
          </MenuItem>
          <MenuItem
            placeholder="Menu Item 9"
            title="Menu Item 9"
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            onClick={() => {}}
          >
            <Link
              className="text-blue-600 hover:underline"
              to="/tailwind-buttons"
            >
              Tailwind Buttons
            </Link>
          </MenuItem>
          {/* <MenuItem
          placeholder="Menu Item 6"
          title="Menu Item 6"
          onResize={() => {}}
          onResizeCapture={() => {}}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          onClick={() => {}}
        >
          <button
            type="button"
            className="rounded-md p-2 hover:bg-red-500 hover:text-white"
            onClick={() => window.electronAPI.closeWindow()}
            aria-label="Close window"
          >
            ✕
          </button>
        </MenuItem> */}
        </MenuList>
      </Menu>
      <DownloadHtmlBySelector
        selector={["head", "#page-content"]}
        filename="menu-and-content.html"
        includeDocumentWrapper
        variant="default"
      >
        Download menu + content
      </DownloadHtmlBySelector>
      <TailwindButton
        variant="default"
        onClick={() => {
          const html: string | null = buildHtmlFromSelectors(
            ["head", "#page-content"],
            true,
          );
          if (html) {
            void createPdfFromHtml(html, "menu-and-content.pdf");
          } else {
            console.error("No HTML found");
          }
        }}
      >
        Generate PDF
      </TailwindButton>
    </div>
  );
}
