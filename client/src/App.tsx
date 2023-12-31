import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./layout/Layout";
import SongPage from "./pages/SongPage";
import ArtistPage from "./pages/ArtistPage";
import SearchPage from "./pages/SearchPage";
import AlbumPage from "./pages/AlbumPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/search" element={<SearchPage />} />

        <Route path="/song/:id" element={<SongPage />} />
        <Route path="/album/:artistName/:title" element={<AlbumPage />} />
        <Route path="/artist/:id" element={<ArtistPage />} />
      </Route>
    </Routes>
  );
}

export default App;
