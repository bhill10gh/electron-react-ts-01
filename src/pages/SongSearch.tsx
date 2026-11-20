import CollapsiblePanel from "../components/CollapsiblePanel";
import SongSearchFilters from "../components/SongSearch";
import FindArtistSongs from "./FindArtistSongs";
import FindSong from "./FindSong";

function SongSearch() {
  return (
    <>
      <CollapsiblePanel title="Single Song Search" defaultOpen={false}>
        <CollapsiblePanel title="Find Song" defaultOpen={true}>
          <div>
            <FindSong title="" />
          </div>
        </CollapsiblePanel>
        <CollapsiblePanel title="Find Artist Songs" defaultOpen={true}>
          <div>
            <FindArtistSongs title="" />
          </div>
        </CollapsiblePanel>
      </CollapsiblePanel>
      <CollapsiblePanel
        title="Multiple Filters Song Search"
        defaultOpen={false}
      >
        <div>
          <SongSearchFilters />
        </div>
      </CollapsiblePanel>
    </>
  );
}

export default SongSearch;
