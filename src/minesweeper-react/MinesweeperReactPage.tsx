import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { store } from "./app/store";
import AboutPage from "./AboutPage";
import Game from "./features/game/Game";
import MinesweeperDesktop from "./MinesweeperDesktop";
import Window from "./Window";
import styles from "./minesweeperReactPage.module.css";

const GAME_SETTINGS = { height: 16, width: 16, minesCount: 40 } as const;

export default function MinesweeperReactPage() {
  return (
    <Provider store={store}>
      <div className={styles.scope}>
        <Routes>
          <Route path="/" element={<MinesweeperDesktop />}>
            <Route
              path="about"
              element={
                <Window title="About Me">
                  <AboutPage />
                </Window>
              }
            />
            <Route
              path="minesweeper"
              element={
                <Window title="Minesweeper">
                  <Game settings={GAME_SETTINGS} />
                </Window>
              }
            />
          </Route>
        </Routes>
      </div>
    </Provider>
  );
}