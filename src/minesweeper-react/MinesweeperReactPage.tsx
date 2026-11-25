import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { store } from "./app/store";
import AboutPage from "./AboutPage";
import MinesweeperWithSettings from "./features/game/MinesweeperWithSettings";
import MinesweeperDesktop from "./MinesweeperDesktop";
import Window from "./Window";
import styles from "./minesweeperReactPage.module.css";

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
                  <MinesweeperWithSettings />
                </Window>
              }
            />
          </Route>
        </Routes>
      </div>
    </Provider>
  );
}