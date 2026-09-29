import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { ScenarioLayout } from './components/ScenarioLayout';
import { Index, NotFound } from './pages/Index';
import { REGISTRY } from './scenarios/registry';

function App() {
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Index />} />
        {REGISTRY.map((s) => (
          <Route key={s.id} path={s.path} element={<ScenarioLayout scenario={s} />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
