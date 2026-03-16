import { BrowserRouter, Routes, Route } from 'react-router';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Shopkeepers } from './pages/Shopkeepers';
import { Customers } from './pages/Customers';
import { Transactions } from './pages/Transactions';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/shopkeepers" element={<Shopkeepers />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
