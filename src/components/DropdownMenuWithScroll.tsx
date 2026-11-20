import { useState } from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { DownloadHtmlBySelector } from "./DownloadHtmlBySelector";
import { buildHtmlFromSelectors } from "../utilities/getPageHtml";
import { TailwindButton } from "./TailwindButton";
import { htmlToPdf } from "../utilities/htmlToPdf";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Weather", path: "/weather" },
  { label: "Employee Assignment", path: "/employee-assignment" },
  { label: "SongSearch", path: "/find-song" },
  { label: "File Reader", path: "/file-reader" },
  { label: "Audio Player", path: "/audio-player" },
  { label: "Video Player", path: "/video-player" },
  { label: "Tailwind Buttons", path: "/tailwind-buttons" },
] as const;

export function MenuWithScrollingContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const goTo = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <div
      id="app-menu"
      className="sticky top-0 z-50 -mx-4 mb-4 flex flex-row flex-wrap items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 shadow-sm"
    >
      <Menu open={menuOpen} handler={setMenuOpen} lockScroll={false}>
        <MenuHandler>
          <TailwindButton variant="default">Menu</TailwindButton>
        </MenuHandler>
        <MenuList
          className="max-h-72"
          placeholder="Menu List"
          onResize={() => {}}
          onResizeCapture={() => {}}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          {NAV_ITEMS.map(({ label, path }) => (
            <MenuItem
              key={path}
              placeholder={label}
              className="text-blue-600 hover:underline"
              onResize={() => {}}
              onResizeCapture={() => {}}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onClick={() => goTo(path)}
            >
              {label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <DownloadHtmlBySelector
        selector={["head", "#page-content"]}
        filename="menu-and-content.html"
        includeDocumentWrapper
        variant="default"
      >
        Save Content To HTML
      </DownloadHtmlBySelector>
      <TailwindButton
        variant="default"
        onClick={() => {
          const html: string | null = buildHtmlFromSelectors(
            ["head", "#page-content"],
            true,
          );
          if (html) {
            void htmlToPdf(html, { fileName: "menu-and-content.pdf" });
          } else {
            console.error("No HTML found");
          }
        }}
      >
        Save Content to PDF
      </TailwindButton>
    </div>
  );
}