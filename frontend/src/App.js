import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { CharacterSheetPage } from "@/pages/CharacterSheetPage";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";

function App() {
    return (
        <div className="App">
            <AppErrorBoundary>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<CharacterSheetPage />} />
                    </Routes>
                </BrowserRouter>
            </AppErrorBoundary>
            <Toaster 
                position="top-right" 
                toastOptions={{
                    style: {
                        background: '#18181b',
                        border: '1px solid #27272a',
                        color: '#e4e4e7',
                    },
                }}
            />
        </div>
    );
}

export default App;
