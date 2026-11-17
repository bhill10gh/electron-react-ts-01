import CollapsiblePanel from "../components/CollapsiblePanel";
import FindArtistSongs from "./FindArtistSongs";
import FindSong from "./FindSong";

function SongSearch() {
  return (
    <>
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
    </>
  );
}

export default SongSearch;
