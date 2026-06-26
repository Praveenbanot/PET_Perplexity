import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Upload from "./pages/Upload";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
